import fullConfig from './configs/full.js'
import { plugin } from './plugin.js'

export const rules = plugin.rules
export const configs = {
  full: fullConfig,
}

const pluginWithConfigs = {
  ...plugin,
  configs,
}

export default pluginWithConfigs
