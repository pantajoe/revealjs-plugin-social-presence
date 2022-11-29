import { ExecutionContext, InternalServerErrorException, Type, createParamDecorator } from '@nestjs/common'
import DataLoader from 'dataloader'
import { IBaseDataLoader } from '../types'
import { getDataLoaderContext } from '../utils'

/**
 * The decorator to be used within your graphql method.
 */
export const Loader = createParamDecorator(
  // tslint:disable-next-line: ban-types
  (data: Type<IBaseDataLoader<any, any>>, context: ExecutionContext): Promise<DataLoader<any, any>> => {
    if (!data) throw new InternalServerErrorException(`No loader provided to @Loader ('${data}')`)

    return getDataLoaderContext(context).getLoader(data)
  },
)
