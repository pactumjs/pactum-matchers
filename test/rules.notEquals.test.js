const suite = require('uvu').suite;
const assert = require('assert');
const { notEquals, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - notEquals');

test('notEquals - default value', () => {
  const actual = 'some';
  const value = notEquals();
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_EQUALS',
    value: undefined
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_equals'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('notEquals - custom value', () => {
  const actual = 'some';
  const value = notEquals('any');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_EQUALS',
    value: 'any'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_equals'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('notEquals - comparison fails', () => {
  const actual = 'hello';
  const value = notEquals('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_EQUALS',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'not_equals'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json have a value 'hello' at '$.body'`);
});

test.run();