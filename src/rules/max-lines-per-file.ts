import type { Rule } from "eslint";

const DEFAULT_MAX_LINES = 150;

const rule: Rule.RuleModule = {
  meta: {
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "number", minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyLines:
        "FILE TOO LONG: This file has {{lineCount}} lines. Maximum allowed is {{max}}.",
    },
  },
  create(context) {
    const option = context.options[0] as { max?: number } | undefined;
    const max = option?.max ?? DEFAULT_MAX_LINES;

    const listeners: Rule.RuleListener = {
      Program(node) {
        const lineCount = context.sourceCode.lines.length;

        if (lineCount > max) {
          context.report({
            node,
            messageId: "tooManyLines",
            data: {
              lineCount: String(lineCount),
              max: String(max),
            },
          });
        }
      },
    };

    return listeners;
  },
};

export default rule;