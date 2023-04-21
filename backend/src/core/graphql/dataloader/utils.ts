import { ExecutionContext, InternalServerErrorException, Type } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import DataLoader from 'dataloader'
import { NEST_LOADER_CONTEXT_KEY } from './constants'
import { DataLoaderContext, DataLoaderInterceptor } from './interceptor'
import { IBaseDataLoader } from './types'

export function getDataLoaderContext(context: ExecutionContext): DataLoaderContext {
  if (context.getType<GqlContextType>() !== 'graphql')
    throw new InternalServerErrorException('@Loader should only be used within the GraphQL context')

  const graphqlContext = GqlExecutionContext.create(context).getContext()

  const nestDataLoaderContext = graphqlContext[NEST_LOADER_CONTEXT_KEY]
  if (!nestDataLoaderContext) {
    throw new InternalServerErrorException(
      `You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}`,
    )
  }

  return nestDataLoaderContext
}

export function getDataLoader<K = any, V = any>(
  graphqlContext: any,
  loader: Type<IBaseDataLoader<K, V>>,
): Promise<DataLoader<K, V>> {
  const nestDataLoaderContext: DataLoaderContext = graphqlContext[NEST_LOADER_CONTEXT_KEY]
  if (!nestDataLoaderContext) throw new InternalServerErrorException('The loader is not provided')

  return nestDataLoaderContext.getLoader(loader)
}

export interface EnsureOrderOptions<T = unknown, U = unknown> {
  docs: T[]
  keys: U[]
  prop: string
  error?: (key: U) => string
}

// https://github.com/graphql/dataloader/issues/66#issuecomment-386252044
export function ensureOrder<T = unknown, U = unknown>(options: EnsureOrderOptions<T, U>) {
  const { docs, keys, prop, error = (key: unknown) => `Document does not exist (${key})` } = options
  if (Array.isArray(docs[0])) return docs

  // Put documents (docs) into a map where key is a document's ID or some
  // property (prop) of a document and value is a document.
  const docsMap = new Map<U, T>()
  // @ts-expect-error Type always has string index signature
  docs.forEach((doc) => docsMap.set(doc[prop] as U, doc))
  // Loop through the keys and for each one retrieve proper document. For not
  // existing documents generate an error.
  return keys.map((key) => {
    return docsMap.get(key) || new Error(typeof error === 'function' ? error(key) : error)
  })
}
