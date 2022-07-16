const suite = require('uvu').suite;
const assert = require('assert');
const { notNull, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - notNull');

test('notNull - default value', () => {
  const actual = 'some';
  const value = notNull();
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_NULL',
    value: undefined
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_null'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('notNull - custom value', () => {
  const actual = 'some';
  const value = notNull('any');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_NULL',
    value: 'any'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_null'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('notNull - comparison fails', () => {
  const actual = null;
  const value = notNull('any');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_NULL',
    value: 'any'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_null'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, 'Json has a "null" at "$.body"');
});

test.run();