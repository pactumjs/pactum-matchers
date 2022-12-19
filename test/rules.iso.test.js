const suite = require('uvu').suite;
const assert = require('assert');
const { iso, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - iso');

test('iso - default value - comparison passes', () => {
  const actual = '2022-12-21T21:28:00.000Z';
  const value = iso();
  assert.deepStrictEqual(value, {
    pactum_type: 'ISO',
    value: '2022-02-21T21:28:00.000Z'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'iso'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('iso - custom value - comparison fails', () => {
  const actual = '2022-02-21T21:28:1';
  const value = iso('2022-02-21T21:28:1');
  assert.deepStrictEqual(value, {
    pactum_type: 'ISO',
    value: '2022-02-21T21:28:1'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'iso'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "ISO" date format at "$.body" but found "2022-02-21T21:28:1"`);
});

test.run();