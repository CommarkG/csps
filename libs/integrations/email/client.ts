// libs/integrations/email/client.ts
// S033-A: Platform email client using Resend.
// Graceful passthrough when RESEND_API_KEY not set — logs warning, returns failure.
// Note: react-email is a future upgrade path for richer templates; plain HTML is used now.

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

  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@csps.app'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const result = await resend.emails.send({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    })

    if (result.error) {
      console.error('[csps/email] Send failed:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true, id: result.data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[csps/email] Unexpected error:', message)
    return { success: false, error: message }
  }
}
