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
      items: [
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

test('eachLike - multiple values', () => {
  const input = eachLike('some string', { min: 2, items: ['API', 'UI'] });
  const actual = getValue(input);
  const expected = ['API', 'UI'];
  assert.deepStrictEqual(actual, expected);
});

test('eachLike - multiple values with nested matchers', () => {
  const input = eachLike({
    t1: 'v1',
    t2: like({
      t3: 'v3'
    })
  }, {
    min: 2,
    items: [
      {
        t1: 'v1',
        t2: {
          t3: 'v3'
        }
      },
      {
        t1: 'v4',
        t2: {
          t3: 'v5'
        }
      }
    ]
  });
  const actual = getValue(input);
  const expected = [
    {
      t1: 'v1',
      t2: {
        t3: 'v3'
      }
    },
    {
      t1: 'v4',
      t2: {
        t3: 'v5'
      }
    }
  ];
  assert.deepStrictEqual(actual, expected);
});

test('regex', () => {
  const value = getValue(regex('a', /\w+/));
  assert.deepStrictEqual(value, 'a');
});

test('regex default', () => {
  const value = getValue(regex(/\w+/));
  assert.deepStrictEqual(value, 'regex');
});

test.run();