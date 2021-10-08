const suite = require('uvu').suite;
const assert = require('assert');
const { like, eachLike, utils } = require('../src/index');
const { setMatchingRules } = utils;

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

test.run();