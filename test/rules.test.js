const suite = require('uvu').suite;
const assert = require('assert');
const { like, eachLike, gt, any, utils: { setMatchingRules } } = require('../src/index');

const test = suite('SetMatchingRules - Complex');

test('like and eachLike with multiple values', () => {
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
  const rules = setMatchingRules({}, input, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 2 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' },
    '$.body[*].t2': { match: 'type' },
    '$.body[*].t2.*': { match: 'type' }
  });
});

test('like - nested rules', () => {
  const input = like({
    name: 'john',
    age: gt(18),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  });
  const rules = setMatchingRules({}, input, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type' },
    '$.body.*': { match: 'type' },
    '$.body.age': { match: 'gt' },
    '$.body.address': { match: 'type' },
    '$.body.address.*': { match: 'type' },
    '$.body.address.zip': { match: 'any' }
  });
});

test('eachLike - nested rules', () => {
  const input = eachLike({
    name: 'john',
    age: gt(18),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  });
  const rules = setMatchingRules({}, input, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 1 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' },
    '$.body[*].age': { match: 'gt' },
    '$.body[*].address': { match: 'type' },
    '$.body[*].address.*': { match: 'type' },
    '$.body[*].address.zip': { match: 'any' }
  });
});

test('eachLike with multiple items - nested rules', () => {
  const input = eachLike({
    name: 'john',
    age: gt(18),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  }, { items: [ 
    {
      name: 'snow',
      age: 123,
      address: {
        line: 'north',
        zip: null
      }
    },
    {
      name: 'sand',
      age: 22,
      address: {
        line: 'south',
        zip: '432'
      }
    }
  ]});
  const rules = setMatchingRules({}, input, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': { match: 'type', min: 1 },
    '$.body[*]': { match: 'type' },
    '$.body[*].*': { match: 'type' },
    '$.body[*].age': { match: 'gt' },
    '$.body[*].address': { match: 'type' },
    '$.body[*].address.*': { match: 'type' },
    '$.body[*].address.zip': { match: 'any' }
  });
});

test.run();