// S033-B: Daily cron job — checks for expiring trials and sends reminder emails.
// IMPORTANT: Uses raw PrismaClient (NOT enhance()) — no auth context in scheduled jobs.
// Manually filters by tenantId and subscription status. Never use enhance() here.

import { inngest } from '../inngest'
import { sendEmail, trialExpiryEmail } from '../../index'
import { PrismaClient } from '@prisma/client'

const TRIAL_WARNING_DAYS = [7, 3, 1] // send reminders at these days remaining
const TRIAL_DURATION_DAYS = 14

export const checkTrialExpiryFn = inngest.createFunction(
  {
    id: 'check-trial-expiry',
    name: 'Check Trial Expiry',
    retries: 2,
    triggers: [{ cron: '0 9 * * *' }], // 9am daily
  },
  async () => {
    // Raw prisma — no auth context in scheduled jobs (Opus Turn 49 RZF)
    const prisma = new PrismaClient()

    try {
      const now = new Date()
      const results: { tenantId: string; sent: boolean }[] = []

      // Find tenants in trial — check each warning threshold
      for (const daysLeft of TRIAL_WARNING_DAYS) {
        const targetDate = new Date(now)
        targetDate.setDate(targetDate.getDate() + daysLeft - TRIAL_DURATION_DAYS)

        const expiringTenants = await prisma.tenant.findMany({
          where: {
            subscriptionStatus: 'trialing',
            deletedAt: null,
            createdAt: {
              gte: new Date(targetDate.setHours(0, 0, 0, 0)),
              lt: new Date(targetDate.setHours(23, 59, 59, 999)),
            },
          },
          include: {
            members: {
              where: { role: 'owner', deletedAt: null },
              include: { user: { select: { email: true, displayName: true } } },
              take: 1,
            },
          },
        })

        for (const tenant of expiringTenants) {
          const owner = tenant.members[0]?.user
          if (!owner) continue

          const template = trialExpiryEmail({
            displayName: owner.displayName ?? owner.email,
            daysLeft,
            upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/settings/billing`,
          })

          const result = await sendEmail({
            to: owner.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          })

          results.push({ tenantId: tenant.id, sent: result.success })
        }
      }

      return { checked: results.length, sent: results.filter(r => r.sent).length }
    } finally {
      await prisma.$disconnect()
    }
  }
)
