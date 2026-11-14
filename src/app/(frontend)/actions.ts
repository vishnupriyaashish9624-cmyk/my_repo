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
