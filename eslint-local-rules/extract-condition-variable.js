const OPERATOR_THRESHOLD = 3

function countOperators(node) {
    if (!node) return 0
    if (node.type === 'LogicalExpression') {
        return 1 + countOperators(node.left) + countOperators(node.right)
    }
    return 0
}

/**
 * Rule: extract-condition-variable
 * 
 * Why:
 * Complex boolean logic inside `if` statements hides business intent.
 * 
 * Fix:
 * Extract the condition into a `const` variable with a descriptive name.
 * 
 * Example:
 * // ❌ BAD
 * if (user.isActive && !user.isBanned && user.role === 'admin')
 * 
 * // ✅ GOOD
 * const canAccessAdmin = user.isActive && !user.isBanned && user.role === 'admin'
 * if (canAccessAdmin)
 */
export default {
    meta: {
        messages: {
            extractCondition: 'COMPLEXITY ALERT: This condition is too complex ({{count}} operators). Extract it into a named variable to explain WHAT it checks.'
        }
    },
    create(context) {
        return {
            IfStatement(node) {
                const count = countOperators(node.test)
                if (count >= OPERATOR_THRESHOLD) {
                    context.report({
                        node: node.test,
                        messageId: 'extractCondition',
                        data: { count }
                    })
                }
            }
        }
    }
}
