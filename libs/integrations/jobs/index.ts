// libs/integrations/jobs/index.ts
// S033-B: Platform job registry. Import allFunctions in the API route handler.

export { inngest } from './inngest'
export { sendWelcomeEmailFn } from './functions/send-welcome-email'
export { checkTrialExpiryFn } from './functions/check-trial-expiry'
export { sendDigestFn } from './functions/send-digest'

import { sendWelcomeEmailFn } from './functions/send-welcome-email'
import { checkTrialExpiryFn } from './functions/check-trial-expiry'
import { sendDigestFn } from './functions/send-digest'

export const allFunctions = [
  sendWelcomeEmailFn,
  checkTrialExpiryFn,
  sendDigestFn,
]
