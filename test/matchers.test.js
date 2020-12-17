const suite = require('uvu').suite;
const assert = require('assert');
const { like, eachLike, oneOf, expression, regex } = require('../src/index');

const test = suite('Matchers');

test('like', () => {
  const value = like('some string');
  assert.deepStrictEqual(value, {
    pactum_type: 'LIKE',
    value: 'some string'
  });
});

test('eachLike', () => {
  const value = eachLike('some string');
  assert.deepStrictEqual(value, {
    pactum_type: 'ARRAY_LIKE',
    value: ['some string'],
    min: 1
  });
});

test('eachLike - multiple values', () => {
  const value = eachLike('some string', { min: 2, value: ['API', 'UI'] });
  assert.deepStrictEqual(value, {
    pactum_type: 'ARRAY_LIKE',
    value: ['API', 'UI'],
    min: 2
  });
});

test('oneOf', () => {
  const value = oneOf(['API', 'UI']);
  assert.deepStrictEqual(value, {
    pactum_type: 'ONE_OF',
    value: ['API', 'UI']
  });
});

test('expression', () => {
  const value = expression(3, '$V > 0');
  assert.deepStrictEqual(value, {
    pactum_type: 'EXPR',
    value: 3,
    expr: '$V > 0'
  });
});

test('regex', () => {
  const value = regex(3, /\w+/);
  assert.deepStrictEqual(value, {
    pactum_type: 'REGEX',
    value: 3,
    matcher: '\\w+'
  });
});

test('regex with string', () => {
  const value = regex(3, '\\w+');
  assert.deepStrictEqual(value, {
    pactum_type: 'REGEX',
    value: 3,
    matcher: '\\w+'
  });
});


test.run();