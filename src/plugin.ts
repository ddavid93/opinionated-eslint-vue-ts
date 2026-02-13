import type { Rule } from 'eslint'
import { rules } from './rules/index.js'

export interface IPlugin {
  rules: Record<string, Rule.RuleModule>
}

export const plugin: IPlugin = {
  rules,
}

export default plugin
