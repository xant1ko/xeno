// Создаёт общий экземпляр markdown-it со стилями элементов для интерфейса приложения.
import MarkdownIt from 'markdown-it'
import { configureMarkdownRenderer } from './configureMarkdownRenderer'

export const markdown = new MarkdownIt({
  // Markdown поступает от агента; разрешённый HTML должен быть доверенным или предварительно санитизированным.
  html: true,
  breaks: true,
  linkify: true,
})

configureMarkdownRenderer(markdown, {
  heading: {
    tag: 'div',
    class: 'text-title-large',
  },

  paragraph: {
    tag: 'div',
    class: 'my-0',
  },

  strong: {
    tag: 'span',
    class: 'font-weight-bold',
  },

  em: {
    tag: 'span',
    class: 'font-italic',
  },

  link: {
    tag: 'a',
    class: 'md-link',
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },

  bullet_list: {
    tag: 'ul',
    class: 'my-2',
  },

  ordered_list: {
    tag: 'ol',
    class: '',
  },

  list_item: {
    tag: 'li',
    class: 'my-0',
  },

  blockquote: {
    tag: 'div',
    class: 'ml-5 font-italic text-medium-emphasis',
  },

  table: {
    tag: 'table',
    class: 'border-sm pa-2 rounded-lg',
  },

  hr: {
    tag: 'hr',
    class: '',
  },

  image: {
    tag: 'img',
    class: '',
  },

  code: {
    tag: 'code',
    class: 'bg-color',
  },
})
