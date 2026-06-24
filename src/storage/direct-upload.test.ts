import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDirectUploadKey,
  buildDirectUploadPrefix,
} from './direct-upload';
import { assertDirectUploadObjectMatchesOrCleanup } from './direct-upload-verification';

test('builds direct upload keys under a user-owned prefix', () => {
  const prefix = buildDirectUploadPrefix('user/../alpha');
  const key = buildDirectUploadKey({
    userId: 'user/../alpha',
    filename: '../avatar.PNG',
  });

  assert.match(prefix, /^user-uploads\/[0-9a-f]{32}$/);
  assert.match(key, new RegExp(`^${prefix}/[0-9a-f-]+\\.png$`));
  assert.doesNotMatch(key, /\.\.\//);
  assert.doesNotMatch(key, /^prompt-libraries\//);
  assert.doesNotMatch(key, /user\/\.\.\/alpha/);
});

test('builds stable direct upload prefixes without path separators from user ids', () => {
  const prefix = buildDirectUploadPrefix('user/../alpha');

  assert.equal(prefix, buildDirectUploadPrefix('user/../alpha'));
  assert.doesNotMatch(prefix.replace('user-uploads/', ''), /\//);
});

test('cleans up an existing direct upload object after size mismatch', async () => {
  const cleaned: Array<{ key: string; bucket: string }> = [];

  await assert.rejects(
    () =>
      assertDirectUploadObjectMatchesOrCleanup({
        upload: {
          key: 'user-uploads/user-1/file.png',
          bucket: 'image-bucket',
          mimeType: 'image/png',
          sizeBytes: 128,
        },
        object: {
          exists: true,
          sizeBytes: 256,
          contentType: 'image/png',
        },
        cleanup: async (upload) => {
          cleaned.push(upload);
        },
      }),
    /size does not match/
  );

  assert.deepEqual(cleaned, [
    { key: 'user-uploads/user-1/file.png', bucket: 'image-bucket' },
  ]);
});

test('does not clean up when the direct upload object is missing', async () => {
  let cleanupCalled = false;

  await assert.rejects(
    () =>
      assertDirectUploadObjectMatchesOrCleanup({
        upload: {
          key: 'user-uploads/user-1/file.png',
          bucket: 'image-bucket',
          mimeType: 'image/png',
          sizeBytes: 128,
        },
        object: {
          exists: false,
        },
        cleanup: async () => {
          cleanupCalled = true;
        },
      }),
    /not found/
  );

  assert.equal(cleanupCalled, false);
});

test('accepts matching direct upload objects without cleanup', async () => {
  let cleanupCalled = false;

  await assertDirectUploadObjectMatchesOrCleanup({
    upload: {
      key: 'user-uploads/user-1/file.png',
      bucket: 'image-bucket',
      mimeType: 'image/png',
      sizeBytes: 128,
    },
    object: {
      exists: true,
      sizeBytes: 128,
      contentType: 'image/png; charset=utf-8',
    },
    cleanup: async () => {
      cleanupCalled = true;
    },
  });

  assert.equal(cleanupCalled, false);
});
