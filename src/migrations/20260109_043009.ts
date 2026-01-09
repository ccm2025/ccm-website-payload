import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`thank_you_page_contents\` RENAME TO \`thank_you_page_content\`;`)
  await db.run(sql`CREATE TABLE \`global_nav_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_nav_locales_locale_parent_id_unique\` ON \`global_nav_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global_locales\` (
  	\`contact_title\` text,
  	\`address\` text,
  	\`email\` text,
  	\`nav_title\` text,
  	\`involve_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_locales_locale_parent_id_unique\` ON \`global_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_thank_you_page_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`thank_you_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_thank_you_page_content\`("_order", "_parent_id", "id", "text", "font_size", "color", "font_style") SELECT "_order", "_parent_id", "id", "text", "font_size", "color", "font_style" FROM \`thank_you_page_content\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page_content\`;`)
  await db.run(sql`ALTER TABLE \`__new_thank_you_page_content\` RENAME TO \`thank_you_page_content\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`thank_you_page_content_order_idx\` ON \`thank_you_page_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`thank_you_page_content_parent_id_idx\` ON \`thank_you_page_content\` (\`_parent_id\`);`)
  await db.run(sql`DROP INDEX \`events_slug_idx\`;`)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`DROP INDEX \`ministries_slug_idx\`;`)
  await db.run(sql`CREATE INDEX \`ministries_slug_idx\` ON \`ministries\` (\`slug\`);`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`uploaded_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text NOT NULL,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	FOREIGN KEY (\`uploaded_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "uploaded_by_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "uploaded_by_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`CREATE INDEX \`media_uploaded_by_idx\` ON \`media\` (\`uploaded_by_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`__new_about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`introduction_subtitle\` text NOT NULL,
  	\`introduction_title\` text NOT NULL,
  	\`history_subtitle\` text,
  	\`history_title\` text,
  	\`team_subtitle\` text,
  	\`team_title\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_page\`("id", "hero_title", "hero_image_id", "introduction_subtitle", "introduction_title", "history_subtitle", "history_title", "team_subtitle", "team_title", "updated_at", "created_at") SELECT "id", "hero_title", "hero_image_id", "introduction_subtitle", "introduction_title", "history_subtitle", "history_title", "team_subtitle", "team_title", "updated_at", "created_at" FROM \`about_page\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_page\` RENAME TO \`about_page\`;`)
  await db.run(sql`CREATE INDEX \`about_page_hero_image_idx\` ON \`about_page\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`global_nav\` DROP COLUMN \`text\`;`)
  await db.run(sql`ALTER TABLE \`global\` DROP COLUMN \`contact_title\`;`)
  await db.run(sql`ALTER TABLE \`global\` DROP COLUMN \`address\`;`)
  await db.run(sql`ALTER TABLE \`global\` DROP COLUMN \`email\`;`)
  await db.run(sql`ALTER TABLE \`global\` DROP COLUMN \`nav_title\`;`)
  await db.run(sql`ALTER TABLE \`global\` DROP COLUMN \`involve_title\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`thank_you_page_contents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`thank_you_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`thank_you_page_contents_order_idx\` ON \`thank_you_page_contents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`thank_you_page_contents_parent_id_idx\` ON \`thank_you_page_contents\` (\`_parent_id\`);`)
  await db.run(sql`DROP TABLE \`global_nav_locales\`;`)
  await db.run(sql`DROP TABLE \`global_locales\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page_content\`;`)
  await db.run(sql`DROP INDEX \`events_slug_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`DROP INDEX \`ministries_slug_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`ministries_slug_idx\` ON \`ministries\` (\`slug\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`original_filename\` text NOT NULL,
  	\`alt\` text NOT NULL,
  	\`uploaded_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	FOREIGN KEY (\`uploaded_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "original_filename", "alt", "uploaded_by_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "original_filename", "alt", "uploaded_by_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_uploaded_by_idx\` ON \`media\` (\`uploaded_by_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`__new_about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`introduction_subtitle\` text,
  	\`introduction_title\` text NOT NULL,
  	\`history_subtitle\` text,
  	\`history_title\` text,
  	\`team_subtitle\` text,
  	\`team_title\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_page\`("id", "hero_title", "hero_image_id", "introduction_subtitle", "introduction_title", "history_subtitle", "history_title", "team_subtitle", "team_title", "updated_at", "created_at") SELECT "id", "hero_title", "hero_image_id", "introduction_subtitle", "introduction_title", "history_subtitle", "history_title", "team_subtitle", "team_title", "updated_at", "created_at" FROM \`about_page\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_page\` RENAME TO \`about_page\`;`)
  await db.run(sql`CREATE INDEX \`about_page_hero_image_idx\` ON \`about_page\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`global_nav\` ADD \`text\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`global\` ADD \`contact_title\` text;`)
  await db.run(sql`ALTER TABLE \`global\` ADD \`address\` text;`)
  await db.run(sql`ALTER TABLE \`global\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`global\` ADD \`nav_title\` text;`)
  await db.run(sql`ALTER TABLE \`global\` ADD \`involve_title\` text;`)
}
