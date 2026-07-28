import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_layout" AS ENUM('standard', 'centered', 'full-width');
  CREATE TYPE "public"."enum__pages_v_version_layout" AS ENUM('standard', 'centered', 'full-width');
  CREATE TYPE "public"."enum_site_settings_sidebar_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_hero_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_qa_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TABLE "site_settings_sidebar_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_site_settings_sidebar_buttons_style" DEFAULT 'secondary'
  );
  
  CREATE TABLE "homepage_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_homepage_hero_buttons_style" DEFAULT 'secondary'
  );
  
  CREATE TABLE "homepage_qa_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_homepage_qa_buttons_style" DEFAULT 'secondary'
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading" varchar DEFAULT 'Compassionate, confidential therapy for individuals and couples',
  	"hero_description" varchar DEFAULT 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience helping people find insight, relief, and growth.',
  	"welcome_heading" varchar DEFAULT 'Welcome',
  	"welcome_text" jsonb,
  	"welcome_link_label" varchar DEFAULT 'Read more about Dr. Pinhas',
  	"welcome_link_url" varchar DEFAULT '/about',
  	"qa_heading" varchar DEFAULT 'Have a question?',
  	"qa_text" varchar DEFAULT 'Feel free to ask a question and check out answers posted from other visitors and students.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "description" SET DEFAULT 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience serving the Long Island community.';
  ALTER TABLE "pages" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages" ADD COLUMN "show_sidebar" boolean DEFAULT true;
  ALTER TABLE "pages" ADD COLUMN "layout" "enum_pages_layout" DEFAULT 'standard';
  ALTER TABLE "_pages_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_show_sidebar" boolean DEFAULT true;
  ALTER TABLE "_pages_v" ADD COLUMN "version_layout" "enum__pages_v_version_layout" DEFAULT 'standard';
  ALTER TABLE "site_settings" ADD COLUMN "sidebar_bio" varchar DEFAULT 'I am a therapist who has been practicing sexual therapy, addictions therapy as well as psychoanalytic psychotherapy and psychoanalysis for over 50 years.';
  ALTER TABLE "site_settings_sidebar_buttons" ADD CONSTRAINT "site_settings_sidebar_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_buttons" ADD CONSTRAINT "homepage_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_qa_buttons" ADD CONSTRAINT "homepage_qa_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_sidebar_buttons_order_idx" ON "site_settings_sidebar_buttons" USING btree ("_order");
  CREATE INDEX "site_settings_sidebar_buttons_parent_id_idx" ON "site_settings_sidebar_buttons" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_buttons_order_idx" ON "homepage_hero_buttons" USING btree ("_order");
  CREATE INDEX "homepage_hero_buttons_parent_id_idx" ON "homepage_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "homepage_qa_buttons_order_idx" ON "homepage_qa_buttons" USING btree ("_order");
  CREATE INDEX "homepage_qa_buttons_parent_id_idx" ON "homepage_qa_buttons" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_sidebar_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_hero_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_qa_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_sidebar_buttons" CASCADE;
  DROP TABLE "homepage_hero_buttons" CASCADE;
  DROP TABLE "homepage_qa_buttons" CASCADE;
  DROP TABLE "homepage" CASCADE;
  ALTER TABLE "site_settings" ALTER COLUMN "description" SET DEFAULT 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 30 years of experience serving the Long Island community.';
  ALTER TABLE "pages" DROP COLUMN "subtitle";
  ALTER TABLE "pages" DROP COLUMN "show_sidebar";
  ALTER TABLE "pages" DROP COLUMN "layout";
  ALTER TABLE "_pages_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_pages_v" DROP COLUMN "version_show_sidebar";
  ALTER TABLE "_pages_v" DROP COLUMN "version_layout";
  ALTER TABLE "site_settings" DROP COLUMN "sidebar_bio";
  DROP TYPE "public"."enum_pages_layout";
  DROP TYPE "public"."enum__pages_v_version_layout";
  DROP TYPE "public"."enum_site_settings_sidebar_buttons_style";
  DROP TYPE "public"."enum_homepage_hero_buttons_style";
  DROP TYPE "public"."enum_homepage_qa_buttons_style";`)
}
