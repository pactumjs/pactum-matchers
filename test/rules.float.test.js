const suite = require('uvu').suite;
const assert = require('assert');
const { float, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Float');

test('Float - default value - root number - comparison passes', () => {
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

test('Float - custom value - root number - comparison passes', () => {
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

test('Float - custom value - root number - comparison passes with negative float', () => {
  const actual = - 456.123;
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

test('Float - custom value - root number - comparison fails with an integer number', () => {
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
  assert.strictEqual(equal, false);
  assert.strictEqual(message,`Json doesn't have 'float' number at '$.body' but found '${actual}'`);
});

test('Float - custom value - root number - comparison fails with a number string', () => {
  const actual = '123.456' ;
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
  const type = typeof(actual);
  assert.strictEqual(equal, false);
  assert.strictEqual(message,`Json doesn't have type 'number' at '$.body' but found '${type}'`);
});


test('Float - custom value - root number - comparison fails with a string', () => {
  const actual = 'String';
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
  const type = typeof(actual);
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'number' at '$.body' but found '${type}'`);
});

test.run();