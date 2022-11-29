import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { AnnotationLoader, CommentIdsByAnnotationLoader, CommentLoader } from './graphql/loader'
import { AnnotationResolver, CommentResolver } from './graphql/resolver'
import { Annotation, Comment } from './model'
import { AnnotationPolicy, CommentPolicy } from './policy.ts'
import { AnnotationService, CommentService } from './service'

@Module({
  imports: [MikroOrmModule.forFeature([Annotation, Comment])],
  providers: [
    AnnotationPolicy,
    CommentPolicy,
    AnnotationService,
    CommentService,
    AnnotationLoader,
    CommentLoader,
    CommentIdsByAnnotationLoader,
    AnnotationResolver,
    CommentResolver,
  ],
})
export class AnnotationModule {}
