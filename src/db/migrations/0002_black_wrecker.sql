CREATE TABLE "daily_check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"campaign_key" text NOT NULL,
	"day_index" integer NOT NULL,
	"credits_granted" integer NOT NULL,
	"checked_in_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "credit_transaction_reference_type_uidx";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "credit_transaction" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "effect" ALTER COLUMN "is_open" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "effect" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "scene" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD COLUMN "grant_month" timestamp;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD COLUMN "expiration_date_processed_at" timestamp;--> statement-breakpoint
ALTER TABLE "generation_history" ADD COLUMN "lifecycle_phase" text;--> statement-breakpoint
ALTER TABLE "generation_history" ADD COLUMN "last_provider_sync_at" timestamp;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "trial_start" timestamp;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "trial_end" timestamp;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "credits_anchor_at" timestamp;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "next_price_id" text;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "last_plan_change_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "normalized_email" text;--> statement-breakpoint
ALTER TABLE "user_credit" ADD COLUMN "last_refresh_at" timestamp;--> statement-breakpoint
ALTER TABLE "daily_check_in" ADD CONSTRAINT "daily_check_in_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_check_in_user_id_idx" ON "daily_check_in" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_check_in_campaign_idx" ON "daily_check_in" USING btree ("campaign_key");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_check_in_user_campaign_day_uidx" ON "daily_check_in" USING btree ("user_id","campaign_key","day_index");--> statement-breakpoint
CREATE INDEX "account_account_id_idx" ON "account" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "credit_transaction_type_idx" ON "credit_transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "credit_transaction_plan_id_idx" ON "credit_transaction" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "credit_transaction_grant_month_idx" ON "credit_transaction" USING btree ("grant_month");--> statement-breakpoint
CREATE INDEX "generation_history_lifecycle_phase_idx" ON "generation_history" USING btree ("lifecycle_phase");--> statement-breakpoint
CREATE INDEX "generation_history_status_lifecycle_idx" ON "generation_history" USING btree ("status","lifecycle_phase");--> statement-breakpoint
CREATE INDEX "generation_history_status_last_provider_sync_idx" ON "generation_history" USING btree ("status","last_provider_sync_at");--> statement-breakpoint
CREATE INDEX "payment_type_idx" ON "payment" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payment_scene_idx" ON "payment" USING btree ("scene");--> statement-breakpoint
CREATE INDEX "payment_price_id_idx" ON "payment" USING btree ("price_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_paid_idx" ON "payment" USING btree ("paid");--> statement-breakpoint
CREATE INDEX "payment_next_price_id_idx" ON "payment" USING btree ("next_price_id");--> statement-breakpoint
CREATE INDEX "payment_credits_anchor_at_idx" ON "payment" USING btree ("credits_anchor_at");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
ALTER TABLE "generation_history" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_normalized_email_unique" UNIQUE("normalized_email");--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE ALL ON TABLES FROM anon, authenticated;--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE ALL ON SEQUENCES FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE
  public.verification,
  public.account,
  public.session,
  public.user_credit,
  public.generation_asset_link,
  public.user_asset,
  public."user",
  public.effect,
  public.credit_transaction,
  public.payment,
  public.generation_history
FROM anon, authenticated;--> statement-breakpoint
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.user_credit ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.generation_asset_link ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.user_asset ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.effect ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.credit_transaction ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.payment ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;
