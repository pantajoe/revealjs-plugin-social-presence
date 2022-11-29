import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { isUUID } from 'class-validator'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { WebSocket } from 'socket.io'
import { snakeCase } from 'lodash'
import {
  ACTION_KEY,
  ActionDecoratorParam,
  IS_PUBLIC_KEY,
  ResourceOptions,
  TAction,
  USE_POLICY_KEY,
  USE_RESOURCE_OPTIONS_KEY,
} from '../decorator'
import { PolicyClass, PolicyContext, TPolicy } from '../policy/policy'
import { User } from '~/core/user/model'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private logger = new Logger('AuthorizationGuard')

  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
    private readonly orm: MikroORM,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const Policy = this.reflector.getAllAndOverride<PolicyClass<any, any>>(USE_POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!Policy) {
      this.logger.verbose(`Skip policy check for ${context.getClass().name}.${context.getHandler().name}`)
      return true
    }

    const resourceOptions = this.reflector.getAllAndOverride<ResourceOptions | undefined>(USE_RESOURCE_OPTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const policy = this.getPolicy(Policy)
    const action = this.getAction(context)

    const user = this.getUser(context)

    this.logger.verbose(
      `Check ${policy.constructor.name}.${action} for ${context.getClass().name}.${context.getHandler().name}`,
    )

    const request = this.getRequest(context)
    const policyContext: PolicyContext = {
      lecture: request.lecture,
      params: this.getParams(context),
    }

    return this.executePolicy(policy, action, { ctx: context, user, policyContext, resourceOptions })
  }

  @UseRequestContext()
  private async executePolicy(
    policy: TPolicy<any, any>,
    action: TAction,
    opts: { user: User; policyContext: PolicyContext; ctx: ExecutionContext; resourceOptions?: ResourceOptions },
  ) {
    const { user, policyContext, ctx, resourceOptions } = opts
    if (action === 'findAll') return policy[action](user, policyContext)

    const resource = await this.getResource(ctx, policy, action, policyContext, resourceOptions)
    return policy[action](user, resource, policyContext)
  }

  private getPolicy(PolicyClass: PolicyClass<any, any>) {
    const policy = this.moduleRef.get<TPolicy<any, any>>(PolicyClass, {
      strict: false,
    })

    if (!policy) {
      throw new InternalServerErrorException(`Policy "${PolicyClass.name}" not found, check the module providers`)
    }

    return policy
  }

  private getAction(context: ExecutionContext): TAction {
    const actionMetadata = this.reflector.getAllAndOverride<ActionDecoratorParam>(ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const decoratedAction =
      typeof actionMetadata === 'function' ? actionMetadata(this.getParams(context)) : actionMetadata

    if (decoratedAction) return decoratedAction

    const { name: className } = context.getClass()
    const { name: methodName } = context.getHandler()

    if (this.isValidActionType(methodName)) return methodName
    else {
      throw new InternalServerErrorException(`Method ${className}.${methodName} is not mapped to a valid action type`)
    }
  }

  private isValidActionType(action: string): action is TAction {
    return (['create', 'update', 'findOne', 'findAll', 'delete'] as TAction[]).includes(action as TAction)
  }

  @UseRequestContext()
  private async getResource(
    context: ExecutionContext,
    policy: TPolicy<any, any>,
    action: Exclude<TAction, 'findAll'>,
    policyContext: PolicyContext,
    resolver?: ResourceOptions,
  ) {
    const params = this.getParams(context)

    let resource: any
    if (typeof resolver === 'function') {
      const user = this.getUser(context)
      resource = await resolver({ em: this.orm.em, params, user, ctx: policyContext })
    } else {
      const keys = resolver ? (Array.isArray(resolver) ? resolver : [resolver]) : ['id']
      const queryParams = keys.reduce<Record<string, any>>((acc, key) => {
        if (params[key]) {
          acc[key] = params[key]
          if ((key === 'id' || snakeCase(key).endsWith('_id')) && !isUUID(params[key])) {
            throw new NotFoundException({
              statusCode: 404,
              message: 'Requested resource does not exist',
              error: 'Not Found',
            })
          }
        }
        return acc
      }, {})

      if (Object.keys(queryParams).length)
        resource = await this.orm.em.findOne(policy.resourceClass as InstanceType<any>, queryParams, { filters: false })
    }

    if (action !== 'create' && !resource) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Requested resource does not exist',
        error: 'Not Found',
      })
    }

    return resource
  }

  private getRequest<T = any>(context: ExecutionContext): T {
    if (context.getType() === 'ws') return context.switchToWs().getClient<WebSocket>().handshake as any
    if (context.getType<GqlContextType>() !== 'graphql') return context.switchToHttp().getRequest() as any

    const ctx = GqlExecutionContext.create(context)
    const { req, connection } = ctx.getContext()
    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    return connection?.context?.headers ? connection.context : req
  }

  private getUser(context: ExecutionContext): User {
    const request = this.getRequest(context)
    return request.user
  }

  private getParams(context: ExecutionContext): Record<string, any> {
    if (context.getType() === 'ws') {
      return {
        ...context.switchToWs().getData(),
        ...context.switchToWs().getClient<WebSocket>().handshake.query,
      }
    }
    if (context.getType<GqlContextType>() === 'graphql') {
      const graphqlArgs = GqlExecutionContext.create(context).getArgs()
      return {
        ...graphqlArgs,
        ...(graphqlArgs.input ? graphqlArgs.input : {}),
      }
    }

    const request = this.getRequest(context)
    return request.params
  }
}
