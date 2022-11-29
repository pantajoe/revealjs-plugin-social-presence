import { Migration } from '@mikro-orm/migrations'

export class Migration20221130194838 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "profile_color" varchar(255) not null, "refresh_token" varchar(255) null, "refresh_token_expires_at" timestamptz(0) null, "role" text check ("role" in (\'instructor\', \'student\')) not null default \'student\', "avatar" varchar(255) null, constraint "user_pkey" primary key ("id"));',
    )
    this.addSql('create index "user_email_index" on "user" ("email");')
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");')
    this.addSql('alter table "user" add constraint "user_refresh_token_unique" unique ("refresh_token");')

    this.addSql(
      'create table "lecture" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "owner_id" uuid not null, constraint "lecture_pkey" primary key ("id"));',
    )
    this.addSql('create index "lecture_name_index" on "lecture" ("name");')

    this.addSql(
      'create table "user_lectures" ("user_id" uuid not null, "lecture_id" uuid not null, constraint "user_lectures_pkey" primary key ("user_id", "lecture_id"));',
    )

    this.addSql(
      'alter table "lecture" add constraint "lecture_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;',
    )

    this.addSql(
      'alter table "user_lectures" add constraint "user_lectures_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    )
    this.addSql(
      'alter table "user_lectures" add constraint "user_lectures_lecture_id_foreign" foreign key ("lecture_id") references "lecture" ("id") on update cascade on delete cascade;',
    )
  }
}
