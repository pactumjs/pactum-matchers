const suite = require('uvu').suite;
const assert = require('assert');
const { regex, utils } = require('../src/index');
const { setMatchingRules } = utils;

const test = suite('SetMatchingRules - Regex');

test('regex - root string', () => {
  const value = regex('some string', /\w+/);
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: '\\w+'
    }
  });
});

test('regex - prop in object', () => {
  const value = {
    name: regex('snow', /\w+/),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'regex',
      regex: '\\w+'
    }
  });
});

test('regex - multiple prop in nested objects', () => {
  const value = {
    name: regex('snow', /\w+/),
    age: 8,
    address: {
      city: 'North',
      pin: regex(234512, /\d+/)
    }
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': {
      match: 'regex',
      regex: '\\w+'
    },
    '$.body.address.pin': {
      match: 'regex',
      regex: '\\d+'
    }
  });
});

test.run();