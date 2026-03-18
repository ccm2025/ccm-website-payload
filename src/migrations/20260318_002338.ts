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
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`role\` text DEFAULT 'member' NOT NULL,
  	\`is_active\` integer DEFAULT true,
  	\`last_login_at\` text,
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
  await db.run(sql`CREATE INDEX \`media_uploaded_by_idx\` ON \`media\` (\`uploaded_by_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`events_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_gallery_order_idx\` ON \`events_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_gallery_parent_id_idx\` ON \`events_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_gallery_image_idx\` ON \`events_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`events_gallery_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`events_gallery_locales_locale_parent_id_unique\` ON \`events_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`date\` text,
  	\`time_start\` text,
  	\`time_end\` text,
  	\`content_video_url\` text,
  	\`registration_required\` integer DEFAULT false,
  	\`registration_url\` text,
  	\`registration_deadline\` text,
  	\`created_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_date_idx\` ON \`events\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`events_created_by_idx\` ON \`events\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`events_locales\` (
  	\`title\` text,
  	\`location_venue\` text,
  	\`location_address\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`events_locales_locale_parent_id_unique\` ON \`events_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_order_idx\` ON \`_events_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_parent_id_idx\` ON \`_events_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_gallery_image_idx\` ON \`_events_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_version_gallery_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v_version_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_events_v_version_gallery_locales_locale_parent_id_unique\` ON \`_events_v_version_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_date\` text,
  	\`version_time_start\` text,
  	\`version_time_end\` text,
  	\`version_content_video_url\` text,
  	\`version_registration_required\` integer DEFAULT false,
  	\`version_registration_url\` text,
  	\`version_registration_deadline\` text,
  	\`version_created_by_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_parent_idx\` ON \`_events_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_slug_idx\` ON \`_events_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_date_idx\` ON \`_events_v\` (\`version_date\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_created_by_idx\` ON \`_events_v\` (\`version_created_by_id\`);`)
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
  	\`version_location_venue\` text,
  	\`version_location_address\` text,
  	\`version_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
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
  await db.run(sql`CREATE TABLE \`global_navigation_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`global_navigation_menu_items_order_idx\` ON \`global_navigation_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`global_navigation_menu_items_parent_id_idx\` ON \`global_navigation_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global_navigation_menu_items_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global_navigation_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_navigation_menu_items_locales_locale_parent_id_unique\` ON \`global_navigation_menu_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global_footer_social_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`global_footer_social_media_order_idx\` ON \`global_footer_social_media\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`global_footer_social_media_parent_id_idx\` ON \`global_footer_social_media\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`global\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`navigation_logo_id\` integer,
  	\`navigation_website_title_c_n\` text,
  	\`navigation_website_title_e_n\` text,
  	\`footer_contact_info_phone\` text,
  	\`footer_contact_info_email\` text,
  	\`footer_copyright_text\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`navigation_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`global_navigation_navigation_logo_idx\` ON \`global\` (\`navigation_logo_id\`);`)
  await db.run(sql`CREATE TABLE \`global_locales\` (
  	\`footer_contact_info_address\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`global\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`global_locales_locale_parent_id_unique\` ON \`global_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_meet_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`image_id\` integer NOT NULL,
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
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`hero_button_url\` text,
  	\`intro_video_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_hero_background_image_idx\` ON \`home_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_locales\` (
  	\`hero_title\` text,
  	\`hero_subtitle\` text,
  	\`hero_button_text\` text,
  	\`intro_part1\` text,
  	\`intro_part2\` text,
  	\`intro_conclusion\` text,
  	\`meet_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_locales_locale_parent_id_unique\` ON \`home_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_history_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_history_info_sections_order_idx\` ON \`about_page_history_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_history_info_sections_parent_id_idx\` ON \`about_page_history_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_history_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_history_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_history_info_sections_image_idx\` ON \`about_page_history_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_history_info_sections_locales_locale_parent_id_un\` ON \`about_page_history_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`photo_id\` integer,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_team_members_order_idx\` ON \`about_page_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_team_members_parent_id_idx\` ON \`about_page_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_team_members_photo_idx\` ON \`about_page_team_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_team_members_locales\` (
  	\`name\` text NOT NULL,
  	\`position\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_team_members\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_team_members_locales_locale_parent_id_unique\` ON \`about_page_team_members_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_hero_hero_background_image_idx\` ON \`about_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_locales\` (
  	\`hero_title\` text,
  	\`intro\` text,
  	\`history_subtitle\` text,
  	\`history_title\` text,
  	\`team_subtitle\` text,
  	\`team_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_locales_locale_parent_id_unique\` ON \`about_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_hero_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_page_hero_hero_hero_image_idx\` ON \`events_page\` (\`hero_hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page_locales\` (
  	\`hero_hero_title\` text NOT NULL,
  	\`upcoming_events_upcoming_events_subtitle\` text DEFAULT 'What''s Coming',
  	\`upcoming_events_upcoming_events_title\` text DEFAULT 'Upcoming Events' NOT NULL,
  	\`upcoming_events_no_events_message\` text DEFAULT 'No upcoming events at this time. Please check back soon!',
  	\`past_events_past_events_subtitle\` text DEFAULT 'Look Back',
  	\`past_events_past_events_title\` text DEFAULT 'Past Events' NOT NULL,
  	\`past_events_view_all_text\` text DEFAULT 'View All Past Events',
  	\`past_events_past_events_empty_text\` text DEFAULT 'No past events to show.',
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`events_page_locales_locale_parent_id_unique\` ON \`events_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_info_sections_order_idx\` ON \`volunteer_page_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`volunteer_page_info_sections_parent_id_idx\` ON \`volunteer_page_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_info_sections_image_idx\` ON \`volunteer_page_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`volunteer_page_info_sections_locales_locale_parent_id_unique\` ON \`volunteer_page_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`volunteer_page_hero_hero_background_image_idx\` ON \`volunteer_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`volunteer_page_locales\` (
  	\`hero_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`volunteer_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`volunteer_page_locales_locale_parent_id_unique\` ON \`volunteer_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page_letters_pdfs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`file_id\` integer NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_letters_pdfs_order_idx\` ON \`give_page_letters_pdfs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`give_page_letters_pdfs_parent_id_idx\` ON \`give_page_letters_pdfs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`give_page_letters_pdfs_file_idx\` ON \`give_page_letters_pdfs\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`give_page_hero_hero_background_image_idx\` ON \`give_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`give_page_locales\` (
  	\`hero_title\` text,
  	\`intro\` text,
  	\`payment_methods\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`give_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`give_page_locales_locale_parent_id_unique\` ON \`give_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_order_idx\` ON \`support_page_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_parent_id_idx\` ON \`support_page_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_info_sections_image_idx\` ON \`support_page_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`support_page_info_sections_locales_locale_parent_id_unique\` ON \`support_page_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`support_page_hero_hero_background_image_idx\` ON \`support_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`support_page_locales\` (
  	\`hero_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`support_page_locales_locale_parent_id_unique\` ON \`support_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_order_idx\` ON \`freshman_page_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_parent_id_idx\` ON \`freshman_page_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_info_sections_image_idx\` ON \`freshman_page_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`freshman_page_info_sections_locales_locale_parent_id_unique\` ON \`freshman_page_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`freshman_page_hero_hero_background_image_idx\` ON \`freshman_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`freshman_page_locales\` (
  	\`hero_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`freshman_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`freshman_page_locales_locale_parent_id_unique\` ON \`freshman_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_intro_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_intro_info_sections_order_idx\` ON \`plan_your_visit_page_intro_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_intro_info_sections_parent_id_idx\` ON \`plan_your_visit_page_intro_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_intro_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_intro_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_intro_info_sections_image_idx\` ON \`plan_your_visit_page_intro_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_intro_info_sections_locales_locale_pare\` ON \`plan_your_visit_page_intro_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_schedule_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`has_button\` integer DEFAULT false,
  	\`button_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_schedule_info_sections_order_idx\` ON \`plan_your_visit_page_schedule_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_schedule_info_sections_parent_id_idx\` ON \`plan_your_visit_page_schedule_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_schedule_info_sections_locales\` (
  	\`content\` text,
  	\`image_id\` integer,
  	\`button_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page_schedule_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_schedule_info_sections_image_idx\` ON \`plan_your_visit_page_schedule_info_sections_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_schedule_info_sections_locales_locale_p\` ON \`plan_your_visit_page_schedule_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`location_map_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`plan_your_visit_page_hero_hero_background_image_idx\` ON \`plan_your_visit_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`plan_your_visit_page_locales\` (
  	\`hero_title\` text,
  	\`intro_subtitle\` text,
  	\`intro_title\` text,
  	\`location_address\` text,
  	\`schedule_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plan_your_visit_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plan_your_visit_page_locales_locale_parent_id_unique\` ON \`plan_your_visit_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`thank_you_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_image_id\` integer NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`thank_you_page_hero_hero_background_image_idx\` ON \`thank_you_page\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`thank_you_page_locales\` (
  	\`hero_title\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`thank_you_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`thank_you_page_locales_locale_parent_id_unique\` ON \`thank_you_page_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`events_gallery\`;`)
  await db.run(sql`DROP TABLE \`events_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`events_locales\`;`)
  await db.run(sql`DROP TABLE \`_events_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_events_v_version_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`_events_v_locales\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`global_navigation_menu_items\`;`)
  await db.run(sql`DROP TABLE \`global_navigation_menu_items_locales\`;`)
  await db.run(sql`DROP TABLE \`global_footer_social_media\`;`)
  await db.run(sql`DROP TABLE \`global\`;`)
  await db.run(sql`DROP TABLE \`global_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_meet_cards\`;`)
  await db.run(sql`DROP TABLE \`home_page_meet_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_history_info_sections\`;`)
  await db.run(sql`DROP TABLE \`about_page_history_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_team_members\`;`)
  await db.run(sql`DROP TABLE \`about_page_team_members_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`about_page_locales\`;`)
  await db.run(sql`DROP TABLE \`events_page\`;`)
  await db.run(sql`DROP TABLE \`events_page_locales\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_info_sections\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page\`;`)
  await db.run(sql`DROP TABLE \`volunteer_page_locales\`;`)
  await db.run(sql`DROP TABLE \`give_page_letters_pdfs\`;`)
  await db.run(sql`DROP TABLE \`give_page\`;`)
  await db.run(sql`DROP TABLE \`give_page_locales\`;`)
  await db.run(sql`DROP TABLE \`support_page_info_sections\`;`)
  await db.run(sql`DROP TABLE \`support_page_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`support_page\`;`)
  await db.run(sql`DROP TABLE \`support_page_locales\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_info_sections\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`freshman_page\`;`)
  await db.run(sql`DROP TABLE \`freshman_page_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_intro_info_sections\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_intro_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_schedule_info_sections\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_schedule_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page\`;`)
  await db.run(sql`DROP TABLE \`plan_your_visit_page_locales\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page\`;`)
  await db.run(sql`DROP TABLE \`thank_you_page_locales\`;`)
}
