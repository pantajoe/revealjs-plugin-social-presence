import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { DataLoaderContext } from '../interceptor'
import { getDataLoaderContext } from '../utils'

/**
 * The decorator to be used to get the data loader context
 */
export const LoaderContext = createParamDecorator((data: any, context: ExecutionContext): DataLoaderContext => {
  return getDataLoaderContext(context)
})
