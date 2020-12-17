const suite = require('uvu').suite;
const assert = require('assert');
const { eachLike, utils } = require('../src/index');
const { setMatchingRules } = utils;

const test = suite('SetMatchingRules - EachLike');

test('eachLike - root string', () => {
  const value = eachLike('some string');
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 1 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' }
  });
});

test('eachLike - root object', () => {
  const value = eachLike({
    name: 'snow',
    age: 8
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 1 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' }
  });
});

test('eachLike - nested object', () => {
  const value = {
    name: 'snow',
    age: 8,
    address: eachLike({
      city: 'NLR',
      pin: 121001
    })
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.address': { match: 'type', min: 1 },
    '$.body.address[*]': { match: 'type' },
    '$.body.address[*].*': { match: 'type' }
  });
});

test('eachLike - root object & nested object', () => {
  const value = eachLike({
    name: 'snow',
    age: 8,
    address: eachLike({
      city: 'NLR',
      pin: 121001
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 1 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' },
    '$.body[*].address': { match: 'type', min: 1 },
    '$.body[*].address[*]': { match: 'type' },
    '$.body[*].address[*].*': { match: 'type' }
  });
});

test('eachLike - only nested objects', () => {
  const value = [
    {
      name: 'snow',
      age: 8,
      address: eachLike({
        city: 'NLR',
        pin: 121001
      })
    },
    {
      name: 'jon',
      age: 8,
      address: eachLike({
        pin: 121001
      }, { min: 2 })
    }
  ];
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body[0].address': { match: 'type', min: 1 },
    '$.body[0].address[*]': { match: 'type' },
    '$.body[0].address[*].*': { match: 'type' },
    '$.body[1].address': { match: 'type', min: 2 },
    '$.body[1].address[*]': { match: 'type' },
    '$.body[1].address[*].*': { match: 'type' }
  });
});


test.run();