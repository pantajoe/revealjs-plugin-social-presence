import { ContextId } from '@nestjs/core'
import { Type } from '@nestjs/common'
import DataLoader from 'dataloader'

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface IBaseDataLoader<ID, Type> {
  /**
   * Should return a new instance of dataloader each time
   */
  generateDataLoader(): DataLoader<ID, Type>
}

export interface DataLoaderFactory {
  (contextId: ContextId, type: Type<IBaseDataLoader<any, any>>): Promise<DataLoader<any, any>>
}
