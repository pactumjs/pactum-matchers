const suite = require('uvu').suite;
const assert = require('assert');
const { float, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');
const FLOAT_MATCHER = "^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$";

test('float - default value - root float number - comparison passes', () => {
  const actual = 564.321;
  const value = float();
  assert.deepStrictEqual(value, {
    matcher: FLOAT_MATCHER,
    pactum_type: 'REGEX',
    value: 123.456
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: FLOAT_MATCHER
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});


test('float - custom value - root integer number - comparison passes', () => {
  const actual = 123;
  const value = float();
  assert.deepStrictEqual(value, {
    matcher: FLOAT_MATCHER,
    pactum_type: 'REGEX',
    value: 123.456
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: FLOAT_MATCHER
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message,'');
});

test('float - custom value - root number as a string - comparison passes', () => {
  const actual = "123.45" ;
  const value = float();
  assert.deepStrictEqual(value, {
    matcher: FLOAT_MATCHER,
    pactum_type: 'REGEX',
    value: 123.456
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: FLOAT_MATCHER
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message,'');
});


test('float - custom value - root string value - comparison fails', () => {
  const actual = "String";
  const value = float();
  assert.deepStrictEqual(value, {
    matcher: FLOAT_MATCHER,
    pactum_type: 'REGEX',
    value: 123.456
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: FLOAT_MATCHER
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "${FLOAT_MATCHER}" at "$.body" but found "String"`);
});

test.run();