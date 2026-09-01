export function normalizePhone (phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`
}
