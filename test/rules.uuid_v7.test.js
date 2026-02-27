const suite = require('uvu').suite;
const assert = require('assert');
const { uuidV7, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - uuidV7');

test('uuidV7 - default value - root string - comparison passes', () => {
  const actual = '01952bc0-71b6-7123-a3f4-716b8b4f0123';
  const value = uuidV7();
  assert.deepStrictEqual(value, {
    pactum_type: 'UUID_V7',
    value: '01952bc0-71b6-7123-a3f4-716b8b4f0123'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'uuid_v7'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('uuidV7 - custom value - root string - comparison fails', () => {
  const actual = '01952bc0-71b6-4123-a3f4-716b8b4f0123';
  const value = uuidV7('01952bc0-71b6-7123-a3f4-716b8b4f0123');
  assert.deepStrictEqual(value, {
    pactum_type: 'UUID_V7',
    value: '01952bc0-71b6-7123-a3f4-716b8b4f0123'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'uuid_v7'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "UUID_V7" pattern at "$.body" but found "01952bc0-71b6-4123-a3f4-716b8b4f0123"`);
});

test.run();
