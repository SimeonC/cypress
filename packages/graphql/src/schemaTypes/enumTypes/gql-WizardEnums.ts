import { BUNDLERS, CODE_LANGUAGES, FRONTEND_FRAMEWORKS, TESTING_TYPES, WIZARD_STEPS } from '@packages/types'
import { enumType } from 'nexus'

export const SupportedBundlerEnum = enumType({
  name: 'SupportedBundlers',
  description: 'The bundlers that we can use with Cypress',
  members: BUNDLERS.map((t) => t.type),
})

export const WizardNavigateDirectionEnum = enumType({
  name: 'WizardNavigateDirection',
  members: ['forward', 'back'],
})

export const WizardConfigFileStatusEnum = enumType({
  name: 'WizardConfigFileStatusEnum',
  members: ['changes', 'valid', 'skipped', 'error'],
})

export const FrontendFrameworkEnum = enumType({
  name: 'FrontendFrameworkEnum',
  members: FRONTEND_FRAMEWORKS.map((t) => t.type),
})

export const CodeLanguageEnum = enumType({
  name: 'CodeLanguageEnum',
  members: CODE_LANGUAGES.map((t) => t.type),
})

export const TestingTypeEnum = enumType({
  name: 'TestingTypeEnum',
  members: TESTING_TYPES.map((t) => t.type),
})

export const WizardStepEnum = enumType({
  name: 'WizardStep',
  members: WIZARD_STEPS.map((t) => t.type),
})
