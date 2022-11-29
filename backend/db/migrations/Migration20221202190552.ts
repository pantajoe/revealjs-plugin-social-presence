import { Migration } from '@mikro-orm/migrations'

export class Migration20221202190552 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "bio" text not null default \'\';')
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "bio";')
  }
}
