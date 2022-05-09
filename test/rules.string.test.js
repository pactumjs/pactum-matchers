const suite = require('uvu').suite;
const assert = require('assert');
const { string, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - string');

test('string - default value - root string - comparison passes', () => {
  const actual = 'some';
  const value = string();
  assert.deepStrictEqual(value, {
    pactum_type: 'STRING',
    value: 'string'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'string'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('string - custom value - root string - comparison fails with number', () => {
  const actual = 92;
  const value = string('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'STRING',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'string'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'string' at '$.body' but found 'number'`);
});

test('string - custom value - root string - comparison fails with empty string', () => {
  const actual = '';
  const value = string('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'STRING',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'string'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json have an empty string at '$.body'`);
});

test.run();