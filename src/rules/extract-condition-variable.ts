import type { Rule } from 'eslint'

const OPERATOR_THRESHOLD = 3

interface BaseNode {
  type: string
}

interface LogicalExpressionNode extends BaseNode {
  type: 'LogicalExpression'
  left: BaseNode
  right: BaseNode
}

interface IfStatementNode extends BaseNode {
  type: 'IfStatement'
  test: BaseNode | null
}

function isLogicalExpression(node: BaseNode): node is LogicalExpressionNode {
  return node.type === 'LogicalExpression'
}

function isIfStatement(node: unknown): node is IfStatementNode {
  if (!node || typeof node !== 'object') return false
  const candidate = node as IfStatementNode
  return candidate.type === 'IfStatement'
}

function countOperators(node: BaseNode | null): number {
  if (!node) return 0
  if (isLogicalExpression(node)) {
    return 1 + countOperators(node.left) + countOperators(node.right)
  }
  return 0
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      extractCondition:
        'COMPLEXITY ALERT: This condition is too complex ({{count}} operators). Extract it into a named variable to explain WHAT it checks.',
    },
  },
  create(context) {
    const listeners: Rule.RuleListener = {
      IfStatement(node) {
        if (!isIfStatement(node)) return
        const count = countOperators(node.test)
        if (count >= OPERATOR_THRESHOLD) {
          context.report({
            node: node.test ?? node,
            messageId: 'extractCondition',
            data: { count },
          })
        }
      },
    }

    return listeners
  },
}

export default rule
