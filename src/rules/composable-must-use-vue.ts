import path from 'node:path'
import type { Rule } from 'eslint'

const VALID_VUE_SOURCES = new Set<string>([
  'vue',
  '@vueuse/core',
  'vue-router',
  'vue-i18n',
])

function isComposableFilename(filename: string): boolean {
  return /^use[A-Z]/.test(path.basename(filename, '.ts'))
}

interface ImportDeclarationNode {
  type: 'ImportDeclaration'
  source: { value: string }
}

function isImportDeclaration(node: unknown): node is ImportDeclarationNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as ImportDeclarationNode
  return (
    candidate.type === 'ImportDeclaration' &&
    typeof candidate.source?.value === 'string'
  )
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      notAComposable:
        'File "{{filename}}" is named like a Composable (use*) but does not import from Vue. If this is a utility, rename it. If it is a composable, utilize Vue features.',
    },
  },
  create(context) {
    if (!isComposableFilename(context.filename)) return {}
    let hasVueImport = false

    const listeners: Rule.RuleListener = {
      ImportDeclaration(node) {
        if (!isImportDeclaration(node)) return
        if (VALID_VUE_SOURCES.has(node.source.value)) {
          hasVueImport = true
        }
      },
      'Program:exit'(node) {
        if (hasVueImport) return
        context.report({
          node,
          messageId: 'notAComposable',
          data: { filename: path.basename(context.filename) },
        })
      },
    }

    return listeners
  },
}

export default rule
