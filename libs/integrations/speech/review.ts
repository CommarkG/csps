// libs/integrations/speech/review.ts
// @csps-enforces P-META-022 (intent crystallization before action — user corrections teach the system)
//
// ReviewSession: manages flagged speech segments awaiting user confirmation.
// Users confirm or reject suggested corrections; stats track quality over time.

import { SuspiciousFlag, ReviewItem, ReviewStats } from './types'

let _itemCounter = 0

export class ReviewSession {
  private items: Map<string, ReviewItem> = new Map()

  addFlag(flag: SuspiciousFlag, suggestedText?: string): string {
    const id = `review-${Date.now()}-${++_itemCounter}`
    this.items.set(id, {
      id,
      flag,
      originalText: flag.text,
      suggestedText,
      confirmed: null,
    })
    return id
  }

  getPendingReview(): ReviewItem[] {
    return Array.from(this.items.values()).filter(item => item.confirmed === null)
  }

  confirm(id: string, correct: boolean): void {
    const item = this.items.get(id)
    if (item) {
      item.confirmed = correct
    }
  }

  getStats(): ReviewStats {
    const all = Array.from(this.items.values())
    return {
      pending: all.filter(i => i.confirmed === null).length,
      confirmed: all.filter(i => i.confirmed === true).length,
      rejected: all.filter(i => i.confirmed === false).length,
      totalFlagged: all.length,
    }
  }

  clear(): void {
    this.items.clear()
  }
}
