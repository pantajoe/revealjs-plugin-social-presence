import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type,
} from '@nestjs/common'
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import DataLoader from 'dataloader'
import { Observable } from 'rxjs'
import { NEST_LOADER_CONTEXT_KEY } from '../constants'
import { DataLoaderFactory, IBaseDataLoader } from '../types'

export class DataLoaderContext {
  private readonly id: ContextId = ContextIdFactory.create()
  private readonly cache: Map<Type<IBaseDataLoader<any, any>>, Promise<DataLoader<any, any>>> = new Map<
    Type<IBaseDataLoader<any, any>>,
    Promise<DataLoader<any, any>>
  >()

  constructor(private readonly dataloaderFactory: DataLoaderFactory) {}

  async clearAll() {
    for (const loaderPromise of this.cache.values()) {
      const loader = await loaderPromise
      loader.clearAll()
    }
  }

  getLoader(type: Type<IBaseDataLoader<any, any>>): Promise<DataLoader<any, any>> {
    let loader = this.cache.get(type)
    if (!loader) {
      loader = this.dataloaderFactory(this.id, type)
      this.cache.set(type, loader)
    }

    return loader
  }
}

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() !== 'graphql') return next.handle()

    const ctx = GqlExecutionContext.create(context).getContext()

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined)
      ctx[NEST_LOADER_CONTEXT_KEY] = new DataLoaderContext(this.createDataLoader.bind(this))

    return next.handle()
  }

  private async createDataLoader(
    contextId: ContextId,
    type: Type<IBaseDataLoader<any, any>>,
  ): Promise<DataLoader<any, any>> {
    try {
      const provider = await this.moduleRef.resolve<IBaseDataLoader<any, any>>(type, contextId, { strict: false })

      return provider.generateDataLoader()
    } catch (e) {
      throw new InternalServerErrorException(`The loader ${type} is not provided${e}`)
    }
  }
}
