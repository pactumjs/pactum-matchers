const suite = require('uvu').suite;
const assert = require('assert');
const { float, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');
const FLOAT_MATCHER = "^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$";

test('float - default value - root float - comparison passes', () => {
  const actual = 456.123;
  const value = float();
  assert.deepStrictEqual(value, {
    pactum_type: 'FLOAT',
    value: 123.456
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'float'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('float - custom value - root integer - comparison passes', () => {
  const actual = 4567;
  const value = float(1234);
  assert.deepStrictEqual(value, {
    pactum_type: 'FLOAT',
    value: 1234
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'float'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message,'');
});

test('float - custom value - root number as a string - comparison passes', () => {
  const actual = "123.456" ;
  const value = float(456.12);
  assert.deepStrictEqual(value, {
    pactum_type: 'FLOAT',
    value: 456.12
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'float',
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message,'');
});


test('float - custom value - root string - comparison fails', () => {
  const actual = "String";
  const value = float(456.12);
  assert.deepStrictEqual(value, {
    pactum_type: 'FLOAT',
    value: 456.12
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'float'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "FLOAT" pattern at "$.body" but found "${actual}"`);
});

test.run();