import type { Rule } from 'eslint'

interface IdentifierNode {
  type: 'Identifier'
  name: string
}

interface CallExpressionNode {
  type: 'CallExpression'
  callee: IdentifierNode
}

interface VariableDeclarationNode {
  type: 'VariableDeclaration'
  kind: 'const' | 'let' | 'var'
}

function isIdentifier(node: unknown): node is IdentifierNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as IdentifierNode
  return candidate.type === 'Identifier' && typeof candidate.name === 'string'
}

function isCallExpression(node: unknown): node is CallExpressionNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as CallExpressionNode
  return candidate.type === 'CallExpression' && isIdentifier(candidate.callee)
}

function isVariableDeclaration(node: unknown): node is VariableDeclarationNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as VariableDeclarationNode
  return (
    candidate.type === 'VariableDeclaration' &&
    (candidate.kind === 'let' || candidate.kind === 'const' || candidate.kind === 'var')
  )
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      noLetInDescribe:
        'AVOID SHARED STATE: Do not use `let` in describe blocks. This causes test pollution. Use a setup() function inside tests instead.',
    },
  },
  create(context) {
    let describeDepth = 0

    function isDescribeCall(node: unknown): node is CallExpressionNode {
      if (!isCallExpression(node)) return false
      return node.callee.name === 'describe' || node.callee.name === 'context'
    }

    const listeners: Rule.RuleListener = {
      CallExpression(node) {
        if (isDescribeCall(node)) describeDepth += 1
      },
      'CallExpression:exit'(node) {
        if (isDescribeCall(node)) describeDepth -= 1
      },
      VariableDeclaration(node) {
        if (!isVariableDeclaration(node)) return
        if (describeDepth > 0 && node.kind === 'let') {
          context.report({ node, messageId: 'noLetInDescribe' })
        }
      },
    }

    return listeners
  },
}

export default rule
