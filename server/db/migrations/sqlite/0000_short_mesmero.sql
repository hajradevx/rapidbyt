CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`password` text,
	`role` text DEFAULT 'user' NOT NULL,
	`email_verified` integer DEFAULT false,
	`name` text,
	`phone` text,
	`avatar` text,
	`data` text DEFAULT '{}',
	`reset_token` text,
	`reset_token_expires_at` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_username_unique` ON `accounts` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `seo` (
	`id` text PRIMARY KEY NOT NULL,
	`route` text NOT NULL,
	`title` text,
	`description` text,
	`keywords` text,
	`extra_meta` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_route_unique` ON `seo` (`route`);