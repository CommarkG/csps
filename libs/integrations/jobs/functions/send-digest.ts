// S033-B: Weekly digest — sent every Monday 8am to active tenant owners.
// IMPORTANT: Uses raw PrismaClient (NOT enhance()) — no auth context in scheduled jobs.

import { inngest } from '../inngest'
import { sendEmail, digestEmail } from '../../index'
import { PrismaClient } from '@prisma/client'

export const sendDigestFn = inngest.createFunction(
  {
    id: 'send-weekly-digest',
    name: 'Send Weekly Digest',
    retries: 2,
    triggers: [{ cron: '0 8 * * 1' }], // Monday 8am
  },
  async () => {
    // Raw prisma — no auth context in scheduled jobs (Opus Turn 49 RZF)
    const prisma = new PrismaClient()

    try {
      const results: { tenantId: string; sent: boolean }[] = []

      const activeTenants = await prisma.tenant.findMany({
        where: {
          subscriptionStatus: { in: ['trialing', 'active'] },
          deletedAt: null,
        },
        include: {
          members: {
            where: { role: 'owner', deletedAt: null },
            include: { user: { select: { email: true, displayName: true } } },
            take: 1,
          },
        },
        take: 1000, // batch limit — paginate in future
      })

      for (const tenant of activeTenants) {
        const owner = tenant.members[0]?.user
        if (!owner) continue

        // Placeholder summary — apps inject real activity via event data in future
        const weekSummary = [`Your workspace had activity this week`]

        const template = digestEmail({
          displayName: owner.displayName ?? owner.email,
          weekSummary,
          appName: tenant.name,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}`,
        })

        const result = await sendEmail({
          to: owner.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        })

        results.push({ tenantId: tenant.id, sent: result.success })
      }

      return { tenants: results.length, sent: results.filter(r => r.sent).length }
    } finally {
      await prisma.$disconnect()
    }
  }
)
