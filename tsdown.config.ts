import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'configs/full': 'src/configs/full.ts',
  },
  format: ['esm'],
  dts: true,
})
