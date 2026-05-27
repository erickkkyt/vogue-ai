import { createHash, randomInt, randomUUID } from 'crypto';
import { addCredits } from '@/credits/credits';
import { CREDIT_TRANSACTION_TYPE } from '@/credits/types';
import { findVogueCreditPackById } from '@/config/pricing';
import { getDb } from '@/db';
import { creditTransaction, payment } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { PaymentScenes, PaymentTypes } from './types';

export type ZpayPaymentMethod = 'alipay' | 'wxpay';

type ZpayPrimitive = string | number | boolean | null | undefined;
type ZpayParams = Record<string, ZpayPrimitive>;

type ZpayRuntimeConfig = {
  pid: string;
  key: string;
  gatewayUrl: string;
};

type ZpayCheckoutParams = {
  pid: string;
  type: ZpayPaymentMethod;
  out_trade_no: string;
  notify_url: string;
  return_url: string;
  name: string;
  money: string;
  param?: string;
  sitename?: string;
};

type CreateZpayCreditCheckoutParams = {
  packageId: string;
  paymentMethod: ZpayPaymentMethod;
  userId: string;
};

const ZPAY_GATEWAY_URL = 'https://z-pay.cn';
const ZPAY_PRICE_ID_PREFIX = 'zpay:credit:';

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function normalizeGatewayUrl(gatewayUrl: string) {
  return gatewayUrl.replace(/\/+$/, '');
}

function normalizeZpayAmount(value: string | number): string {
  const amount = Number.parseFloat(String(value));
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid ZPAY amount: ${value}`);
  }

  return amount.toFixed(2);
}

function getZpayRuntimeConfig(): ZpayRuntimeConfig {
  const pid = process.env.ZPAY_PID;
  const key = process.env.ZPAY_KEY;

  if (!pid) throw new Error('ZPAY_PID environment variable is not set');
  if (!key) throw new Error('ZPAY_KEY environment variable is not set');

  return {
    pid,
    key,
    gatewayUrl: normalizeGatewayUrl(
      process.env.ZPAY_GATEWAY_URL || ZPAY_GATEWAY_URL
    ),
  };
}

function getZpayCreditAmountCny(packageId: string): string {
  const price = findVogueCreditPackById(packageId);
  if (!price) throw new Error(`Unknown credit package: ${packageId}`);
  if (!price.zpayAmountEnvKey) {
    throw new Error(`ZPAY amount env key is missing for ${packageId}`);
  }

  const amount = process.env[price.zpayAmountEnvKey];
  if (!amount) {
    throw new Error(`${price.zpayAmountEnvKey} environment variable is not set`);
  }

  return normalizeZpayAmount(amount);
}

function getZpayCreditPriceId(
  packageId: string,
  paymentMethod: ZpayPaymentMethod
): string {
  return `${ZPAY_PRICE_ID_PREFIX}${packageId}:${paymentMethod}`;
}

function parseZpayCreditPriceId(priceId: string):
  | {
      packageId: string;
      paymentMethod: ZpayPaymentMethod;
    }
  | null {
  if (!priceId.startsWith(ZPAY_PRICE_ID_PREFIX)) return null;

  const [packageId, paymentMethod] = priceId
    .slice(ZPAY_PRICE_ID_PREFIX.length)
    .split(':');

  if (!packageId || (paymentMethod !== 'alipay' && paymentMethod !== 'wxpay')) {
    return null;
  }

  return { packageId, paymentMethod };
}

function normalizeZpayParams(
  input: URLSearchParams | Record<string, unknown>
): Record<string, string> {
  const params: Record<string, string> = {};

  if (input instanceof URLSearchParams) {
    input.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      const firstValue = value[0];
      if (firstValue !== undefined && firstValue !== null) {
        params[key] = String(firstValue);
      }
      return;
    }
    params[key] = String(value);
  });

  return params;
}

function getZpaySignPayload(params: ZpayParams): string {
  return Object.entries(params)
    .filter(([key, value]) => {
      if (key === 'sign' || key === 'sign_type') return false;
      return value !== undefined && value !== null && String(value) !== '';
    })
    .sort(([left], [right]) => {
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    })
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('&');
}

export function buildZpaySign(params: ZpayParams, key: string): string {
  return createHash('md5')
    .update(`${getZpaySignPayload(params)}${key}`)
    .digest('hex');
}

export function verifyZpaySign(
  input: URLSearchParams | Record<string, unknown>,
  key: string
): boolean {
  const params = normalizeZpayParams(input);
  const providedSign = params.sign;
  if (!providedSign) return false;

  return buildZpaySign(params, key) === providedSign.toLowerCase();
}

export function buildZpayCheckoutUrl(
  params: ZpayCheckoutParams,
  config: Pick<ZpayRuntimeConfig, 'key' | 'gatewayUrl'>
): string {
  const signedParams = {
    ...params,
    sign: buildZpaySign(params, config.key),
    sign_type: 'MD5',
  };
  const url = new URL('/submit.php', normalizeGatewayUrl(config.gatewayUrl));

  Object.entries(signedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function createZpayOutTradeNo(): string {
  return `${Date.now()}${randomInt(100_000, 999_999)}`;
}

function getZpayProductName(packageId: string, credits: number): string {
  return `Vogue AI ${credits} Credits (${packageId})`;
}

async function queryZpayOrder(
  outTradeNo: string,
  config: ZpayRuntimeConfig
): Promise<Record<string, unknown>> {
  const url = new URL('/api.php', config.gatewayUrl);
  url.searchParams.set('act', 'order');
  url.searchParams.set('pid', config.pid);
  url.searchParams.set('key', config.key);
  url.searchParams.set('out_trade_no', outTradeNo);

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`ZPAY order query failed with ${response.status}`);
  }

  return (await response.json()) as Record<string, unknown>;
}

export async function createZpayCreditCheckout({
  packageId,
  paymentMethod,
  userId,
}: CreateZpayCreditCheckoutParams) {
  const price = findVogueCreditPackById(packageId);
  if (!price) throw new Error(`Unknown credit package: ${packageId}`);

  const config = getZpayRuntimeConfig();
  const amountCny = getZpayCreditAmountCny(packageId);
  const outTradeNo = createZpayOutTradeNo();
  const baseUrl = getBaseUrl();
  const createdAt = new Date();
  const db = await getDb();

  await db.insert(payment).values({
    id: randomUUID(),
    priceId: getZpayCreditPriceId(packageId, paymentMethod),
    type: PaymentTypes.ZPAY,
    scene: PaymentScenes.CREDIT,
    interval: null,
    userId,
    customerId: `zpay:${userId}`,
    subscriptionId: null,
    sessionId: outTradeNo,
    invoiceId: null,
    status: 'processing',
    paid: false,
    createdAt,
    updatedAt: createdAt,
  });

  return {
    id: outTradeNo,
    url: buildZpayCheckoutUrl(
      {
        pid: config.pid,
        type: paymentMethod,
        out_trade_no: outTradeNo,
        notify_url: `${baseUrl}/api/webhooks/zpay`,
        return_url: `${baseUrl}/api/payment/zpay/return`,
        name: getZpayProductName(packageId, price.credits),
        money: amountCny,
        param: `package:${packageId}`,
        sitename: 'Vogue AI',
      },
      config
    ),
  };
}

export async function handleZpayNotification(
  input: URLSearchParams | Record<string, unknown>
): Promise<{ outTradeNo: string; processed: boolean }> {
  const params = normalizeZpayParams(input);
  const config = getZpayRuntimeConfig();

  if (!verifyZpaySign(params, config.key)) {
    throw new Error('Invalid ZPAY signature');
  }
  if (params.pid !== config.pid) {
    throw new Error('Invalid ZPAY pid');
  }
  if (!params.out_trade_no) {
    throw new Error('Missing ZPAY out_trade_no');
  }

  const outTradeNo = params.out_trade_no;
  if (params.trade_status !== 'TRADE_SUCCESS') {
    return { outTradeNo, processed: false };
  }

  const db = await getDb();
  const paymentRows = await db
    .select()
    .from(payment)
    .where(eq(payment.sessionId, outTradeNo))
    .limit(1);
  const paymentRecord = paymentRows[0];
  if (!paymentRecord) {
    throw new Error(`Payment record not found for ZPAY order ${outTradeNo}`);
  }

  const zpayPrice = parseZpayCreditPriceId(paymentRecord.priceId);
  if (!zpayPrice) {
    throw new Error(`Invalid ZPAY price ID ${paymentRecord.priceId}`);
  }

  const price = findVogueCreditPackById(zpayPrice.packageId);
  if (!price) throw new Error(`Unknown credit package ${zpayPrice.packageId}`);

  const expectedAmount = getZpayCreditAmountCny(zpayPrice.packageId);
  if (params.type !== zpayPrice.paymentMethod) {
    throw new Error(`ZPAY payment method mismatch for ${outTradeNo}`);
  }
  if (normalizeZpayAmount(String(params.money)) !== expectedAmount) {
    throw new Error(`ZPAY amount mismatch for ${outTradeNo}`);
  }

  const order = await queryZpayOrder(outTradeNo, config);
  if (String(order.code) !== '1' || String(order.status) !== '1') {
    throw new Error(`ZPAY order ${outTradeNo} is not paid`);
  }
  if (String(order.out_trade_no) !== outTradeNo) {
    throw new Error('ZPAY order query returned a different out_trade_no');
  }
  if (String(order.type) !== zpayPrice.paymentMethod) {
    throw new Error(`ZPAY order method mismatch for ${outTradeNo}`);
  }
  if (normalizeZpayAmount(String(order.money)) !== expectedAmount) {
    throw new Error(`ZPAY order amount mismatch for ${outTradeNo}`);
  }

  const existingCredit = await db
    .select({ id: creditTransaction.id })
    .from(creditTransaction)
    .where(
      and(
        eq(creditTransaction.userId, paymentRecord.userId),
        eq(creditTransaction.type, CREDIT_TRANSACTION_TYPE.PURCHASE),
        eq(creditTransaction.referenceType, 'zpay_order'),
        eq(creditTransaction.referenceId, outTradeNo)
      )
    )
    .limit(1);

  if (existingCredit.length === 0) {
    await addCredits({
      userId: paymentRecord.userId,
      amount: price.credits,
      type: CREDIT_TRANSACTION_TYPE.PURCHASE,
      description: `${price.name} credits via ZPAY ${zpayPrice.paymentMethod}`,
      priceId: paymentRecord.priceId,
      referenceType: 'zpay_order',
      referenceId: outTradeNo,
    });
  }

  await db
    .update(payment)
    .set({
      paid: true,
      status: 'completed',
      invoiceId: params.trade_no || null,
      updatedAt: new Date(),
    })
    .where(eq(payment.id, paymentRecord.id));

  return { outTradeNo, processed: existingCredit.length === 0 };
}

export async function handleZpayReturn(
  input: URLSearchParams | Record<string, unknown>
): Promise<{ outTradeNo: string | null }> {
  const params = normalizeZpayParams(input);
  const outTradeNo = params.out_trade_no ?? null;

  if (params.trade_status === 'TRADE_SUCCESS' && params.sign) {
    try {
      await handleZpayNotification(params);
    } catch (error) {
      console.warn('ZPAY return processing deferred to webhook:', error);
    }
  }

  return { outTradeNo };
}
