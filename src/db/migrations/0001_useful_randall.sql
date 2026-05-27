ALTER TABLE "user_asset" ADD COLUMN "sha256" text;--> statement-breakpoint
CREATE INDEX "generation_asset_link_asset_idx" ON "generation_asset_link" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "user_asset_type_idx" ON "user_asset" USING btree ("type");--> statement-breakpoint
CREATE INDEX "user_asset_created_at_idx" ON "user_asset" USING btree ("created_at");