const suite = require('uvu').suite;
const assert = require('assert');

const { like, eachLike, oneOf, expression, regex, utils } = require('../src/index');
const { getValue } = utils;

const test = suite('Value');

test('null', () => {
  const value = getValue(null);
  assert.deepStrictEqual(value, null);
});

test('like - root null', () => {
  const value = getValue(like(null));
  assert.deepStrictEqual(value, null);
});

test('like - root string', () => {
  const value = getValue(like('str'));
  assert.deepStrictEqual(value, 'str');
});

test('object - root like', () => {
  const value = getValue(like({
    name: 'jon',
    age: 8,
    address: eachLike({
      city: 'Winter',
      pin: 524,
      state: regex('AD', /\w+/)
    })
  }));
  assert.deepStrictEqual(value, {
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'Winter',
        pin: 524,
        state: 'AD'
      }
    ]
  });
});

test('object - eachLike multiple value', () => {
  const value = getValue(like({
    name: 'jon',
    age: 8,
    address: eachLike({
      city: 'Winter',
      pin: 524,
      state: regex('AD', /\w+/)
    }, {
      value: [
        {
          city: 'Winter',
          pin: 524,
          state: 'AD'
        },
        {
          city: 'Stark',
          pin: 522,
          state: 'BD'
        }
      ]
    })
  }));
  assert.deepStrictEqual(value, {
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'Winter',
        pin: 524,
        state: 'AD'
      },
      {
        city: 'Stark',
        pin: 522,
        state: 'BD'
      }
    ]
  });
});

test('object - nested matchers', () => {
  const value = getValue({
    name: like('jon'),
    age: expression(8, '$V > 0'),
    house: oneOf(['stark', 'martel']),
    address: eachLike({
      city: 'Winter',
      pin: 524,
      state: regex('AD', /\w+/)
    })
  });
  assert.deepStrictEqual(value, {
    name: 'jon',
    age: 8,
    house: 'stark',
    address: [
      {
        city: 'Winter',
        pin: 524,
        state: 'AD'
      }
    ]
  });
});

test('empty array', () => {
  const value = getValue([]);
  assert.deepStrictEqual(value, []);
});

test('array of items', () => {
  const value = getValue([1, true, 'str', null, [like(1)]]);
  assert.deepStrictEqual(value, [1, true, 'str', null, [1]]);
});

test.run();