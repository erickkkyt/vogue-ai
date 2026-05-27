CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"remaining_amount" integer,
	"plan_id" text,
	"price_id" text,
	"subscription_id" text,
	"reference_type" text,
	"reference_id" text,
	"expiration_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "effect" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" integer NOT NULL,
	"model" text NOT NULL,
	"version" text,
	"credit" integer NOT NULL,
	"link_name" text NOT NULL,
	"pre_prompt" text,
	"des" text,
	"platform" text,
	"api" text,
	"is_open" integer DEFAULT 1 NOT NULL,
	"provider" text NOT NULL,
	"input_schema" jsonb,
	"pricing_schema" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "effect_link_name_unique" UNIQUE("link_name")
);
--> statement-breakpoint
CREATE TABLE "generation_asset_link" (
	"id" text PRIMARY KEY NOT NULL,
	"generation_id" text NOT NULL,
	"asset_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"effect_id" integer NOT NULL,
	"status" text NOT NULL,
	"provider_task_id" text,
	"input" jsonb,
	"output" jsonb,
	"error" text,
	"credits_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"price_id" text NOT NULL,
	"type" text NOT NULL,
	"scene" text NOT NULL,
	"interval" text,
	"user_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"subscription_id" text,
	"session_id" text,
	"invoice_id" text,
	"status" text NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_session_id_unique" UNIQUE("session_id"),
	CONSTRAINT "payment_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"customer_id" text,
	"subscription_state" text DEFAULT 'free' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_asset" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"source" text NOT NULL,
	"bucket" text NOT NULL,
	"object_key" text NOT NULL,
	"public_url" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credit" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"current_credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_asset_link" ADD CONSTRAINT "generation_asset_link_generation_id_generation_history_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generation_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_asset_link" ADD CONSTRAINT "generation_asset_link_asset_id_user_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."user_asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_history" ADD CONSTRAINT "generation_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_history" ADD CONSTRAINT "generation_history_effect_id_effect_id_fk" FOREIGN KEY ("effect_id") REFERENCES "public"."effect"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_asset" ADD CONSTRAINT "user_asset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credit" ADD CONSTRAINT "user_credit_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_id_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "credit_transaction_user_id_idx" ON "credit_transaction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credit_transaction_reference_idx" ON "credit_transaction" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transaction_reference_type_uidx" ON "credit_transaction" USING btree ("type","reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "effect_link_name_idx" ON "effect" USING btree ("link_name");--> statement-breakpoint
CREATE INDEX "effect_provider_idx" ON "effect" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "generation_asset_link_generation_idx" ON "generation_asset_link" USING btree ("generation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "generation_asset_link_unique" ON "generation_asset_link" USING btree ("generation_id","asset_id","role");--> statement-breakpoint
CREATE INDEX "generation_history_user_id_idx" ON "generation_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generation_history_effect_id_idx" ON "generation_history" USING btree ("effect_id");--> statement-breakpoint
CREATE INDEX "generation_history_status_idx" ON "generation_history" USING btree ("status");--> statement-breakpoint
CREATE INDEX "generation_history_provider_task_id_idx" ON "generation_history" USING btree ("provider_task_id");--> statement-breakpoint
CREATE INDEX "payment_user_id_idx" ON "payment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_customer_id_idx" ON "payment" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "payment_session_id_idx" ON "payment" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "payment_invoice_id_idx" ON "payment" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payment_subscription_id_idx" ON "payment" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_customer_id_idx" ON "user" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "user_subscription_state_idx" ON "user" USING btree ("subscription_state");--> statement-breakpoint
CREATE INDEX "user_asset_user_id_idx" ON "user_asset" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_asset_bucket_object_key_uidx" ON "user_asset" USING btree ("bucket","object_key");--> statement-breakpoint
CREATE INDEX "user_credit_user_id_idx" ON "user_credit" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_credit_user_id_uidx" ON "user_credit" USING btree ("user_id");