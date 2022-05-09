const suite = require('uvu').suite;
const assert = require('assert');
const { notHaveProperty, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - nhp');

test('nhp - json has the property', () => {
  const actual = { a: 1 };
  const value = notHaveProperty('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NHP',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'nhp'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json has a property of "a" at "$.body"`);
});

test('nhp - json does not have the property', () => {
  const actual = { b: 1 };
  const value = notHaveProperty('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NHP',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'nhp'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('nhp - array', () => {
  const actual = [];
  const value = notHaveProperty('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NHP',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'nhp'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have a "object" at "$.body"`);
});

test('nhp - json does not the property in nested object', () => {
  const actual = {
    name: { first: '', last: '' },
    age: 8
  };
  const value = {
    name: notHaveProperty('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'nhp'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('nhp - json has property in nested object', () => {
  const actual = {
    name: { first: '', last: '' },
    age: 8
  };
  const value = {
    name: notHaveProperty('last'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'nhp'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json has a property of "last" at "$.body.name"`);
});

test.run();