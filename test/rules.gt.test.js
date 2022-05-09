const suite = require('uvu').suite;
const assert = require('assert');
const { gt, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - gt');

test('Gt - custom value - root number - comparison passes with greater integer number', () => {
  const actual = 146;
  const value = gt(123);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Gt - custom value - root number - comparison fails with lesser integer number', () => {
  const actual = 123;
  const value = gt(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'greater' value than '369' at '$.body' but found '${actual}'`);
});

test('Gt - custom value - root number - comparison passes with greater float number', () => {
  const actual = 531.0135;
  const value = gt(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Gt - custom value - root number - comparison fails with lesser float number', () => {
  const actual = 321.0135;
  const value = gt(369.08);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 369.08
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'greater' value than '369.08' at '$.body' but found '${actual}'`);
});

test('Gt - custom value - root number - comparison fails with empty string', () => {
  const actual = '';
  const value = gt(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test('Gt - custom value - root number - comparison fails with string', () => {
  const actual = "Test";
  const value = gt(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test('Gt - custom value - root number - comparison fails with string of numbers', () => {
  const actual = "1234";
  const value = gt(1357);
  assert.deepStrictEqual(value, {
    pactum_type: 'GT',
    value: 1357
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'gt'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found 'string'`);
});

test.run();