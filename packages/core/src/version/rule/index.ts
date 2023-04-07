import { Rule } from '../types'
import { config } from '../../config'

const RULE_OS_NAMES = {
  linux: 'linux',
  windows: 'windows',
  darwin: 'osx'
} as const

export function verifyRule(rule: Rule, flags: string[] = []): boolean {
  const { adapter } = config

  const assertions: boolean[] = [true]

  const { os } = rule

  if (os) {
    if (os.name) {
      assertions.push(os.name === RULE_OS_NAMES[adapter.os.name])
    }

    const currentRuleArch = adapter.os.isx64 ? 'x64' : 'x86'

    if (os.arch) {
      assertions.push(os.arch === currentRuleArch)
    }

    if (os.version) {
      assertions.push(RegExp(os.version).test(adapter.os.version))
    }
  }

  if (rule.features) {
    for (const feature in rule.features) {
      assertions.push(flags.includes(feature))
    }
  }

  return assertions.every(assertion => assertion === (rule.action === 'allow'))
}
