import { configure } from '../../config'
import { Rule } from '../types'
import { verifyRule } from './index'

function configureOsPort(name: 'windows' | 'linux' | 'darwin', arch: string, version: string) {
  configure({
    adapter: {
      os: {
        get name(): 'windows' | 'linux' | 'darwin' {
          return name
        },

        get version(): string {
          return version
        },

        get arch(): string {
          return arch
        },

        get isx64(): boolean {
          return arch.includes('64')
        },
      }
    } as any
  })
}

describe('core', () => {
  describe('version', () => {
    describe('rule', () => {
      it.concurrent('Should allow basic rule', () => {
        const rule: Rule = {
          action: 'allow'
        }

        expect(verifyRule(rule)).toBeTruthy()
      })

      it.concurrent('Should disallow basic rule', () => {
        const rule: Rule = {
          action: 'disallow'
        }

        expect(verifyRule(rule)).toBeFalsy()
      })

      it.concurrent('Should allow features rule', () => {
        const rule: Rule = {
          action: 'allow',
          features: {
            some_feature: true
          }
        }

        expect(verifyRule(rule)).toBeFalsy()
        expect(verifyRule(rule, ['some_feature'])).toBeTruthy()
      })

      it.concurrent('Should allow os rule (name)', () => {
        const rule: Rule = {
          action: 'allow',
          os: {
            name: 'windows'
          }
        }

        configureOsPort('windows', 'x86_64', '10.0')
        expect(verifyRule(rule)).toBeTruthy()
        configureOsPort('linux', 'x86_64', '5.0')
        expect(verifyRule(rule)).toBeFalsy()
      })

      it.concurrent('Should allow os rule (arch)', () => {
        const rule: Rule = {
          action: 'allow',
          os: {
            name: 'linux',
            arch: 'x64'
          }
        }

        configureOsPort('linux', 'x86_64', '5.0')
        expect(verifyRule(rule)).toBeTruthy()
        configureOsPort('linux', 'x86', '5.0')
        expect(verifyRule(rule)).toBeFalsy()
      })

      it.concurrent('Should allow os rule (version)', () => {
        const rule: Rule = {
          action: 'allow',
          os: {
            name: 'windows',
            version: '^10\\.'
          }
        }

        configureOsPort('windows', 'x86_64', '10.0')
        expect(verifyRule(rule)).toBeTruthy()
        configureOsPort('windows', 'x86_64', '7.0')
        expect(verifyRule(rule)).toBeFalsy()
      })
    })
  })
})
