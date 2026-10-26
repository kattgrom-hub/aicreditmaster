import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const checklist = readFileSync(new URL('../public/credit-report-review-checklist.html', import.meta.url), 'utf8');

test('paid offer remains A$197 and deliberately closed', () => {
  assert.match(index, /A\$197 Australian Credit Clarity Workbook \+ AI Toolkit/);
  assert.match(index, /Purchases temporarily unavailable/);
  assert.doesNotMatch(index, /href=["'][^"']*(stripe|whop)[^"']*["'][^>]*class=["'][^"']*checkout/i);
});

test('storefront exposes the free authority asset', () => {
  assert.match(index, /credit-report-review-checklist\.html/);
  assert.match(checklist, /Free Australian resource/);
  assert.match(checklist, /Educational information only/);
});

test('no retired Whop integration identifiers are introduced', () => {
  const retired = ['@whop/api', 'public-graphql', '/api/v2', 'WhopServerSdk', 'makeWhopServerSdk'];
  for (const token of retired) {
    assert.equal(index.includes(token), false, token);
    assert.equal(checklist.includes(token), false, token);
  }
});
