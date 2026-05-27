CREATE TABLE "anonymous_trial_quota" (
	"id" text PRIMARY KEY NOT NULL,
	"fingerprint_hash" text NOT NULL,
	"window_key" text NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"first_used_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "anonymous_trial_quota_fingerprint_idx" ON "anonymous_trial_quota" USING btree ("fingerprint_hash");--> statement-breakpoint
CREATE INDEX "anonymous_trial_quota_window_idx" ON "anonymous_trial_quota" USING btree ("window_key");--> statement-breakpoint
CREATE UNIQUE INDEX "anonymous_trial_quota_fingerprint_window_uidx" ON "anonymous_trial_quota" USING btree ("fingerprint_hash","window_key");--> statement-breakpoint
REVOKE ALL ON TABLE public.anonymous_trial_quota FROM anon, authenticated;--> statement-breakpoint
ALTER TABLE public.anonymous_trial_quota ENABLE ROW LEVEL SECURITY;
