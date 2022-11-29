/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
export const NEST_LOADER_CONTEXT_KEY = 'NEST_LOADER_CONTEXT_KEY' as const
