const suite = require('uvu').suite;
const assert = require('assert');
const { any, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('any - default value - root string - comparison passes', () => {
  const actual = 'some';
  const value = any();
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 'Pact123'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'any'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Any - custom value - root number - comparison passes', () => {
  const actual = 921;
  const value = any('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'any'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('any - custom value - root string - comparison passes with empty string', () => {
  const actual = '';
  const value = any('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'any'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('any - custom value - root string - comparison passes with undefined or null value', () => {
  const actual = undefined;
  const value = any('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'any'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('any - custom value - root string - comparison passes with special characters', () => {
  const actual = "P@3Tu^^";
  const value = any('hello');
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 'hello'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'any'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test.run();