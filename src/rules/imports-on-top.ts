import type { Rule } from "eslint";

interface ImportDeclarationNode {
  type: "ImportDeclaration";
}

interface ProgramNode {
  type: "Program";
  body: Array<{ type: string }>;
}

function isImportDeclaration(node: { type: string }): node is ImportDeclarationNode {
  return node.type === "ImportDeclaration";
}

function isProgram(node: unknown): node is ProgramNode {
  if (!node || typeof node !== "object") {
    return false;
  }

  const candidate = node as ProgramNode;
  return candidate.type === "Program" && Array.isArray(candidate.body);
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      importsOnTop:
        "IMPORT ORDER: Move this import to the top of the file. Imports must be declared before any other statements.",
    },
  },
  create(context) {
    const listeners: Rule.RuleListener = {
      Program(node) {
        if (!isProgram(node)) {
          return;
        }

        let foundNonImportStatement = false;

        for (const statement of node.body) {
          if (isImportDeclaration(statement)) {
            if (foundNonImportStatement) {
              context.report({ node: statement, messageId: "importsOnTop" });
            }
            continue;
          }

          foundNonImportStatement = true;
        }
      },
    };

    return listeners;
  },
};

export default rule;