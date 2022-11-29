import { Migration } from '@mikro-orm/migrations'

export class Migration20221204153817 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "group" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "token" varchar(255) not null, "lecture_id" uuid not null, constraint "group_pkey" primary key ("id"));',
    )
    this.addSql('alter table "group" add constraint "group_token_lecture_id_unique" unique ("token", "lecture_id");')

    this.addSql(
      'create table "user_groups" ("user_id" uuid not null, "group_id" uuid not null, constraint "user_groups_pkey" primary key ("user_id", "group_id"));',
    )

    this.addSql(
      'alter table "group" add constraint "group_lecture_id_foreign" foreign key ("lecture_id") references "lecture" ("id") on update cascade on delete cascade;',
    )

    this.addSql(
      'alter table "user_groups" add constraint "user_groups_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    )
    this.addSql(
      'alter table "user_groups" add constraint "user_groups_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;',
    )

    this.addSql('alter table "message" add column "group_id" uuid null;')
    this.addSql(
      'alter table "message" add constraint "message_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" drop constraint "message_group_id_foreign";')

    this.addSql('alter table "user_groups" drop constraint "user_groups_group_id_foreign";')

    this.addSql('drop table if exists "group" cascade;')

    this.addSql('drop table if exists "user_groups" cascade;')

    this.addSql('alter table "message" drop column "group_id";')
  }
}
