import { Module } from '@nestjs/common'
import AdminJS, { CurrentAdmin, ResourceOptions } from 'adminjs'
import ExpressSession from 'express-session'
import RedisStore from 'connect-redis'
import AdminJSMikroORM from '@adminjs/mikroorm'
import { AdminModule as AdminJSModule, AdminModuleOptions } from '@adminjs/nestjs'
import { MikroORM } from '@mikro-orm/core'
import { User } from '../user/model'
import { Lecture } from '../lecture/model'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/service'
import { createRedisClient } from '../util'
import { OrmModule } from '~/orm/orm.module'

AdminJS.registerAdapter({
  Resource: AdminJSMikroORM.Resource,
  Database: AdminJSMikroORM.Database,
})

const DefaultAdmin: CurrentAdmin = {
  email: 'root@example.com',
}

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [OrmModule, AuthModule],
      inject: [MikroORM, AuthService],
      useFactory: (orm: MikroORM, authService: AuthService): AdminModuleOptions => ({
        adminJsOptions: {
          rootPath: '/admin',
          branding: {
            companyName: 'Social Presence - Admin',
          },
          resources: [
            {
              resource: { model: User, orm },
              options: {
                listProperties: ['id', 'createdAt', 'updatedAt', 'email', 'name', 'role', 'profileColor'],
                showProperties: ['id', 'createdAt', 'updatedAt', 'email', 'name', 'role', 'profileColor'],
                editProperties: ['email', 'name', 'role', 'profileColor'],
                filterProperties: ['id', 'createdAt', 'updatedAt', 'email', 'name', 'role', 'profileColor'],
                properties: {
                  id: {
                    type: 'uuid',
                    isId: true,
                  },
                  createdAt: {
                    type: 'datetime',
                    isVisible: true,
                  },
                  updatedAt: {
                    type: 'datetime',
                    isVisible: true,
                  },
                  password: {
                    type: 'password',
                    isVisible: false,
                  },
                  refreshTokenExpiresAt: {
                    type: 'datetime',
                    isVisible: false,
                  },
                },
              } as ResourceOptions,
            },
            {
              resource: { model: Lecture, orm },
              options: {
                listProperties: ['id', 'createdAt', 'updatedAt', 'name', 'url', 'owner'],
                showProperties: ['id', 'createdAt', 'updatedAt', 'name', 'url', 'owner'],
                editProperties: ['name', 'url'],
                filterProperties: ['id', 'name', 'url', 'owner', 'createdAt', 'updatedAt'],
                properties: {
                  id: {
                    type: 'uuid',
                    isId: true,
                  },
                  createdAt: {
                    type: 'datetime',
                    isVisible: true,
                  },
                  updatedAt: {
                    type: 'datetime',
                    isVisible: true,
                  },
                  owner: {
                    type: 'reference',
                    reference: 'User',
                  },
                },
              } as ResourceOptions,
            },
          ],
        },
        auth: {
          authenticate: async (email, password) => {
            if (email === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
              return DefaultAdmin
            }

            const user = await authService.validateUser(email, password)
            if (!user?.isInstructor) return null

            const admin: CurrentAdmin = {
              id: user.email,
              email: user.email,
              avatarUrl: user.avatarUrl ?? undefined,
              title: user.name,
            }

            return admin
          },
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: process.env.SECRET_KEY_BASE,
          store: new (RedisStore(ExpressSession))({ client: createRedisClient() }),
        },
      }),
    }),
  ],
})
export class AdminModule {}
