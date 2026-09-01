// Описывает изменения HTML-элемента, создаваемого правилом markdown-it.
export interface MarkdownElementConfig {
  tag?: string
  class?: string
  attrs?: Record<string, string>
}

export type MarkdownRendererConfig = Record<
  string,
  MarkdownElementConfig
>
