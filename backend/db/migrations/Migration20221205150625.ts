import { Migration } from '@mikro-orm/migrations'

export class Migration20221205150625 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "annotation" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "quote" text not null, "text" text not null, "target" jsonb not null, "author_id" uuid null, "lecture_id" uuid not null, constraint "annotation_pkey" primary key ("id"));',
    )

    this.addSql(
      'create table "comment" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "text" text not null, "author_id" uuid null, "annotation_id" uuid not null, constraint "comment_pkey" primary key ("id"));',
    )

    this.addSql(
      'alter table "annotation" add constraint "annotation_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete set null;',
    )
    this.addSql(
      'alter table "annotation" add constraint "annotation_lecture_id_foreign" foreign key ("lecture_id") references "lecture" ("id") on update cascade on delete cascade;',
    )

    this.addSql(
      'alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete set null;',
    )
    this.addSql(
      'alter table "comment" add constraint "comment_annotation_id_foreign" foreign key ("annotation_id") references "annotation" ("id") on update cascade on delete cascade;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_annotation_id_foreign";')

    this.addSql('drop table if exists "annotation" cascade;')

    this.addSql('drop table if exists "comment" cascade;')
  }
}
