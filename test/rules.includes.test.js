const suite = require('uvu').suite;
const assert = require('assert');
const { includes, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Includes');

test('includes - root string - comparison passes', () => {
  const actual = 'add some sugar';
  const value = includes('some');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: 'some'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('includes - root string - comparison fails', () => {
  const actual = 'add more sugar';
  const value = includes('some');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: 'some'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "some" at "$.body" but found "add more sugar"`);
});

test('includes - prop in object - comparison passes', () => {
  const actual = {
    name: 'snow',
    age: 8
  };
  const value = {
    name: includes('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'regex',
      regex: 'snow'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('includes - prop in object - comparison fails', () => {
  const actual = {
    name: 'now',
    age: 8
  };
  const value = {
    name: includes('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'regex',
      regex: 'snow'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "snow" at "$.body.name" but found "now"`);
});

test.run();