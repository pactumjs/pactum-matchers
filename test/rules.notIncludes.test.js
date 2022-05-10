const suite = require('uvu').suite;
const assert = require('assert');
const { notIncludes, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules -not includes');

test('not includes - json has the property', () => {
  const actual = { a: 1 };
  const value = notIncludes('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_INCLUDES',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
     match: 'not_includes'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json has a property of "a" at "$.body"`);
});

test('not includes - json does not have the property', () => {
  const actual = { b: 1 };
  const value = notIncludes('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_INCLUDES',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
     match: 'not_includes'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('not includes - array', () => {
  const actual = [];
  const value = notIncludes('a');
  assert.deepStrictEqual(value, {
    pactum_type: 'NOT_INCLUDES',
    value: 'a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
     match: 'not_includes'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have a "object" at "$.body"`);
});

test('not includes - json does not the property in nested object', () => {
  const actual = {
    name: { first: '', last: '' },
    age: 8
  };
  const value = {
    name: notIncludes('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
     match: 'not_includes'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('not includes - json has property in nested object', () => {
  const actual = {
    name: { first: '', last: '' },
    age: 8
  };
  const value = {
    name: notIncludes('last'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
     match: 'not_includes'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json has a property of "last" at "$.body.name"`);
});

test.run();