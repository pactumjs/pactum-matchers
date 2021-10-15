const suite = require('uvu').suite;
const assert = require('assert');
const { anyType, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('AnyType - custom value - root number - comparison passes with an interger number', () => {
  const actual = 456;
  const value = anyType(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root number - comparison passes with an float number', () => {
  const actual = 456.123;
  const value = anyType(123.123);
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: 123.123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root string - comparison passes with an string', () => {
  const actual = "HelloWorld";
  const value = anyType("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: "123.123"
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root string - comparison passes with a object', () => {
  const actual = {
    name: "Pactumjs",
    repo: "pactum matchers"
  };
  const value = anyType("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: "123.123"
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root string - comparison passes with a symbol', () => {
  const actual = Symbol("abc");
  const value = anyType("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: "123.123"
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root string - comparison passes with null', () => {
  const actual = null;
  const value = anyType("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: "123.123"
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('AnyType - custom value - root string - comparison passes with undefined', () => {
  const actual = undefined;
  const value = anyType("123.123");
  assert.deepStrictEqual(value, {
    pactum_type: 'ANYTYPE',
    value: "123.123"
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'anyType'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test.run();