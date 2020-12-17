const suite = require('uvu').suite;
const assert = require('assert');
const { oneOf, utils } = require('../src/index');
const { setMatchingRules } = utils;

const test = suite('SetMatchingRules - OneOf');

test('oneOf - root string', () => {
  const value = oneOf(['UI', 'API']);
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'oneOf', value: ['UI', 'API'] }
  });
});

test('oneOf - prop in object', () => {
  const value = {
    name: oneOf(['UI', 'API']),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'oneOf', value: ['UI', 'API'] }
  });
});

test('oneOf - multiple prop in nested objects', () => {
  const value = {
    name: oneOf(['UI', 'API']),
    age: 8,
    address: {
      city: 'North',
      pin: oneOf([123, 456])
    }
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'oneOf', value: ['UI', 'API'] },
    '$.body.address.pin': { match: 'oneOf', value: [123, 456] }
  });
});

test.run();