// libs/integrations/email/client.ts
// wiring_deferred_until: S040 (requires pnpm add resend + RESEND_API_KEY)
// Stub: graceful failure until resend package installed + env var set

type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

type SendEmailResult = {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[csps/email] RESEND_API_KEY not set — email not sent:', input.subject)
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }
  console.warn('[csps/email] resend package not installed — email not sent:', input.subject)
  return { success: false, error: 'resend package not installed' }
}
