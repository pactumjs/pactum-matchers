const suite = require('uvu').suite;
const assert = require('assert');
const { email, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('email - default value - root string - comparison passes', () => {
  const actual = 'hello@pactum.js';
  const value = email();
  assert.deepStrictEqual(value, {
    pactum_type: 'EMAIL',
    value: 'hello@pactum.js'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'email'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('email - custom value - root string - comparison fails', () => {
  const actual = 'hello@pactum';
  const value = email('some@gmail.com');
  assert.deepStrictEqual(value, {
    pactum_type: 'EMAIL',
    value: 'some@gmail.com'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'email'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "EMAIL" pattern at "$.body" but found "hello@pactum"`);
});

test('email - prop in object - comparison passes', () => {
  const actual = {
    name: 'danny@summer.com',
    age: 8
  };
  const value = {
    name: email('snow@winter.com'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'email'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, ``);
});

test('includes - prop in object - comparison fails', () => {
  const actual = {
    name: 'danny@summer',
    age: 8
  };
  const value = {
    name: email('snow@winter.com'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'email'
    }
  });
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "EMAIL" pattern at "$.body.name" but found "danny@summer"`);
});

test.run();