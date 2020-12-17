const suite = require('uvu').suite;
const assert = require('assert');
const { expression, utils } = require('../src/index');
const { setMatchingRules } = utils;

const test = suite('SetMatchingRules - Expression');

test('expression - root string', () => {
  const value = expression('UI', '$V === "UI"');
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'expr', expr: '$V === "UI"' }
  });
});

test('expression - prop in object', () => {
  const value = {
    name: expression('UI', '$V === "UI"'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'expr', expr: '$V === "UI"' }
  });
});

test('expression - multiple prop in nested objects', () => {
  const value = {
    name: expression('UI', '$V === "UI"'),
    age: 8,
    address: {
      city: 'North',
      pin: expression(123, '$V === 123')
    }
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'expr', expr: '$V === "UI"' },
    '$.body.address.pin': { match: 'expr', expr: '$V === 123' }
  });
});

test.run();