// libs/integrations/speech/dictionary.ts
// @csps-enforces P-META-022 (intent crystallization before action — user corrections teach the system)
//
// PersonalDictionary: learns from user corrections and applies them to future transcriptions.
// Corrections are stored in-memory per session; persistence is caller responsibility.

import { CorrectionRule } from './types'

export class PersonalDictionary {
  private rules: Map<string, CorrectionRule> = new Map()

  learn(wrong: string, right: string, context?: string): void {
    const existing = this.rules.get(wrong.toLowerCase())
    this.rules.set(wrong.toLowerCase(), {
      wrong: wrong.toLowerCase(),
      right,
      context,
      learnedAt: Date.now(),
      applyCount: existing ? existing.applyCount : 0,
    })
  }

  correct(text: string): string {
    let corrected = text
    for (const [wrong, rule] of this.rules) {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi')
      if (regex.test(corrected)) {
        corrected = corrected.replace(regex, rule.right)
        rule.applyCount++
      }
    }
    return corrected
  }

  exportRules(): CorrectionRule[] {
    return Array.from(this.rules.values())
  }

  get size(): number {
    return this.rules.size
  }
}
