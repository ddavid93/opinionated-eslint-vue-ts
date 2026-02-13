import composableMustUseVue from './composable-must-use-vue.js'
import noLetInDescribe from './no-let-in-describe.js'
import extractConditionVariable from './extract-condition-variable.js'
import enforceTypeNaming from './enforce-type-naming.js'

export default {
    rules: {
        'composable-must-use-vue': composableMustUseVue,
        'no-let-in-describe': noLetInDescribe,
        'extract-condition-variable': extractConditionVariable,
        'enforce-type-naming': enforceTypeNaming,
    },
}
