// CSPS TEMPLATE — replace [App Name] with your app name
// Standard Clerk middleware — protects all routes except public ones
// UX-001: /account-setup and /api/auth/session-ready are public (JWT refresh gap fix)

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/account-setup(.*)',
  '/api/auth/session-ready',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
