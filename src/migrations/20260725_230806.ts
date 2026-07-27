import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "navigation_main_nav_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Long Island Sex Therapy';
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Dr. Valerie Pinhas';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" SET DEFAULT 'vlp@longislandsextherapy.com';
  ALTER TABLE "site_settings" ALTER COLUMN "phone_number" SET DEFAULT '(516) 482-8314';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Great Neck, Long Island, New York';
  ALTER TABLE "navigation_main_nav_children" ADD CONSTRAINT "navigation_main_nav_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_nav"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_main_nav_children_order_idx" ON "navigation_main_nav_children" USING btree ("_order");
  CREATE INDEX "navigation_main_nav_children_parent_id_idx" ON "navigation_main_nav_children" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_main_nav_children" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "navigation_main_nav_children" CASCADE;
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Dr. Valerie Pinhas';
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Long Island Sex Therapy';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "phone_number" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "address" DROP DEFAULT;`)
}
