import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  buildZpayCheckoutUrl,
  buildZpaySign,
  verifyZpaySign,
} from './zpay';

test('buildZpaySign follows the ZPAY MD5 signing rules', () => {
  const params = {
    pid: '20220715225121',
    type: 'alipay',
    out_trade_no: '20160806151343349',
    notify_url: 'https://vogueai.net/api/webhooks/zpay',
    name: 'Vogue AI 50 Credits',
    money: '35.00',
    return_url: 'https://vogueai.net/api/payment/zpay/return',
    sign: 'ignored',
    sign_type: 'MD5',
    empty: '',
  };

  assert.equal(
    buildZpaySign(params, 'secret_key'),
    '53c40beff507b938ab5e050c3b495fc8'
  );
  assert.equal(
    verifyZpaySign(
      { ...params, sign: '53c40beff507b938ab5e050c3b495fc8' },
      'secret_key'
    ),
    true
  );
});

test('buildZpayCheckoutUrl creates a signed submit.php URL', () => {
  const url = new URL(
    buildZpayCheckoutUrl(
      {
        pid: '20220715225121',
        type: 'wxpay',
        out_trade_no: '20160806151343349',
        notify_url: 'https://vogueai.net/api/webhooks/zpay',
        name: 'Vogue AI 150 Credits',
        money: '99.00',
        return_url: 'https://vogueai.net/api/payment/zpay/return',
      },
      {
        key: 'secret_key',
        gatewayUrl: 'https://z-pay.cn',
      }
    )
  );

  assert.equal(url.origin, 'https://z-pay.cn');
  assert.equal(url.pathname, '/submit.php');
  assert.equal(url.searchParams.get('type'), 'wxpay');
  assert.equal(
    url.searchParams.get('notify_url'),
    'https://vogueai.net/api/webhooks/zpay'
  );
  assert.equal(
    url.searchParams.get('return_url'),
    'https://vogueai.net/api/payment/zpay/return'
  );
  assert.equal(url.searchParams.get('sign_type'), 'MD5');
  assert.equal(url.searchParams.get('sign')?.length, 32);
});

test('ZPAY provider preserves gptimg-style credit package metadata hooks', () => {
  const source = readFileSync(join(process.cwd(), 'src/payment/zpay.ts'), 'utf8');

  assert.match(source, /getZpayCreditPriceId\(packageId, paymentMethod\)/);
  assert.match(source, /param: `package:\$\{packageId\}`/);
  assert.match(source, /PaymentScenes\.CREDIT/);
});
