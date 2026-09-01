// Настраивает правила markdown-it: заменяет HTML-теги и добавляет классы и атрибуты.
import type { MarkdownIt, RendererRule } from 'markdown-it'
import type { MarkdownElementConfig } from './types'

function configureRule (
  md: MarkdownIt,
  ruleName: string,
  config: MarkdownElementConfig,
): void {
  for (const suffix of ['open', 'close']) {
    const rendererRule = `${ruleName}_${suffix}`
    const original: RendererRule | undefined = md.renderer.rules[rendererRule]

    md.renderer.rules[rendererRule] = (
      tokens,
      idx,
      options,
      env,
      self,
    ): string => {
      const token = tokens[idx]

      if (!token) {
        return ''
      }

      if (config.tag) {
        token.tag = config.tag
      }

      if (suffix === 'open') {
        if (config.class) {
          token.attrJoin('class', config.class)
        }

        if (config.attrs) {
          for (const [name, value] of Object.entries(config.attrs)) {
            token.attrSet(name, value)
          }
        }
      }

      if (original) {
        return original(
          tokens,
          idx,
          options,
          env,
          self,
        )
      }

      return self.renderToken(
        tokens,
        idx,
        options,
      )
    }
  }
}

export function configureMarkdownRenderer (
  md: MarkdownIt,
  config: Record<string, MarkdownElementConfig>,
): MarkdownIt {
  for (const [ruleName, ruleConfig] of Object.entries(config)) {
    configureRule(
      md,
      ruleName,
      ruleConfig,
    )
  }

  return md
}
