import { Migration } from '@mikro-orm/migrations'

export class Migration20221205104011 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "lecture" add column "url" varchar(255) not null;')
  }

  async down(): Promise<void> {
    this.addSql('alter table "lecture" drop column "url";')
  }
}
