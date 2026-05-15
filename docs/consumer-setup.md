# Consumer Setup

## Recommended Vite + UnoCSS Path

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'
```

```vue
<script setup lang="ts">
import { FeConfigProvider } from '@fizz/el-plus'
</script>

<template>
  <FeConfigProvider>
    <RouterView />
  </FeConfigProvider>
</template>
```

## UnoCSS

```ts
import { fizzPreset } from '@fizz/theme/preset/unocss'
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3(), fizzPreset()],
})
```

`@fizz/theme` currently recommends `presetWind3()` as the baseline UnoCSS
preset. `presetWind4()` should be discussed separately only when the consuming
application intentionally wants Tailwind 4-compatible utility semantics.

`@fizz/theme/styles` also carries the current baseline Fizz component styling
for button, input/select, table, dialog, and service surfaces. Application-level
brand overrides should still live in the consuming app after the package styles.

## Advanced SCSS Path

```scss
@use '@fizz/el-plus/styles/scss';
```

## Service APIs

Use fizz service APIs through explicit imports:

```ts
import { FeLoadingService, FeMessage } from '@fizz/el-plus'

FeMessage.success('Saved')

const loading = FeLoadingService({ target: document.body })
loading.close()
```

Fizz services automatically append fizz service classes such as `fe-message` and
`fe-loading` while preserving consumer-provided `customClass`.

Do not register service APIs with `app.use(FeMessage)` or
`app.use(FeLoadingService)`. Service app-level installation is intentionally not
part of the current contract.

## Element Plus Variable Overrides

`@fizz/el-plus/styles` already emits Element Plus styles under the `fe` namespace.
`@fizz/theme/styles` provides Fizz-owned variables used by wrapper and composite layers.

Applications that want to change Element Plus colors or radius should add their own override file after the package styles:

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'
```

```css
html:root {
  --fe-color-primary: #0f766e;
  --fe-color-primary-light-3: #5eead4;
  --fe-color-primary-light-5: #99f6e4;
  --fe-color-primary-light-7: #ccfbf1;
  --fe-color-primary-light-9: #f0fdfa;
  --fe-color-primary-dark-2: #115e59;
}
```

Do not use pseudo Element variables such as `--fe-color-primary-hover` unless Fizz code explicitly consumes them.

## Namespace Boundary

The supported path uses `@fizz/el-plus/styles` and `FeConfigProvider` to keep
Element Plus styles and runtime DOM on the `fe` namespace. `@fizz/theme` no
longer exports an `el` namespace bridge.
