import type { Rule } from 'eslint'

interface IdentifierNode {
  type: 'Identifier'
  name: string
}

interface TSInterfaceDeclarationNode {
  type: 'TSInterfaceDeclaration'
  id: IdentifierNode
}

interface TSTypeAliasDeclarationNode {
  type: 'TSTypeAliasDeclaration'
  id: IdentifierNode
}

function isIdentifier(node: unknown): node is IdentifierNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as IdentifierNode
  return candidate.type === 'Identifier' && typeof candidate.name === 'string'
}

function isTSInterfaceDeclaration(
  node: unknown,
): node is TSInterfaceDeclarationNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as TSInterfaceDeclarationNode
  return candidate.type === 'TSInterfaceDeclaration' && isIdentifier(candidate.id)
}

function isTSTypeAliasDeclaration(
  node: unknown,
): node is TSTypeAliasDeclarationNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as TSTypeAliasDeclarationNode
  return candidate.type === 'TSTypeAliasDeclaration' && isIdentifier(candidate.id)
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      interfacePrefix: 'Interfaces must start with "I" (e.g., IUser).',
      typeSuffix: 'Types must end with "Type" (e.g., UserType).',
    },
  },
  create(context) {
    const listeners: Rule.RuleListener = {
      TSInterfaceDeclaration(node) {
        if (!isTSInterfaceDeclaration(node)) return
        if (!node.id.name.startsWith('I')) {
          context.report({ node: node.id, messageId: 'interfacePrefix' })
        }
      },
      TSTypeAliasDeclaration(node) {
        if (!isTSTypeAliasDeclaration(node)) return
        if (!node.id.name.endsWith('Type')) {
          context.report({ node: node.id, messageId: 'typeSuffix' })
        }
      },
    }

    return listeners
  },
}

export default rule
