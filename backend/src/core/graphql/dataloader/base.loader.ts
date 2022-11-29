import DataLoader from 'dataloader'
import { IBaseDataLoader } from './types'
import { ensureOrder } from './utils'

export interface BaseDataLoaderOptions<ID, Type> {
  propertyName?: string
  query: (keys: ID[]) => Promise<Type[]>
  typeName?: string
  dataloaderConfig?: DataLoader.Options<ID, Type>
}

// tslint:disable-next-line: max-classes-per-file
export abstract class BaseDataLoader<ID, Type> implements IBaseDataLoader<ID, Type> {
  protected abstract getOptions(): BaseDataLoaderOptions<ID, Type>

  public generateDataLoader() {
    return this.createLoader(this.getOptions())
  }

  protected createLoader(options: BaseDataLoaderOptions<ID, Type>): DataLoader<ID, Type> {
    const defaultTypeName = this.constructor.name.replace('Loader', '')
    return new DataLoader<ID, Type>(
      async (keys: ID[]) => {
        return ensureOrder({
          docs: await options.query(keys),
          keys,
          prop: options.propertyName || 'id',
          error: (keyValue: unknown) => `${options.typeName || defaultTypeName} does not exist (${keyValue})`,
        })
      },
      {
        ...options.dataloaderConfig,
        cache: false,
      },
    )
  }
}
