const suite = require('uvu').suite;
const assert = require('assert');
const { any, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('Any - custom value - root number - comparison passes with an interger number', () => {
  const actual = 456;
  const value = any(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 123
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

test('Any - custom value - root number - comparison passes with an float number', () => {
  const actual = 456.123;
  const value = any(123.123);
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: 123.123
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

test('Any - custom value - root string - comparison passes with an string', () => {
  const actual = "HelloWorld";
  const value = any("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: "123.123"
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

test('Any - custom value - root string - comparison passes with a object', () => {
  const actual = {
    name: "Pactumjs",
    repo: "pactum matchers"
  };
  const value = any("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: "123.123"
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

test('Any - custom value - root string - comparison passes with a symbol', () => {
  const actual = Symbol("abc");
  const value = any("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: "123.123"
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

test('Any - custom value - root string - comparison passes with null', () => {
  const actual = null;
  const value = any("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: "123.123"
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

test('Any - custom value - root string - comparison passes with undefined', () => {
  const actual = undefined;
  const value = any("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANY',
    value: "123.123"
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