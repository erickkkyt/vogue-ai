import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('dry-run skips reachability checks for newly planned mirror targets', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vogue-mirror-dry-run-'));
  const draftPath = path.join(tempDir, 'draft.ts');
  const source = [
    "export const post = {",
    "  image: 'https://example.com/external-image.jpg',",
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(draftPath, source);

  const output = execFileSync(
    'pnpm',
    [
      'exec',
      'tsx',
      'scripts/mirror-vogue-blog-images.ts',
      '--slug',
      'dry-run-test',
      '--draft-path',
      draftPath,
      '--dry-run',
    ],
    {
      cwd: path.resolve(import.meta.dirname, '..'),
      encoding: 'utf8',
      env: {
        ...process.env,
        R2_ENDPOINT: 'http://127.0.0.1:9',
        R2_ACCESS_KEY_ID: 'test',
        R2_SECRET_ACCESS_KEY: 'test',
        R2_IMAGE_BUCKET_NAME: 'image',
        R2_MEDIA_PUBLIC_URL: 'http://127.0.0.1:9/media',
        R2_VIDEO_BUCKET_NAME: 'video',
        R2_VIDEO_PUBLIC_URL: 'http://127.0.0.1:9/video',
      },
    }
  );

  const jsonStart = output.lastIndexOf('\n{');
  const result = JSON.parse(jsonStart === -1 ? output : output.slice(jsonStart + 1));
  assert.equal(result.mirroredCount, 1);
  assert.equal(result.replacedUrlCount, 1);
  assert.equal(result.uploaded[0].mediaKind, 'image');
  assert.deepEqual(result.brokenOwnedUrls, []);
  assert.equal(fs.readFileSync(draftPath, 'utf8'), source);
});

test('dry-run mirrors blog videos to the VogueAI video custom domain', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vogue-mirror-video-dry-run-'));
  const draftPath = path.join(tempDir, 'draft.ts');
  const source = [
    "export const post = {",
    "  demoVideo: 'https://example.com/tutorials/demo-video.mp4',",
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(draftPath, source);

  const output = execFileSync(
    'pnpm',
    [
      'exec',
      'tsx',
      'scripts/mirror-vogue-blog-images.ts',
      '--slug',
      'video-run-test',
      '--draft-path',
      draftPath,
      '--dry-run',
    ],
    {
      cwd: path.resolve(import.meta.dirname, '..'),
      encoding: 'utf8',
      env: {
        ...process.env,
        R2_ENDPOINT: 'http://127.0.0.1:9',
        R2_ACCESS_KEY_ID: 'test',
        R2_SECRET_ACCESS_KEY: 'test',
        R2_IMAGE_BUCKET_NAME: 'image',
        R2_MEDIA_PUBLIC_URL: 'http://127.0.0.1:9/media',
        R2_VIDEO_BUCKET_NAME: 'video',
        R2_VIDEO_PUBLIC_URL: 'https://video.vogueai.net',
      },
    }
  );

  const jsonStart = output.lastIndexOf('\n{');
  const result = JSON.parse(jsonStart === -1 ? output : output.slice(jsonStart + 1));
  assert.equal(result.mirroredCount, 1);
  assert.equal(result.replacedUrlCount, 1);
  assert.equal(result.uploaded[0].mediaKind, 'video');
  assert.match(
    result.uploaded[0].targetUrl,
    /^https:\/\/video\.vogueai\.net\/blog\/auto\/video-run-test\/[a-f0-9]{12}-demo-video\.mp4$/
  );
  assert.deepEqual(result.brokenOwnedUrls, []);
  assert.equal(fs.readFileSync(draftPath, 'utf8'), source);
});
