import { Migration } from '@mikro-orm/migrations'

export class Migration20221203202407 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "message" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "text" text not null, "author_id" uuid null, "lecture_id" uuid not null, "parent_id" uuid null, constraint "message_pkey" primary key ("id"));',
    )

    this.addSql(
      'alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete set null;',
    )
    this.addSql(
      'alter table "message" add constraint "message_lecture_id_foreign" foreign key ("lecture_id") references "lecture" ("id") on update cascade on delete cascade;',
    )
    this.addSql(
      'alter table "message" add constraint "message_parent_id_foreign" foreign key ("parent_id") references "message" ("id") on update cascade on delete cascade;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" drop constraint "message_parent_id_foreign";')

    this.addSql('drop table if exists "message" cascade;')
  }
}
