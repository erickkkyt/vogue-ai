import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_ROUTE_SMOKE_TARGETS,
  isRouteSmokeResultAccepted,
  parseRouteSmokeBaseUrl,
} from './route-smoke';

test('covers the launch-critical public app and auth routes', () => {
  assert.deepEqual(
    DEFAULT_ROUTE_SMOKE_TARGETS.map((target) => target.path),
    ['/app', '/login', '/zh', '/zh/app', '/auth/login']
  );
});

test('rejects 500-class route smoke responses', () => {
  const target = DEFAULT_ROUTE_SMOKE_TARGETS[0];

  assert.equal(isRouteSmokeResultAccepted(target, { status: 200 }), true);
  assert.equal(isRouteSmokeResultAccepted(target, { status: 302 }), false);
  assert.equal(isRouteSmokeResultAccepted(target, { status: 500 }), false);
});

test('normalizes route smoke base URLs', () => {
  assert.equal(
    parseRouteSmokeBaseUrl(['--base-url', 'http://localhost:3002/'], {}),
    'http://localhost:3002'
  );
  assert.equal(
    parseRouteSmokeBaseUrl([], { ROUTE_SMOKE_BASE_URL: 'http://127.0.0.1:3000/' }),
    'http://127.0.0.1:3000'
  );
});
