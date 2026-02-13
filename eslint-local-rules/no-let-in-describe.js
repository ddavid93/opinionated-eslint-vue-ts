/**
 * Rule: no-let-in-describe
 * 
 * Why:
 * Using `let` variables defined in a `describe` block and mutated in `beforeEach` creates shared state.
 * This leads to "Test Pollution" where test B passes only if test A runs first.
 * Tests should be independent.
 * 
 * Fix:
 * Use a Factory/Setup function inside each test to create fresh state.
 * 
 * Example:
 * // ❌ BAD
 * let user;
 * beforeEach(() => { user = createUser() })
 * 
 * // ✅ GOOD
 * function setup() { return { user: createUser() } }
 * it('works', () => { const { user } = setup(); ... })
 */
export default {
    meta: {
        messages: {
            noLetInDescribe: 'AVOID SHARED STATE: Do not use `let` in describe blocks. This causes test pollution. Use a setup() function inside tests instead.'
        }
    },
    create(context) {
        let describeDepth = 0

        function isDescribeCall(node) {
            return (
                node.callee.type === 'Identifier' &&
                (node.callee.name === 'describe' || node.callee.name === 'context')
            )
        }

        return {
            CallExpression(node) {
                if (isDescribeCall(node)) describeDepth++
            },
            'CallExpression:exit'(node) {
                if (isDescribeCall(node)) describeDepth--
            },
            VariableDeclaration(node) {
                if (describeDepth > 0 && node.kind === 'let') {
                    context.report({ node, messageId: 'noLetInDescribe' })
                }
            }
        }
    }
}
