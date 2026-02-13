import type { Rule } from 'eslint'
import composableMustUseVue from './composable-must-use-vue.js'
import extractConditionVariable from './extract-condition-variable.js'
import enforceTypeNaming from './enforce-type-naming.js'
import noLetInDescribe from './no-let-in-describe.js'

export const rules: Record<string, Rule.RuleModule> = {
  'composable-must-use-vue': composableMustUseVue,
  'extract-condition-variable': extractConditionVariable,
  'enforce-type-naming': enforceTypeNaming,
  'no-let-in-describe': noLetInDescribe,
}
