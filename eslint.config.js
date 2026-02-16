import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs } from "@vue/eslint-config-typescript";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginUnicorn from "eslint-plugin-unicorn";

export default defineConfigWithVueTs(
  {
    ignores: ["**/node_modules/**", "**/*.d.ts"],
  },

  // ==============================================================================
  // 1. Base Configurations (JS, TS, Prettier)
  // ==============================================================================

  // JS Recommended
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "error",
    },
  },

  // TS Recommended
  ...ts.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",

      // Opinionated TS Rules
      // ----------------------------------------------------------------------
      // Enforce strict complexity limits to keep functions readable
      complexity: ["warn", { max: 10 }],
      // Avoid nested ternaries as they are hard to read
      "no-nested-ternary": "error",
      // Enforce type safety in assertions
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      // Restrict syntax that inevitably leads to technical debt
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            '❌ NO ENUMS: Use literal unions (type Role = "admin" | "user") or objects (const Role = { Admin: "admin" } as const). Enums generate bloated runtime code.',
        },
        {
          selector: "IfStatement > :not(IfStatement).alternate",
          message:
            "❌ NO ELSE: Use inclusive guard clauses (return early) instead of huge else blocks.",
        },
      ],
    },
  },

  // Unicorn (Opinionated)
  pluginUnicorn.configs.recommended,

  // ==============================================================================
  // 3. Integrations (Oxlint, Prettier)
  // ==============================================================================

  {
    rules: {
      "@/curly": "error",
    },
  },

  // Prettier
  prettier,
  {
    rules: {
      "prettier/prettier": "off",
    },
  },

  // Disable rules handled by Oxlint (Performance)
  pluginOxlint.configs["flat/recommended"],

  skipFormatting,
);
