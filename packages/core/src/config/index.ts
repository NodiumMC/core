import { CoreAdapter } from '../adapter'

export interface CoreConfig {
  adapter: CoreAdapter
}

export const config: CoreConfig = {
  adapter: undefined!
}

export function configure(configPart: Partial<CoreConfig>) {
  for (const key in configPart) {
    config[key] = configPart[key]
  }
}
