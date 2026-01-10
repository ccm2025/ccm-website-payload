import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nickname\` text NOT NULL,
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
  await db.run(sql`CREATE INDEX \`media_uploaded_by_idx\` ON \`media\` (\`uploaded_by_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`events_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_content_order_idx\` ON \`events_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_content_parent_id_idx\` ON \`events_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_content_locale_idx\` ON \`events_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`date\` text,
  	\`hero_image_id\` integer,
  	\`content_video_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_date_idx\` ON \`events\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`events_hero_image_idx\` ON \`events\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`events_locales\` (
  	\`title\` text,
  	\`content_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`content_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_content_image_idx\` ON \`events_locales\` (\`content_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`events_locales_locale_parent_id_unique\` ON \`events_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_version_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_version_content_order_idx\` ON \`_events_v_version_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_content_parent_id_idx\` ON \`_events_v_version_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_content_locale_idx\` ON \`_events_v_version_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_date\` text,
  	\`version_hero_image_id\` integer,
  	\`version_content_video_url\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_parent_idx\` ON \`_events_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_slug_idx\` ON \`_events_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_date_idx\` ON \`_events_v\` (\`version_date\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_hero_image_idx\` ON \`_events_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_updated_at_idx\` ON \`_events_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_created_at_idx\` ON \`_events_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version__status_idx\` ON \`_events_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_created_at_idx\` ON \`_events_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_updated_at_idx\` ON \`_events_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_snapshot_idx\` ON \`_events_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_published_locale_idx\` ON \`_events_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_latest_idx\` ON \`_events_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_locales\` (
  	\`version_title\` text,
  	\`version_content_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_content_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_content_image_idx\` ON \`_events_v_locales\` (\`version_content_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_events_v_locales_locale_parent_id_unique\` ON \`_events_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`events_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`global_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`global_nav_order_idx\` ON \`global_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`global_nav_parent_id_idx\` ON \`global_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global_nav_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_nav_locales_locale_parent_id_unique\` ON \`global_nav_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`website_title_cn\` text NOT NULL,
  	\`website_title_en\` text NOT NULL,
  	\`instagram_url\` text,
  	\`youtube_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`global_locales\` (
  	\`contact_title\` text NOT NULL,
  	\`address\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`nav_title\` text NOT NULL,
  	\`involve_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_locales_locale_parent_id_unique\` ON \`global_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_hero_subtitle\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_subtitle_order_idx\` ON \`home_page_hero_subtitle\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_subtitle_parent_id_idx\` ON \`home_page_hero_subtitle\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_subtitle_locale_idx\` ON \`home_page_hero_subtitle\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_page_introduction_part1\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part1_order_idx\` ON \`home_page_introduction_part1\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part1_parent_id_idx\` ON \`home_page_introduction_part1\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part1_locale_idx\` ON \`home_page_introduction_part1\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_page_introduction_part2\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part2_order_idx\` ON \`home_page_introduction_part2\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part2_parent_id_idx\` ON \`home_page_introduction_part2\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_introduction_part2_locale_idx\` ON \`home_page_introduction_part2\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_page_meet_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_meet_cards_order_idx\` ON \`home_page_meet_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_meet_cards_parent_id_idx\` ON \`home_page_meet_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_meet_cards_image_idx\` ON \`home_page_meet_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_meet_cards_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_meet_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_meet_cards_locales_locale_parent_id_unique\` ON \`home_page_meet_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_conclusion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_conclusion_order_idx\` ON \`home_page_conclusion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_conclusion_parent_id_idx\` ON \`home_page_conclusion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_conclusion_locale_idx\` ON \`home_page_conclusion\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`introduction_video_url\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_background_image_idx\` ON \`home_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`hero_button_text\` text NOT NULL,
  	\`meet_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_locales_locale_parent_id_unique\` ON \`home_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_introduction_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_introduction_content_order_idx\` ON \`about_page_introduction_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_introduction_content_parent_id_idx\` ON \`about_page_introduction_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_introduction_content_locale_idx\` ON \`about_page_introduction_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`about_page_history_section_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_history_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_history_section_content_order_idx\` ON \`about_page_history_section_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_history_section_content_parent_id_idx\` ON \`about_page_history_section_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_history_section_content_locale_idx\` ON \`about_page_history_section_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`about_page_history_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_history_section_order_idx\` ON \`about_page_history_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_history_section_parent_id_idx\` ON \`about_page_history_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_history_section_image_idx\` ON \`about_page_history_section\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_team_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`avatar_id\` integer NOT NULL,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_team_section_order_idx\` ON \`about_page_team_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_team_section_parent_id_idx\` ON \`about_page_team_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_team_section_avatar_idx\` ON \`about_page_team_section\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_team_section_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_team_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_team_section_locales_locale_parent_id_unique\` ON \`about_page_team_section_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_hero_image_idx\` ON \`about_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`introduction_subtitle\` text NOT NULL,
  	\`introduction_title\` text NOT NULL,
  	\`history_subtitle\` text NOT NULL,
  	\`history_title\` text NOT NULL,
  	\`team_subtitle\` text NOT NULL,
  	\`team_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_locales_locale_parent_id_unique\` ON \`about_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page_introduction_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_introduction_content_order_idx\` ON \`give_page_introduction_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`give_page_introduction_content_parent_id_idx\` ON \`give_page_introduction_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`give_page_introduction_content_locale_idx\` ON \`give_page_introduction_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`give_page_zelle_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_zelle_content_order_idx\` ON \`give_page_zelle_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`give_page_zelle_content_parent_id_idx\` ON \`give_page_zelle_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`give_page_zelle_content_locale_idx\` ON \`give_page_zelle_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`give_page_check_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_check_content_order_idx\` ON \`give_page_check_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`give_page_check_content_parent_id_idx\` ON \`give_page_check_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`give_page_check_content_locale_idx\` ON \`give_page_check_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`give_page_pdf_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`pdf_id\` integer NOT NULL,
  	FOREIGN KEY (\`pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_pdf_links_order_idx\` ON \`give_page_pdf_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`give_page_pdf_links_parent_id_idx\` ON \`give_page_pdf_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`give_page_pdf_links_pdf_idx\` ON \`give_page_pdf_links\` (\`pdf_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_hero_image_idx\` ON \`give_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`introduction_subtitle\` text NOT NULL,
  	\`introduction_title\` text NOT NULL,
  	\`zelle_title\` text NOT NULL,
  	\`check_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`give_page_locales_locale_parent_id_unique\` ON \`give_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_introduction_content_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_introduction_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_content_order_idx\` ON \`plan_your_visit_page_introduction_content_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_content_parent_id_idx\` ON \`plan_your_visit_page_introduction_content_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_content_locale_idx\` ON \`plan_your_visit_page_introduction_content_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_introduction_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_order_idx\` ON \`plan_your_visit_page_introduction_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_parent_id_idx\` ON \`plan_your_visit_page_introduction_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_introduction_content_image_idx\` ON \`plan_your_visit_page_introduction_content\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_introduction_content_locales\` (
  	\`title\` text NOT NULL,
  	\`subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_introduction_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_introduction_content_locales_locale_par\` ON \`plan_your_visit_page_introduction_content_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_location_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_location_description_order_idx\` ON \`plan_your_visit_page_location_description\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_location_description_parent_id_idx\` ON \`plan_your_visit_page_location_description\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_location_description_locale_idx\` ON \`plan_your_visit_page_location_description\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_hours_content_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_hours_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_content_order_idx\` ON \`plan_your_visit_page_hours_content_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_content_parent_id_idx\` ON \`plan_your_visit_page_hours_content_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_content_locale_idx\` ON \`plan_your_visit_page_hours_content_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_hours_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_order_idx\` ON \`plan_your_visit_page_hours_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_parent_id_idx\` ON \`plan_your_visit_page_hours_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hours_content_image_idx\` ON \`plan_your_visit_page_hours_content\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_hours_content_locales\` (
  	\`title\` text NOT NULL,
  	\`subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_hours_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_hours_content_locales_locale_parent_id_\` ON \`plan_your_visit_page_hours_content_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`location_map_link\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hero_image_idx\` ON \`plan_your_visit_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`introduction_subtitle\` text NOT NULL,
  	\`introduction_title\` text NOT NULL,
  	\`hours_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_locales_locale_parent_id_unique\` ON \`plan_your_visit_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_info_sections_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_content_order_idx\` ON \`support_page_info_sections_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_content_parent_id_idx\` ON \`support_page_info_sections_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_content_locale_idx\` ON \`support_page_info_sections_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`support_page_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_order_idx\` ON \`support_page_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_parent_id_idx\` ON \`support_page_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_image_idx\` ON \`support_page_info_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_info_sections_locales\` (
  	\`title\` text NOT NULL,
  	\`subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`support_page_info_sections_locales_locale_parent_id_unique\` ON \`support_page_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_hero_image_idx\` ON \`support_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`support_page_locales_locale_parent_id_unique\` ON \`support_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_introduction_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_introduction_content_order_idx\` ON \`volunteer_page_introduction_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`volunteer_page_introduction_content_parent_id_idx\` ON \`volunteer_page_introduction_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`volunteer_page_introduction_content_locale_idx\` ON \`volunteer_page_introduction_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_volunteer_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_volunteer_content_order_idx\` ON \`volunteer_page_volunteer_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`volunteer_page_volunteer_content_parent_id_idx\` ON \`volunteer_page_volunteer_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`volunteer_page_volunteer_content_locale_idx\` ON \`volunteer_page_volunteer_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`application_button_url\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_hero_image_idx\` ON \`volunteer_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`introduction_subtitle\` text NOT NULL,
  	\`introduction_title\` text NOT NULL,
  	\`application_button_text\` text NOT NULL,
  	\`volunteer_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`volunteer_page_locales_locale_parent_id_unique\` ON \`volunteer_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_info_sections_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_content_order_idx\` ON \`freshman_page_info_sections_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_content_parent_id_idx\` ON \`freshman_page_info_sections_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_content_locale_idx\` ON \`freshman_page_info_sections_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_order_idx\` ON \`freshman_page_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_parent_id_idx\` ON \`freshman_page_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_image_idx\` ON \`freshman_page_info_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_info_sections_locales\` (
  	\`title\` text NOT NULL,
  	\`subtitle\` text,
  	\`button_text\` text,
  	\`button_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`freshman_page_info_sections_locales_locale_parent_id_unique\` ON \`freshman_page_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_hero_image_idx\` ON \`freshman_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`freshman_page_locales_locale_parent_id_unique\` ON \`freshman_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`thank_you_page_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`font_size\` text DEFAULT 'Normal',
  	\`color\` text DEFAULT 'Default',
  	\`font_style\` text DEFAULT 'Normal',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`thank_you_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`thank_you_page_content_order_idx\` ON \`thank_you_page_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`thank_you_page_content_parent_id_idx\` ON \`thank_you_page_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`thank_you_page_content_locale_idx\` ON \`thank_you_page_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`thank_you_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`thank_you_page_hero_image_idx\` ON \`thank_you_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`thank_you_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`content_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`thank_you_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`thank_you_page_locales_locale_parent_id_unique\` ON \`thank_you_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`default_event_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_event_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_page_hero_image_idx\` ON \`events_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_page_default_event_image_idx\` ON \`events_page\` (\`default_event_image_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`upcoming_events_subtitle\` text NOT NULL,
  	\`upcoming_events_title\` text NOT NULL,
  	\`upcoming_events_empty_text\` text NOT NULL,
  	\`past_events_subtitle\` text NOT NULL,
  	\`past_events_title\` text NOT NULL,
  	\`past_events_empty_text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`events_page_locales_locale_parent_id_unique\` ON \`events_page_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`events_content\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`events_locales\`;`)
  await db.run(sql`DROP TABLE \`_events_v_version_content\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`_events_v_locales\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`global_nav\`;`)
  await db.run(sql`DROP TABLE \`global_nav_locales\`;`)
  await db.run(sql`DROP TABLE \`global\`;`)
  await db.run(sql`DROP TABLE \`global_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_hero_subtitle\`;`)
  await db.run(sql`DROP TABLE \`home_page_introduction_part1\`;`)
  await db.run(sql`DROP TABLE \`home_page_introduction_part2\`;`)
  await db.run(sql`DROP TABLE \`home_page_meet_cards\`;`)
  await db.run(sql`DROP TABLE \`home_page_meet_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_conclusion\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_introduction_content\`;`)
  await db.run(sql`DROP TABLE \`about_page_history_section_content\`;`)
  await db.run(sql`DROP TABLE \`about_page_history_section\`;`)
  await db.run(sql`DROP TABLE \`about_page_team_section\`;`)
  await db.run(sql`DROP TABLE \`about_page_team_section_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`about_page_locales\`;`)
  await db.run(sql`DROP TABLE \`give_page_introduction_content\`;`)
  await db.run(sql`DROP TABLE \`give_page_zelle_content\`;`)
  await db.run(sql`DROP TABLE \`give_page_check_content\`;`)
  await db.run(sql`DROP TABLE \`give_page_pdf_links\`;`)
  await db.run(sql`DROP TABLE \`give_page\`;`)
  await db.run(sql`DROP TABLE \`give_page_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_introduction_content_content\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_introduction_content\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_introduction_content_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_location_description\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_hours_content_content\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_hours_content\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_hours_content_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_locales\`;`)
  await db.run(sql`DROP TABLE \`support_page_info_sections_content\`;`)
  await db.run(sql`DROP TABLE \`support_page_info_sections\`;`)
  await db.run(sql`DROP TABLE \`support_page_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`support_page\`;`)
  await db.run(sql`DROP TABLE \`support_page_locales\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_introduction_content\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_volunteer_content\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_locales\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_info_sections_content\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_info_sections\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`freshman_page\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_locales\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page_content\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page_locales\`;`)
  await db.run(sql`DROP TABLE \`events_page\`;`)
  await db.run(sql`DROP TABLE \`events_page_locales\`;`)
}
