const suite = require('uvu').suite;
const assert = require('assert');
const { lt, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('Lt - custom value - root number - comparison passes with lesser integer number', () => {
  const actual = 100;
  const value = lt(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lt - custom value - root number - comparison fails with greater integer number', () => {
  const actual = 399;
  const value = lt(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'lesser' value than '369' at '$.body' but found '${actual}'`);
});

test('Lt - custom value - root number - comparison passes with lesser float number', () => {
  const actual = 231.0135;
  const value = lt(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lt - custom value - root number - comparison fails with greater float number', () => {
  const actual = 391.0135;
  const value = lt(369.08);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 369.08
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'lesser' value than '369.08' at '$.body' but found '${actual}'`);
});

test('Lt - custom value - root number - comparison fails with empty string', () => {
  const actual = '';
  const value = lt(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test('lt - custom value - root number - comparison fails with string', () => {
  const actual = "Test";
  const value = lt(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test('lt - custom value - root number - comparison fails with string of numbers', () => {
  const actual = "1234";
  const value = lt(1357);
  assert.deepStrictEqual(value, {
    pactum_type: 'LT',
    value: 1357
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test.run();