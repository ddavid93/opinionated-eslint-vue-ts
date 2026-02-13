import js from "@eslint/js";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginImportX from "eslint-plugin-import-x";
import pluginOxlint from "eslint-plugin-oxlint";
import { configs as pnpmConfigs } from "eslint-plugin-pnpm";
import pluginUnicorn from "eslint-plugin-unicorn";
import localRules from "./eslint-local-rules/index.js";

export default defineConfigWithVueTs(
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },

  // ==============================================================================
  // 1. Base Configurations (JS, TS, Vue, Prettier)
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
  vueTsConfigs.recommended, // Opinionated Vue+TS config
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

  // Vue Recommended
  ...vue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
      },
    },
  },

  // Unicorn (Opinionated)
  pluginUnicorn.configs.recommended,

  // ==============================================================================
  // 2. Vue Component Rules
  // ==============================================================================
  {
    files: ["src/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["App", "Layout"] },
      ], // Merged ignores
      "vue/attribute-hyphenation": ["error", "never"],
      "vue/v-on-event-hyphenation": ["error", "never"],
      "vue/no-v-html": "error",
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/block-order": [
        "error",
        { order: ["template", "script[setup]", "style[scoped]"] },
      ],
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/define-emits-declaration": "error",
      "vue/define-macros-order": [
        "error",
        {
          order: [
            "defineOptions",
            "defineModel",
            "defineProps",
            "defineEmits",
            "defineSlots",
          ],
          defineExposeLast: true,
        },
      ],
      "vue/define-props-declaration": "error",
      "vue/html-button-has-type": "error",
      "vue/require-default-prop": "off",
      "vue/no-multiple-objects-in-class": "error",
      "vue/no-root-v-if": "error",
      "vue/no-template-target-blank": "error",
      "vue/no-undef-properties": "error",
      "vue/no-use-v-else-with-v-for": "error",
      "vue/no-useless-mustaches": "error",
      "vue/no-useless-v-bind": "error",
      "vue/no-v-text": "error",
      "vue/padding-line-between-blocks": "error",
      "vue/prefer-define-options": "error",
      "vue/prefer-separate-static-class": "error",
      "vue/prefer-true-attribute-shorthand": "error",
      "vue/require-macro-variable-name": "error",
      "vue/require-typed-ref": "error",
      "vue/v-for-delimiter-style": "error",
      "vue/valid-define-options": "error",
      // Enforce PascalCase for components in templates
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      // Enforce camelCase for props
      "vue/prop-name-casing": ["error", "camelCase"],
      // Enforce kebab-case for custom events
      "vue/custom-event-name-casing": ["error", "kebab-case"],
      // Prevent dead code by flagging unused properties
      "vue/no-unused-properties": [
        "error",
        { groups: ["props", "data", "computed", "methods"] },
      ],
      // Prevent unused refs
      "vue/no-unused-refs": "error",
      // Enforce destructuring props for better readability
      "vue/define-props-destructuring": "error",
      // Use useTemplateRef() which is safer than string refs
      "vue/prefer-use-template-ref": "error",
      // prevent deeply nested logic in templates (Move to computed!)
      "vue/max-template-depth": ["error", { maxDepth: 7 }],
    },
  },

  // ==============================================================================
  // 3. Feature Boundaries & Architecture
  // ==============================================================================
  {
    files: ["src/**/*.{ts,vue}"],
    plugins: { "import-x": pluginImportX },
    rules: {
      // ----------------------------------------------------------------------
      // Prevent Circular Dependencies & Spaghetti Architecture
      // ----------------------------------------------------------------------
      "import-x/no-restricted-paths": [
        "error",
        {
          zones: [
            // Views are top-level. They use features, but features NEVER import from views.
            {
              target: "./src/features",
              from: "./src/views",
              message:
                "❌ UNIDIRECTIONAL FLOW: Features cannot import from views. Views orchestrate features.",
            },
          ],
        },
      ],
    },
  },

  // ==============================================================================
  // 4. Testing Rules (Vitest)
  // ==============================================================================
  {
    files: ["src/**/__tests__/*"],
    plugins: { vitest: pluginVitest },
    rules: {
      ...pluginVitest.configs.recommended.rules,
      // Always use 'it' instead of 'test' for consistency
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      // Hooks (beforeEach) must be at the top
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/no-duplicate-hooks": "error",
      // Limit nested describe blocks to prevent deep nesting hell
      "vitest/max-nested-describe": ["error", { max: 2 }],
      // Warn on conditionals in tests (tests should be deterministic linear flows)
      "vitest/no-conditional-in-test": "warn",
    },
  },

  {
    files: ["src/**/__tests__/**/*.{ts,spec.ts}"],
    rules: {
      // Force usage of our test helpers instead of raw library imports
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "vitest-browser-vue",
              importNames: ["render"],
              message:
                "❌ Use createTestApp() helper instead of raw render() to ensure plugins (Pinia, Router) are loaded.",
            },
            {
              name: "@vue/test-utils",
              importNames: ["mount"],
              message:
                "❌ Use createTestApp() helper instead of raw mount() to ensure plugins are loaded.",
            },
          ],
        },
      ],
    },
  },

  // ==============================================================================
  // 5. Custom Local Rules
  // ==============================================================================
  {
    files: ["src/**/*.{ts,vue}"],
    plugins: { local: localRules },
    rules: {
      // ----------------------------------------------------------------------
      // Enforce "composables" (use*) actually use Vue features.
      // If it doesn't use Vue check, it's a utility, not a composable.
      "local/composable-must-use-vue": "error",

      // ----------------------------------------------------------------------
      // Enforce extracting complex conditions into variables.
      // if (a && b && !c && d) -> const canSubmit = ...; if (canSubmit)
      "local/extract-condition-variable": "error",

      // ----------------------------------------------------------------------
      // Prevent mutable shared state in tests.
      // let count; beforeEach(...) -> use setup() factory functions instead.
      "local/no-let-in-describe": "error",

      // ----------------------------------------------------------------------
      // Enforce consistent naming for Types and Interfaces.
      // Interfaces: MUST start with "I" (e.g., IUser)
      // Types: MUST end with "Type" (e.g., UserType)
      "local/enforce-type-naming": "error",
    },
  },

  // ==============================================================================
  // 6. Integrations (Oxlint, Prettier, pnpm)
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

  // pnpm catalog enforcement
  pnpmConfigs.recommended,

  skipFormatting
);
