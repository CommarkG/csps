// solo_user_flow: auto_org + rate limiting (S036 wiring)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { rateLimitUser, rateLimitAuth } from '@csps/integrations/security/rate-limit'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/account-setup(.*)',
  '/api/auth/session-ready',
  '/api/webhooks(.*)',
])

const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  if (isAuthRoute(request)) {
    const rl = await rateLimitAuth(ip)
    if (!rl.success) {
      return new Response('Too many requests', { status: 429 })
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
    if (userId) {
      const rl = await rateLimitUser(userId)
      if (!rl.success) {
        return new Response('Too many requests', { status: 429 })
      }
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
