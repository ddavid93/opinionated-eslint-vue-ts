import js from "@eslint/js";
import pluginVitest from "@vitest/eslint-plugin";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import pluginOxlint from "eslint-plugin-oxlint";
import prettier from "eslint-plugin-prettier/recommended";
import ts from "typescript-eslint";
import pluginUnicorn from "eslint-plugin-unicorn";
import vue from "eslint-plugin-vue";
import localRules from "../plugin.js";
import vueParser from "vue-eslint-parser";

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
  vueTsConfigs.recommended,
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
      complexity: ["warn", { max: 10 }],
      "no-nested-ternary": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
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
  // IMPORTANT: Vue SFC parsing
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // this is the parser used *inside* <script> (and <script setup>)
        parser: ts.parser,
        extraFileExtensions: [".vue"],
      },
    },
  },

  // Unicorn (Opinionated)
  pluginUnicorn.configs.recommended,
  {
    rules: {
      "unicorn/explicit-length-check": "off",
      "unicorn/switch-case-braces": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            Args: true,
            Fn: true,
            Params: true,
            Prev: true,
            Props: true,
            Ref: true,
            acc: true,
            args: true,
            ev: true,
            fn: true,
            paramName: true,
            params: true,
            prev: true,
            props: true,
            ref: true,
            src: true,
            utils: true,
            val: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "pascalCase",
        },
      ],
    },
  },
  {
    files: ["**/use*.ts"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
        },
      ],
    },
  },

  // ==============================================================================
  // 2. Vue Component Rules
  // ==============================================================================
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["App", "Layout"] },
      ],
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
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/prop-name-casing": ["error", "camelCase"],
      "vue/custom-event-name-casing": ["error", "kebab-case"],
      "vue/no-unused-properties": [
        "error",
        { groups: ["props", "data", "computed", "methods"] },
      ],
      "vue/no-unused-refs": "error",
      "vue/define-props-destructuring": "error",
      "vue/prefer-use-template-ref": "error",
      "vue/max-template-depth": ["error", { maxDepth: 7 }],
    },
  },

  // ==============================================================================
  // 4. Testing Rules (Vitest)
  // ==============================================================================
  {
    files: ["**/__tests__/*"],
    plugins: { vitest: pluginVitest },
    rules: {
      ...pluginVitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/no-duplicate-hooks": "error",
      "vitest/max-nested-describe": ["error", { max: 2 }],
      "vitest/no-conditional-in-test": "warn",
    },
  },

  {
    files: ["**/__tests__/**/*.{ts,spec.ts}"],
    rules: {
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
    files: ["**/*.{ts,vue}"],
    plugins: { local: localRules },
    rules: {
      "local/composable-must-use-vue": "error",
      "local/extract-condition-variable": "error",
      "local/no-let-in-describe": "error",
      "local/enforce-type-naming": "error",
    },
  },

  // ==============================================================================
  // 6. Integrations (Oxlint, Prettier)
  // ==============================================================================

  {
    rules: {
      "@/curly": "error",
    },
  },

  prettier,
  {
    rules: {
      "prettier/prettier": "off",
    },
  },

  pluginOxlint.configs["flat/recommended"],

  skipFormatting,
);
