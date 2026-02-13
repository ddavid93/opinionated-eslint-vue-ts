# eslint-plugin-opinionated-vue-ts

Opinionated ESLint rules and a full flat config for Vue + TypeScript projects.

## Credits

This project is inspired by and borrows ideas from Alexander Op’s ESLint setup for Vue projects. Please see his work here:

- https://github.com/alexanderop
- https://alexop.dev/posts/opinionated-eslint-setup-vue-projects/

## Install

```bash
pnpm add -D eslint-plugin-opinionated-vue-ts
```

Install required peer dependencies for your stack:

- eslint
- @eslint/js
- typescript-eslint
- eslint-plugin-vue
- eslint-plugin-prettier
- @vue/eslint-config-typescript
- @vue/eslint-config-prettier
- eslint-plugin-import-x
- eslint-plugin-oxlint
- eslint-plugin-pnpm
- eslint-plugin-unicorn
- @vitest/eslint-plugin
- globals

## Usage (Flat Config)

```js
// eslint.config.js
import fullConfig from 'eslint-plugin-opinionated-vue-ts/configs/full'

export default fullConfig
```

## Usage (Plugin Only)

```js
// eslint.config.js
import opinionated from 'eslint-plugin-opinionated-vue-ts'

export default [
  {
    plugins: { local: opinionated },
    rules: {
      'local/composable-must-use-vue': 'error',
      'local/extract-condition-variable': 'error',
      'local/no-let-in-describe': 'error',
      'local/enforce-type-naming': 'error',
    },
  },
]
```

## What This Config Includes

This package bundles a full flat config that layers:

- ESLint recommended
- TypeScript ESLint recommended
- Vue recommended (flat)
- Unicorn recommended
- Vitest recommended
- Oxlint recommended
- pnpm recommended
- Prettier integration
- Custom local rules (documented below)

Per request, the default ESLint rules and Unicorn rules are not documented here. Only explicitly configured rules are documented, including Vue, TypeScript ESLint, Vitest, Import-X, and local custom rules.

## Rule Reference (Explicitly Configured)

### Local Custom Rules

#### `local/composable-must-use-vue`

Files named `useXxx.ts` must import from Vue or Vue-related libraries (`vue`, `@vueuse/core`, `vue-router`, `vue-i18n`). If not, they should be renamed to a utility.

```ts
// ❌ Bad: no Vue imports
export function useDateFormatter() {
  return (value: string) => value
}

// ✅ Good: uses Vue
import { computed } from 'vue'
export function useDateFormatter(value: string) {
  return computed(() => value.trim())
}
```

#### `local/extract-condition-variable`

If an `if` condition uses 3+ logical operators, extract it to a named variable.

```ts
// ❌ Bad
if (user.isActive && !user.isBanned && user.role === 'admin') {
  // ...
}

// ✅ Good
const canAccessAdmin = user.isActive && !user.isBanned && user.role === 'admin'
if (canAccessAdmin) {
  // ...
}
```

#### `local/no-let-in-describe`

Disallow `let` declarations inside `describe` blocks to avoid shared mutable test state.

```ts
// ❌ Bad
describe('thing', () => {
  let user
  beforeEach(() => {
    user = createUser()
  })
})

// ✅ Good
describe('thing', () => {
  function setup() {
    return { user: createUser() }
  }

  it('works', () => {
    const { user } = setup()
  })
})
```

#### `local/enforce-type-naming`

Interfaces must start with `I` and types must end with `Type`.

```ts
// ❌ Bad
interface User {}
type User = { id: string }

// ✅ Good
interface IUser {}
type UserType = { id: string }
```

### TypeScript ESLint Rules

#### `@typescript-eslint/no-unused-vars`

Disallows unused variables (configured to ignore names starting with `_`).

```ts
// ❌ Bad
const foo = 1

// ✅ Good
const _foo = 1
```

#### `@typescript-eslint/no-explicit-any`

Disallows `any` to preserve type safety.

```ts
// ❌ Bad
const value: any = getValue()

// ✅ Good
const value: unknown = getValue()
```

#### `@typescript-eslint/consistent-type-assertions`

Disallows type assertions (configured with `assertionStyle: "never"`).

```ts
// ❌ Bad
const value = foo as string

// ✅ Good
function isString(input: unknown): input is string {
  return typeof input === 'string'
}
```

### Vitest Rules

#### `vitest/consistent-test-it`

Enforces `it` instead of `test`.

```ts
// ❌ Bad
test('works', () => {})

// ✅ Good
it('works', () => {})
```

#### `vitest/prefer-hooks-on-top`

Requires hooks (`beforeEach`, `afterEach`, etc.) to appear before tests in a `describe` block.

```ts
// ❌ Bad
it('works', () => {})
beforeEach(() => {})

// ✅ Good
beforeEach(() => {})
it('works', () => {})
```

#### `vitest/prefer-hooks-in-order`

Requires hooks to follow the conventional order (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`).

```ts
// ❌ Bad
afterEach(() => {})
beforeEach(() => {})

// ✅ Good
beforeEach(() => {})
afterEach(() => {})
```

#### `vitest/no-duplicate-hooks`

Disallows duplicate hooks of the same type within a scope.

```ts
// ❌ Bad
beforeEach(() => {})
beforeEach(() => {})

// ✅ Good
beforeEach(() => {})
```

#### `vitest/max-nested-describe`

Limits nested `describe` depth to 2.

```ts
// ❌ Bad
describe('a', () => {
  describe('b', () => {
    describe('c', () => {})
  })
})

// ✅ Good
describe('a', () => {
  describe('b', () => {})
})
```

#### `vitest/no-conditional-in-test`

Disallows conditionals inside tests to keep them deterministic.

```ts
// ❌ Bad
it('works', () => {
  if (something) {
    expect(true).toBe(true)
  }
})

// ✅ Good
it('works', () => {
  expect(something).toBe(true)
})
```

### Import-X Rule

#### `import-x/no-restricted-paths`

Defines architectural import boundaries (configured to prevent `src/features` importing from `src/views`).

```ts
// ❌ Bad (in src/features/...)
import { SomeView } from '@/views/SomeView'

// ✅ Good
import { SomeFeature } from '@/features/some-feature'
```

### Vue Rules

Each rule below is configured explicitly in this package. Examples show the expected direction.

#### `vue/multi-word-component-names`

Enforces multi-word component names (with `App` and `Layout` allowed).

```vue
<!-- ❌ Bad -->
<script setup lang="ts">
defineOptions({ name: 'Button' })
</script>

<!-- ✅ Good -->
<script setup lang="ts">
defineOptions({ name: 'BaseButton' })
</script>
```

#### `vue/attribute-hyphenation`

Enforces `camelCase` props in templates (configured as `never`).

```vue
<!-- ❌ Bad -->
<MyComp user-name="Dan" />

<!-- ✅ Good -->
<MyComp userName="Dan" />
```

#### `vue/v-on-event-hyphenation`

Enforces `camelCase` event names in templates (configured as `never`).

```vue
<!-- ❌ Bad -->
<MyComp @user-click="onClick" />

<!-- ✅ Good -->
<MyComp @userClick="onClick" />
```

#### `vue/no-v-html`

Disallows `v-html` to prevent XSS.

```vue
<!-- ❌ Bad -->
<div v-html="rawHtml" />

<!-- ✅ Good -->
<div>{{ rawHtml }}</div>
```

#### `vue/block-lang`

Requires `lang="ts"` on `<script>` blocks.

```vue
<!-- ❌ Bad -->
<script setup>
</script>

<!-- ✅ Good -->
<script setup lang="ts">
</script>
```

#### `vue/block-order`

Enforces block order: `template`, `script[setup]`, `style[scoped]`.

```vue
<!-- ❌ Bad -->
<script setup lang="ts"></script>
<template></template>

<!-- ✅ Good -->
<template></template>
<script setup lang="ts"></script>
```

#### `vue/component-api-style`

Enforces `<script setup>` only.

```vue
<!-- ❌ Bad -->
<script>
export default {}
</script>

<!-- ✅ Good -->
<script setup lang="ts">
</script>
```

#### `vue/define-emits-declaration`

Requires type-based `defineEmits` declaration.

```ts
// ❌ Bad
const emit = defineEmits(['save'])

// ✅ Good
const emit = defineEmits<{
  (e: 'save'): void
}>()
```

#### `vue/define-macros-order`

Enforces macro ordering (defineOptions → defineModel → defineProps → defineEmits → defineSlots).

```ts
// ❌ Bad
const emit = defineEmits<{}>()
const props = defineProps<{ id: string }>()

// ✅ Good
const props = defineProps<{ id: string }>()
const emit = defineEmits<{}>()
```

#### `vue/define-props-declaration`

Requires type-based `defineProps` declaration.

```ts
// ❌ Bad
const props = defineProps(['id'])

// ✅ Good
const props = defineProps<{ id: string }>()
```

#### `vue/html-button-has-type`

Requires `<button>` elements to include a `type` attribute.

```vue
<!-- ❌ Bad -->
<button>Save</button>

<!-- ✅ Good -->
<button type="button">Save</button>
```

#### `vue/require-default-prop` (disabled)

Defaults are **not** required for optional props.

```ts
// ✅ Allowed
const props = defineProps<{ optional?: string }>()
```

#### `vue/no-multiple-objects-in-class`

Disallows multiple object syntax in `:class` bindings.

```vue
<!-- ❌ Bad -->
<div :class="[{ active }, { disabled }]" />

<!-- ✅ Good -->
<div :class="{ active, disabled }" />
```

#### `vue/no-root-v-if`

Disallows `v-if` on the root element.

```vue
<!-- ❌ Bad -->
<template>
  <div v-if="ok"></div>
</template>

<!-- ✅ Good -->
<template v-if="ok">
  <div></div>
</template>
```

#### `vue/no-template-target-blank`

Disallows `target="_blank"` without `rel="noopener noreferrer"`.

```vue
<!-- ❌ Bad -->
<a href="..." target="_blank">Link</a>

<!-- ✅ Good -->
<a href="..." target="_blank" rel="noopener noreferrer">Link</a>
```

#### `vue/no-undef-properties`

Disallows accessing undefined properties in templates.

```vue
<!-- ❌ Bad -->
<div>{{ missingProp }}</div>

<!-- ✅ Good -->
<div>{{ definedProp }}</div>
```

#### `vue/no-use-v-else-with-v-for`

Disallows `v-else`/`v-else-if` on the same element as `v-for`.

```vue
<!-- ❌ Bad -->
<li v-for="item in items" v-else></li>

<!-- ✅ Good -->
<li v-for="item in items"></li>
<li v-else></li>
```

#### `vue/no-useless-mustaches`

Disallows unnecessary mustaches in templates.

```vue
<!-- ❌ Bad -->
<div>{{ "text" }}</div>

<!-- ✅ Good -->
<div>text</div>
```

#### `vue/no-useless-v-bind`

Disallows `v-bind` with string literal values (use static attributes instead).

```vue
<!-- ❌ Bad -->
<div v-bind:foo="'bar'" />

<!-- ✅ Good -->
<div foo="bar" />
```

#### `vue/no-v-text`

Disallows `v-text` directive.

```vue
<!-- ❌ Bad -->
<div v-text="msg"></div>

<!-- ✅ Good -->
<div>{{ msg }}</div>
```

#### `vue/padding-line-between-blocks`

Enforces blank lines between `<template>`, `<script>`, and `<style>` blocks.

```vue
<!-- ✅ Good -->
<template></template>

<script setup lang="ts"></script>

<style scoped></style>
```

#### `vue/prefer-define-options`

Prefers `defineOptions()` over default export for component options.

```ts
// ❌ Bad
export default { name: 'MyComp' }

// ✅ Good
defineOptions({ name: 'MyComp' })
```

#### `vue/prefer-separate-static-class`

Requires static class attribute to be separate from `:class`.

```vue
<!-- ❌ Bad -->
<div :class="['root', classes]"></div>

<!-- ✅ Good -->
<div class="root" :class="classes"></div>
```

#### `vue/prefer-true-attribute-shorthand`

Requires shorthand for boolean attributes.

```vue
<!-- ❌ Bad -->
<button disabled="disabled"></button>

<!-- ✅ Good -->
<button disabled></button>
```

#### `vue/require-macro-variable-name`

Requires macro variable names to match their macro (`defineProps` → `props`).

```ts
// ❌ Bad
const p = defineProps<{ id: string }>()

// ✅ Good
const props = defineProps<{ id: string }>()
```

#### `vue/require-typed-ref`

Requires typed refs in `<script setup>`.

```ts
// ❌ Bad
const input = ref(null)

// ✅ Good
const input = ref<HTMLInputElement | null>(null)
```

#### `vue/v-for-delimiter-style`

Enforces delimiter style in `v-for` expressions.

```vue
<!-- ❌ Bad -->
<div v-for="item of items"></div>

<!-- ✅ Good -->
<div v-for="item in items"></div>
```

#### `vue/valid-define-options`

Ensures `defineOptions` has a valid argument.

```ts
// ❌ Bad
defineOptions()

// ✅ Good
defineOptions({ name: 'MyComp' })
```

#### `vue/component-name-in-template-casing`

Enforces PascalCase for components in templates.

```vue
<!-- ❌ Bad -->
<my-button />

<!-- ✅ Good -->
<MyButton />
```

#### `vue/prop-name-casing`

Enforces camelCase for prop names.

```ts
// ❌ Bad
const props = defineProps<{ 'user-name': string }>()

// ✅ Good
const props = defineProps<{ userName: string }>()
```

#### `vue/custom-event-name-casing`

Enforces kebab-case for custom events.

```ts
// ❌ Bad
emit('userClick')

// ✅ Good
emit('user-click')
```

#### `vue/no-unused-properties`

Disallows unused component properties (`props`, `data`, `computed`, `methods`).

```ts
// ❌ Bad
const props = defineProps<{ id: string; name: string }>()
// name never used

// ✅ Good
const props = defineProps<{ id: string }>()
```

#### `vue/no-unused-refs`

Disallows unused refs.

```ts
// ❌ Bad
const count = ref(0)

// ✅ Good
const count = ref(0)
console.log(count.value)
```

#### `vue/define-props-destructuring`

Requires destructuring of `defineProps`.

```ts
// ❌ Bad
const props = defineProps<{ id: string }>()

// ✅ Good
const { id } = defineProps<{ id: string }>()
```

#### `vue/prefer-use-template-ref`

Prefers `useTemplateRef()` over string refs.

```ts
// ❌ Bad
const input = ref(null)

// ✅ Good
const input = useTemplateRef<HTMLInputElement>('input')
```

#### `vue/max-template-depth`

Limits template depth to 7.

```vue
<!-- ❌ Bad -->
<div>
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
