import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSafeCallbackPath } from './callback-url';

test('keeps safe same-site callback paths', () => {
  assert.equal(resolveSafeCallbackPath('/app'), '/app');
  assert.equal(resolveSafeCallbackPath('/zh/app?tab=history#top'), '/zh/app?tab=history#top');
});

test('rejects absolute, protocol-relative, and control-character callback URLs', () => {
  assert.equal(resolveSafeCallbackPath('https://evil.example/app', '/app'), '/app');
  assert.equal(resolveSafeCallbackPath('//evil.example/app', '/app'), '/app');
  assert.equal(resolveSafeCallbackPath('/app\nhttps://evil.example', '/app'), '/app');
});

test('falls back to a safe path when callback is empty or fallback is unsafe', () => {
  assert.equal(resolveSafeCallbackPath('', '/zh/app'), '/zh/app');
  assert.equal(resolveSafeCallbackPath(null, 'https://evil.example'), '/app');
});
