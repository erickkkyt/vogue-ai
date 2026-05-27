import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  index,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	normalizedEmail: text('normalized_email').unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	role: text('role'),
	banned: boolean('banned'),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	customerId: text('customer_id'),
	subscriptionState: text('subscription_state').notNull().default('free'),
}, (table) => ({
	userIdIdx: index("user_id_idx").on(table.id),
	userCustomerIdIdx: index("user_customer_id_idx").on(table.customerId),
	userRoleIdx: index("user_role_idx").on(table.role),
	userSubscriptionStateIdx: index("user_subscription_state_idx").on(table.subscriptionState),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by')
}, (table) => ({
	sessionTokenIdx: index("session_token_idx").on(table.token),
	sessionUserIdIdx: index("session_user_id_idx").on(table.userId),
}));

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
}, (table) => ({
	accountUserIdIdx: index("account_user_id_idx").on(table.userId),
	accountAccountIdIdx: index("account_account_id_idx").on(table.accountId),
	accountProviderIdIdx: index("account_provider_id_idx").on(table.providerId),
}));

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const payment = pgTable("payment", {
	id: text("id").primaryKey(),
	priceId: text('price_id').notNull(),
	type: text('type').notNull(),
	scene: text('scene'), // payment scene: 'lifetime', 'credit', 'subscription'
	interval: text('interval'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	customerId: text('customer_id').notNull(),
	subscriptionId: text('subscription_id'),
	sessionId: text('session_id').unique(),
	invoiceId: text('invoice_id').unique(), // unique constraint for avoiding duplicate processing
	status: text('status').notNull(),
	paid: boolean('paid').notNull().default(false), // indicates whether payment is completed (set in invoice.paid event)
	periodStart: timestamp('period_start'),
	periodEnd: timestamp('period_end'),
	cancelAtPeriodEnd: boolean('cancel_at_period_end'),
	trialStart: timestamp('trial_start'),
	trialEnd: timestamp('trial_end'),
	creditsAnchorAt: timestamp('credits_anchor_at'),
	nextPriceId: text('next_price_id'),
	lastPlanChangeAt: timestamp('last_plan_change_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
	paymentTypeIdx: index("payment_type_idx").on(table.type),
	paymentSceneIdx: index("payment_scene_idx").on(table.scene),
	paymentPriceIdIdx: index("payment_price_id_idx").on(table.priceId),
	paymentUserIdIdx: index("payment_user_id_idx").on(table.userId),
	paymentCustomerIdIdx: index("payment_customer_id_idx").on(table.customerId),
	paymentStatusIdx: index("payment_status_idx").on(table.status),
	paymentPaidIdx: index("payment_paid_idx").on(table.paid),
	paymentSubscriptionIdIdx: index("payment_subscription_id_idx").on(table.subscriptionId),
	paymentSessionIdIdx: index("payment_session_id_idx").on(table.sessionId),
	paymentInvoiceIdIdx: index("payment_invoice_id_idx").on(table.invoiceId),
	paymentNextPriceIdIdx: index("payment_next_price_id_idx").on(table.nextPriceId),
	paymentCreditsAnchorAtIdx: index("payment_credits_anchor_at_idx").on(table.creditsAnchorAt),
}));

export const userCredit = pgTable("user_credit", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	currentCredits: integer("current_credits").notNull().default(0),
	lastRefreshAt: timestamp("last_refresh_at"), // deprecated
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	userCreditUserIdIdx: index("user_credit_user_id_idx").on(table.userId),
	userCreditUserIdUidx: uniqueIndex("user_credit_user_id_uidx").on(table.userId),
}));

export const creditTransaction = pgTable("credit_transaction", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	type: text("type").notNull(),
	description: text("description"),
	planId: text("plan_id"),
	priceId: text("price_id"),
	subscriptionId: text("subscription_id"),
	grantMonth: timestamp("grant_month"),
	amount: integer("amount").notNull(),
	remainingAmount: integer("remaining_amount"),
	referenceType: text("reference_type"),
	referenceId: text("reference_id"),
	expirationDate: timestamp("expiration_date"),
	expirationDateProcessedAt: timestamp("expiration_date_processed_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	creditTransactionUserIdIdx: index("credit_transaction_user_id_idx").on(table.userId),
	creditTransactionTypeIdx: index("credit_transaction_type_idx").on(table.type),
	creditTransactionPlanIdIdx: index("credit_transaction_plan_id_idx").on(table.planId),
	creditTransactionGrantMonthIdx: index("credit_transaction_grant_month_idx").on(table.grantMonth),
	creditTransactionReferenceIdx: index("credit_transaction_reference_idx").on(table.referenceType, table.referenceId),
}));

export const dailyCheckIn = pgTable("daily_check_in", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	campaignKey: text("campaign_key").notNull(),
	dayIndex: integer("day_index").notNull(),
	creditsGranted: integer("credits_granted").notNull(),
	checkedInAt: timestamp("checked_in_at").notNull().defaultNow(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	dailyCheckInUserIdIdx: index("daily_check_in_user_id_idx").on(table.userId),
	dailyCheckInCampaignIdx: index("daily_check_in_campaign_idx").on(table.campaignKey),
	dailyCheckInUserCampaignDayUidx: uniqueIndex("daily_check_in_user_campaign_day_uidx").on(table.userId, table.campaignKey, table.dayIndex),
}));

export const anonymousTrialQuota = pgTable("anonymous_trial_quota", {
	id: text("id").primaryKey(),
	fingerprintHash: text("fingerprint_hash").notNull(),
	windowKey: text("window_key").notNull(),
	usedCount: integer("used_count").notNull().default(0),
	firstUsedAt: timestamp("first_used_at").notNull().defaultNow(),
	lastUsedAt: timestamp("last_used_at").notNull().defaultNow(),
}, (table) => ({
	anonymousTrialQuotaFingerprintIdx: index("anonymous_trial_quota_fingerprint_idx").on(table.fingerprintHash),
	anonymousTrialQuotaWindowIdx: index("anonymous_trial_quota_window_idx").on(table.windowKey),
	anonymousTrialQuotaFingerprintWindowUidx: uniqueIndex("anonymous_trial_quota_fingerprint_window_uidx").on(table.fingerprintHash, table.windowKey),
}));

export const effect = pgTable("effect", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	type: integer("type").notNull(), // 1=video, 2=image, 3=audio
	model: text("model").notNull(),
	version: text("version"),
	credit: integer("credit").notNull(),
	linkName: text("link_name").notNull().unique(),
	prePrompt: text("pre_prompt"),
	description: text("des"),
	platform: text("platform"),
	api: text("api"),
	isOpen: integer("is_open").default(1),
	createdAt: timestamp("created_at").defaultNow(),
	provider: text("provider").notNull(),
	inputSchema: jsonb("input_schema"), // For dynamic forms
	pricingSchema: jsonb("pricing_schema"), // For dynamic credit calculation
}, (table) => ({
	effectLinkNameIdx: index("effect_link_name_idx").on(table.linkName),
	effectProviderIdx: index("effect_provider_idx").on(table.provider),
}));

export const generationHistory = pgTable("generation_history", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	effectId: integer("effect_id").notNull().references(() => effect.id, { onDelete: 'cascade' }),
	status: text("status").notNull(),
	providerTaskId: text("provider_task_id"),
	lifecyclePhase: text("lifecycle_phase"),
	lastProviderSyncAt: timestamp("last_provider_sync_at"),
	input: jsonb("input"),
	output: jsonb("output"),
	error: text("error"),
	creditsUsed: integer("credits_used").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
	generationHistoryUserIdIdx: index("generation_history_user_id_idx").on(table.userId),
	generationHistoryEffectIdIdx: index("generation_history_effect_id_idx").on(table.effectId),
	generationHistoryStatusIdx: index("generation_history_status_idx").on(table.status),
	generationHistoryProviderTaskIdIdx: index("generation_history_provider_task_id_idx").on(table.providerTaskId),
	generationHistoryLifecyclePhaseIdx: index("generation_history_lifecycle_phase_idx").on(table.lifecyclePhase),
	generationHistoryStatusLifecycleIdx: index("generation_history_status_lifecycle_idx").on(table.status, table.lifecyclePhase),
	generationHistoryStatusLastSyncIdx: index("generation_history_status_last_provider_sync_idx").on(table.status, table.lastProviderSyncAt),
}));

export const userAsset = pgTable("user_asset", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	type: text("type").notNull(), // image | video | audio
	source: text("source").notNull(), // upload | provider | derived
	bucket: text("bucket").notNull(),
	objectKey: text("object_key").notNull(),
	publicUrl: text("public_url").notNull(),
	mimeType: text("mime_type"),
	sizeBytes: integer("size_bytes"),
	sha256: text("sha256"),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	userAssetUserIdIdx: index("user_asset_user_id_idx").on(table.userId),
	userAssetTypeIdx: index("user_asset_type_idx").on(table.type),
	userAssetCreatedAtIdx: index("user_asset_created_at_idx").on(table.createdAt),
	userAssetBucketObjectKeyUidx: uniqueIndex("user_asset_bucket_object_key_uidx").on(table.bucket, table.objectKey),
}));

export const generationAssetLink = pgTable("generation_asset_link", {
	id: text("id").primaryKey(),
	generationId: text("generation_id").notNull().references(() => generationHistory.id, { onDelete: 'cascade' }),
	assetId: text("asset_id").notNull().references(() => userAsset.id, { onDelete: 'cascade' }),
	role: text("role").notNull(), // input | output | reference
	createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
	generationAssetLinkGenerationIdx: index("generation_asset_link_generation_idx").on(table.generationId),
	generationAssetLinkAssetIdx: index("generation_asset_link_asset_idx").on(table.assetId),
	generationAssetLinkUnique: uniqueIndex("generation_asset_link_unique").on(table.generationId, table.assetId, table.role),
}));
