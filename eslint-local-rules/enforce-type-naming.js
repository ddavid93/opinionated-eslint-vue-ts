/**
 * Rule: enforce-type-naming
 * 
 * Why:
 * Consistent naming makes code easier to scan.
 * - Interfaces usually define the shape of an object or contract: `IUser`
 * - Types are often aliases or unions: `UserType`
 * 
 * Fix:
 * - Rename interfaces to start with "I".
 * - Rename types to end with "Type".
 */
export default {
    meta: {
        messages: {
            interfacePrefix: 'Interfaces must start with "I" (e.g., IUser).',
            typeSuffix: 'Types must end with "Type" (e.g., UserType).'
        }
    },
    create(context) {
        return {
            TSInterfaceDeclaration(node) {
                if (!node.id.name.startsWith('I')) {
                    context.report({
                        node: node.id,
                        messageId: 'interfacePrefix'
                    })
                }
            },
            TSTypeAliasDeclaration(node) {
                if (!node.id.name.endsWith('Type')) {
                    context.report({
                        node: node.id,
                        messageId: 'typeSuffix'
                    })
                }
            }
        }
    }
}
