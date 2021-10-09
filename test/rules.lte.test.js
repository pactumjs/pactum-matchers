const suite = require('uvu').suite;
const assert = require('assert');
const { lte, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('Lte - custom value - root number - comparison passes with lesser integer number', () => {
  const actual = 100;
  const value = lte(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lte - custom value - root number - comparison passes with equal integer number', () => {
  const actual = 123;
  const value = lte(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lte - custom value - root number - comparison fails with greater integer number', () => {
  const actual = 484;
  const value = lte(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'lesser or equal' value at '$.body' but found '${actual}'`);
});

test('Lte - custom value - root number - comparison passes with lesser float number', () => {
  const actual = 123.0135;
  const value = lte(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lte - custom value - root number - comparison passes with equal float number', () => {
  const actual = 531.0135;
  const value = lte(531.0135);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 531.0135
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Lte - custom value - root number - comparison fails with greater float number', () => {
  const actual = 999.999;
  const value = lte(369.08);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 369.08
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'lesser or equal' value at '$.body' but found '${actual}'`);
});

test('Lte - custom value - root number - comparison fails with empty string', () => {
  const actual = '';
  const value = lte(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found 'string'`);
});

test('Lte - custom value - root number - comparison fails with string', () => {
  const actual = "Test";
  const value = lte(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found 'string'`);
});

test('Lte - custom value - root number - comparison fails with string of numbers', () => {
  const actual = "1234";
  const value = lte(1357);
  assert.deepStrictEqual(value, {
    pactum_type: 'LTE',
    value: 1357
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'lte'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found 'string'`);
});

test.run();