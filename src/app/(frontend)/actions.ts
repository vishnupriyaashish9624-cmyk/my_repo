'use server'

import { cms } from '@/lib/cms'
import { ENQUIRY_TYPES, type EnquiryType } from '@/lib/enquiry'

export type QuoteState = { ok: boolean; message: string } | null

/** Saves a quote request as an Enquiry for the sales team to follow up in the admin. */
export async function createEnquiry(_prev: QuoteState, form: FormData): Promise<QuoteState> {
  const business = String(form.get('business') ?? '').trim()
  const phone = String(form.get('phone') ?? '').trim()
  const list = String(form.get('list') ?? '').trim()

  if (!business || !phone || !list) {
    return { ok: false, message: 'Add your business name, a phone or WhatsApp number, and what you need.' }
  }
  if (phone.replace(/\D/g, '').length < 7) {
    return { ok: false, message: 'Check the phone number: it needs at least 7 digits.' }
  }

  try {
    const payload = await cms()
    await payload.create({
      collection: 'enquiries',
      data: { business: business.slice(0, 200), phone: phone.slice(0, 40), list: list.slice(0, 5000) },
      overrideAccess: true,
    })
    return { ok: true, message: "Thanks, your list is with our sales team. We'll reply with a carton quote." }
  } catch {
    return { ok: false, message: "Your request didn't go through. Please try again, or message us on WhatsApp." }
  }
}

export type ContactState =
  | {
      ok: boolean
      message: string
      errors?: Partial<Record<'name' | 'email' | 'phone' | 'type' | 'message', string>>
    }
  | null

/** Saves a contact-page message as an Enquiry, tagged with its type, for the team to follow up. */
export async function sendContactEnquiry(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const name = get('name')
  const company = get('company')
  const email = get('email')
  const phone = get('phone')
  const type = get('type') as EnquiryType
  const message = get('message')

  const errors: NonNullable<ContactState>['errors'] = {}
  if (!name) errors.name = 'Add your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Add a valid email address.'
  if (phone.replace(/\D/g, '').length < 7) errors.phone = 'Add a phone number with at least 7 digits.'
  if (!ENQUIRY_TYPES.some((t) => t.value === type)) errors.type = 'Choose an enquiry type.'
  if (!message) errors.message = 'Tell us what you need.'
  if (Object.keys(errors).length) {
    return { ok: false, message: 'Check the highlighted fields and try again.', errors }
  }

  try {
    const payload = await cms()
    await payload.create({
      collection: 'enquiries',
      data: {
        business: (company || name).slice(0, 200),
        name: name.slice(0, 200),
        email: email.slice(0, 200),
        phone: phone.slice(0, 40),
        enquiryType: type,
        source: 'contact',
        list: message.slice(0, 5000),
      },
      overrideAccess: true,
    })
    return { ok: true, message: "Thanks, your message is with our team. We'll be in touch soon." }
  } catch {
    return { ok: false, message: "Your message didn't go through. Please try again, or message us on WhatsApp." }
  }
}

export type CategoryQuoteState =
  | {
      ok: boolean
      message: string
      errors?: Partial<Record<'name' | 'company' | 'email' | 'phone' | 'location' | 'products' | 'attachment', string>>
      /** What was typed, so the form can refill itself after a failed attempt. */
      values?: Record<string, string>
    }
  | null

const MAX_ATTACHMENT = 5 * 1024 * 1024

/**
 * Saves a category page's quote request (e.g. tissue & hygiene) as an Enquiry. The optional photo of a
 * pack label or dispenser is stored in Media and linked from the enquiry text.
 */
export async function sendCategoryQuote(_prev: CategoryQuoteState, form: FormData): Promise<CategoryQuoteState> {
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const category = get('category').slice(0, 80) || 'Category'
  const name = get('name')
  const company = get('company')
  const email = get('email')
  const phone = get('phone')
  const location = get('location')
  const products = form.getAll('products').map(String).filter(Boolean)
  const quantity = get('quantity')
  const requirements = get('requirements')
  const file = form.get('attachment')
  const upload = file instanceof File && file.size > 0 ? file : null

  const errors: NonNullable<CategoryQuoteState>['errors'] = {}
  if (!name) errors.name = 'Add your name.'
  if (!company) errors.company = 'Add your business or organisation.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Add a valid email address.'
  if (phone.replace(/\D/g, '').length < 7) errors.phone = 'Add a phone number with at least 7 digits.'
  if (!location) errors.location = 'Add the emirate and area for delivery.'
  if (!products.length) errors.products = 'Choose at least one product.'
  if (upload && !upload.type.startsWith('image/')) errors.attachment = 'Attach a photo (JPG, PNG or WebP).'
  else if (upload && upload.size > MAX_ATTACHMENT) errors.attachment = 'Keep the photo under 5 MB.'
  if (Object.keys(errors).length) {
    return { ok: false, message: 'Check the highlighted fields and try again.', errors, values: { name, company, email, phone, location, quantity, requirements } }
  }

  try {
    const payload = await cms()
    let photo = ''
    if (upload) {
      const doc = await payload.create({
        collection: 'media',
        data: { alt: `${category} enquiry from ${company}`.slice(0, 200) },
        file: {
          data: Buffer.from(await upload.arrayBuffer()),
          mimetype: upload.type,
          name: upload.name || 'attachment.jpg',
          size: upload.size,
        },
        overrideAccess: true,
      })
      photo = doc.url ?? `media #${doc.id}`
    }
    const list = [
      `${category} quote`,
      `Products: ${products.join(', ')}`,
      quantity && `Estimated quantity: ${quantity}`,
      `Delivery: ${location}`,
      requirements && `Requirements: ${requirements}`,
      photo && `Attachment: ${photo}`,
    ]
      .filter(Boolean)
      .join('\n')
    await payload.create({
      collection: 'enquiries',
      data: {
        business: company.slice(0, 200),
        name: name.slice(0, 200),
        email: email.slice(0, 200),
        phone: phone.slice(0, 40),
        enquiryType: 'quote',
        source: 'quote',
        list: list.slice(0, 5000),
      },
      overrideAccess: true,
    })
    return {
      ok: true,
      message:
        'Thank you for your enquiry. Our team will review your list and contact you to confirm the product details, quantities and pricing.',
    }
  } catch {
    return { ok: false, message: "Your request didn't go through. Please try again, or message us on WhatsApp." }
  }
}
