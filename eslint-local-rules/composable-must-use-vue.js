import path from 'node:path'

// Sources that imply a file is a Vue "Composable"
const VALID_VUE_SOURCES = new Set(['vue', '@vueuse/core', 'vue-router', 'vue-i18n'])

function isComposableFilename(filename) {
    // Matches "useMyComposable.ts" but not "user.ts"
    return /^use[A-Z]/.test(path.basename(filename, '.ts'))
}

/**
 * Rule: composable-must-use-vue
 * 
 * Why: 
 * Naming a file `useSomething.ts` implies it engages with Vue's reactivity system (Lifecycle, Refs, Watchers).
 * If a `use*` file does NOT import from Vue, it is likely a stateless utility function.
 * 
 * Fix:
 * 1. If it needs reactivity: Add `ref`, `computed`, etc.
 * 2. If it's pure logic: Rename the file to standard camelCase (e.g., `formatDate.ts` instead of `useDateFormatter.ts`)
 *    and move it to `utils/` or `lib/`.
 */
export default {
    meta: {
        messages: {
            notAComposable: 'File "{{filename}}" is named like a Composable (use*) but does not import from Vue. If this is a utility, rename it. If it is a composable, utilize Vue features.'
        }
    },
    create(context) {
        if (!isComposableFilename(context.filename)) return {}
        let hasVueImport = false
        return {
            ImportDeclaration(node) {
                if (VALID_VUE_SOURCES.has(node.source.value)) {
                    hasVueImport = true
                }
            },
            'Program:exit'(node) {
                if (!hasVueImport) {
                    context.report({
                        node,
                        messageId: 'notAComposable',
                        data: { filename: path.basename(context.filename) }
                    })
                }
            }
        }
    }
}
