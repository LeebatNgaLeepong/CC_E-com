ALTER TABLE `order_items` ADD `product_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `size` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `color` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `customer_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `subtotal_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipping_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `orders_code_unique` ON `orders` (`code`);