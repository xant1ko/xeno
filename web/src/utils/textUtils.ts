export function truncate (text: string, length = 60): string {
  return text.length > length ? `${text.slice(0, length)}…` : text
}
