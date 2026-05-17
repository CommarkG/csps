// deferred-packages.d.ts — Type stubs for deferred packages
/* eslint-disable @typescript-eslint/no-explicit-any */

// deferred-packages.d.ts — Type stubs for deferred packages
// Remove when actual packages are installed.

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'inngest' {
  export class Inngest {
    constructor(config: { id: string; signingKey?: string })
    send(event: { name: string; data?: any }): Promise<void>
    createFunction(config: { id: string; name?: string; retries?: number }, trigger: any, handler: any): any
  }
  export function serve(config: any): any
}

declare module 'inngest/next' {
  export function serve(config: any): any
}

declare module 'resend' {
  export class Resend { constructor(key: string); emails: any }
}

declare module 'posthog-node' {
  export class PostHog {
    constructor(key: string, opts?: any)
    capture(e: any): void
    groupIdentify(e: any): void
    identify(e: any): void
    shutdown(): Promise<void>
  }
}

declare module '@upstash/ratelimit' {
  export class Ratelimit {
    constructor(config: any)
    limit(id: string): Promise<{ success: boolean; reset: number; remaining: number }>
  }
  export namespace Ratelimit {
    function slidingWindow(requests: number, window: string): any
    function fixedWindow(requests: number, window: string): any
  }
}

declare module '@upstash/redis' {
  export class Redis {
    constructor(config: any)
    rpush(...args: any[]): Promise<any>
    lrange(...args: any[]): Promise<any[]>
    lrem(...args: any[]): Promise<any>
  }
}

declare module '@aws-sdk/client-s3' {
  export class S3Client {
    constructor(config: any)
    send(command: any): Promise<any>
  }
  export class PutObjectCommand { constructor(input: any) }
  export class DeleteObjectCommand { constructor(input: any) }
  export class GetObjectCommand { constructor(input: any) }
}

declare module '@aws-sdk/s3-request-presigner' {
  export function getSignedUrl(client: any, command: any, opts?: any): Promise<string>
}

declare module 'zod' {
  namespace z {
    type infer<T> = any
    function string(): any
    function number(): any
    function date(): any
    function boolean(): any
    function object(shape: any): any
    function optional(schema: any): any
    const coerce: { string: () => any; number: () => any; date: () => any; boolean: () => any }
    function uuid(opts?: any): any
    function uuid(): any
  }
  const z: {
    string: typeof z.string
    number: typeof z.number
    date: typeof z.date
    boolean: typeof z.boolean
    object: typeof z.object
    optional: typeof z.optional
    coerce: typeof z.coerce
    infer: any
    [key: string]: any
  }
  export { z }
  export default z
}
