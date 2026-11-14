/** Enquiry types on the contact page; values match the Enquiries collection's `enquiryType`. */
export const ENQUIRY_TYPES = [
  { value: 'general', label: 'General enquiry' },
  { value: 'product', label: 'Product enquiry' },
  { value: 'quote', label: 'Request a quote' },
  { value: 'bulk', label: 'Bulk & regular orders' },
  { value: 'delivery', label: 'Delivery enquiry' },
  { value: 'support', label: 'Order support' },
  { value: 'business', label: 'Business enquiry' },
] as const
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]['value']
