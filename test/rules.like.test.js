const suite = require('uvu').suite;
const assert = require('assert');
const { like, utils } = require('../src/index');
const { setMatchingRules } = utils;

const test = suite('SetMatchingRules - Like');

test('like - root string', () => {
  const value = like('some string');
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type' }
  });
});

test('like - root object', () => {
  const value = like({
    name: 'snow',
    age: 8
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type' },
    '$.body.*': { match: 'type' }
  });
});

test('like - prop in object', () => {
  const value = {
    name: like('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'type' }
  });
});

test('like - multiple prop in nested objects', () => {
  const value = {
    name: like('snow'),
    age: 8,
    address: {
      city: 'North',
      pin: like(234512)
    }
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'type' },
    '$.body.address.pin': { match: 'type' }
  });
});

test('like - entire nested objects', () => {
  const value = {
    name: like('snow'),
    age: 8,
    address: like({
      city: 'North',
      pin: like(234512)
    })
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.name': { match: 'type' },
    '$.body.address': { match: 'type' },
    '$.body.address.*': { match: 'type' },
    '$.body.address.pin': { match: 'type' }
  });
});

test('like - root object & prop in nested object', () => {
  const value = like({
    name: 'snow',
    age: 8,
    address: {
      city: 'North',
      pin: like(234512)
    }
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type' },
    '$.body.*': { match: 'type' },
    '$.body.address.pin': { match: 'type' }
  });
});

test('like - item in array', () => {
  const value = {
    name: 'snow',
    age: 8,
    hobbies: ['chess', like('books')]
  };
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body.hobbies[1]': { match: 'type' }
  });
});

test.run();