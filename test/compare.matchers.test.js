const suite = require('uvu').suite;
const assert = require('uvu/assert');
const { like, eachLike, regex, oneOf, expression, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('Compare With Matchers');

test('like - root string', () => {
  const actual = 'null';
  const value = like('some string');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('like - root object', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = like({
    name: 'snow',
    age: 18
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('like - root object - extra prop in expected', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = like({
    name: 'snow',
    age: 18,
    house: 'stark'
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have property 'house' at '$.body'`);
});

test('like - root object - extra prop in actual', () => {
  const actual = {
    name: 'jon',
    age: 8,
    house: 'stark'
  };
  const value = like({
    name: 'snow',
    age: 18
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, ``);
});

test('like - prop object', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = {
    name: like('snow'),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('like - prop object different type', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = {
    name: like({ first: 'jon', last: 'snow' }),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'object' at '$.body.name' but found 'string'`);
});

test('like - prop object in array', () => {
  const actual = ['node', '-v', 823];
  const value = ['node', '-v', like(1)];
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, ``);
});

test('like - prop object in array different type', () => {
  const actual = ['node', '-v', 823];
  const value = ['node', '-v', like('1')];
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'string' at '$.body[2]' but found 'number'`);
});

test('like - prop object in array inside nested object', () => {
  const actual = {
    cmd: ['node', '-v', 823]
  };
  const value = {
    cmd: ['node', '-v', like(1)]
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, ``);
});

test('like - prop object in array inside nested object', () => {
  const actual = {
    cmd: ['node', '-v', 823]
  };
  const value = {
    cmd: ['node', '-v', like('1')]
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'string' at '$.body.cmd[2]' but found 'number'`);
});

test('eachLike - root string', () => {
  const actual = ['null'];
  const value = eachLike('some string');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('eachLike - root string - empty actual', () => {
  const actual = [];
  const value = eachLike('some string');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json has an empty 'array' at '$.body'`);
});

test('eachLike - root object', () => {
  const actual = [
    {
      name: 'jon',
      age: 8
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: 18
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('eachLike - root object - one object fails', () => {
  const actual = [
    {
      name: 'jon',
      age: 8
    },
    {
      name: null,
      age: 8
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: 18
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'string' at '$.body[1].name' but found 'null'`);
});

test('eachLike - extra prop in nested object', () => {
  const actual = [
    {
      name: 'jon',
      age: 8,
      address: [
        {
          city: 'SEC',
          pin: 233
        },
        {
          city: 'RO',
          pin: 123
        }
      ]
    },
    {
      name: 'snow',
      age: 20,
      address: [
        {
          city: 'NLR',
          pin: 123
        },
        {
          city: 'HYD'
        }
      ]
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: 18,
    address: eachLike({
      city: 'HYD',
      pin: 2345
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have property 'pin' at '$.body[1].address[1]'`);
});

test('regex - root string', () => {
  const actual = 'null';
  const value = regex('some string', /\w+/);
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('regex - root string does not match', () => {
  const actual = 98;
  const value = regex('some string', /\D+/);
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't match with "\\D+" at "$.body" but found "98"`);
});

test('regex - prop object', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = {
    name: regex('snow', /\w+/),
    age: 8
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('oneOf - root string', () => {
  const actual = 'API';
  const value = oneOf(['UI', 'API']);
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('oneOf - root string fails', () => {
  const actual = 'AP';
  const value = oneOf(['UI', 'API']);
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have one of the expected values at "$.body" but found "AP"`);
});

test('expr - prop object', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = {
    name: 'jon',
    age: expression(9, '$V > 0')
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('expr - prop object fails', () => {
  const actual = {
    name: 'jon',
    age: 8
  };
  const value = {
    name: 'jon',
    age: expression(9, '$V > 10')
  };
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't fulfil expression '$.body.age > 10'`);
});

test.run();