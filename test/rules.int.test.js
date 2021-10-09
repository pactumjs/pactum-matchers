const suite = require('uvu').suite;
const assert = require('assert');
const { int, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('Int - default value - root number - comparison passes', () => {
  const actual = 457;
  const value = int();
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 123
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Int - custom value - root number - comparison passes', () => {
  const actual = 531;
  const value = int(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Int - custom value - root number - comparison passes with negative integer', () => {
  const actual = - 531;
  const value = int(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('Int - custom value - root number - comparison fails with float value', () => {
  const actual = 531.0135;
  const value = int(369);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 369
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have 'integer' number at '$.body' but found '${actual}'`);
});

test('Int - custom value - root number - comparison fails with an empty string', () => {
  const actual = '';
  const value = int(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  const type = typeof(actual);
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found '${type}'`);
});

test('Int - custom value - root number - comparison fails with a string', () => {
  const actual = 'Test';
  const value = int(248);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 248
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  const type = typeof(actual);
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found '${type}'`);
});

test('Int - custom value - root number - comparison fails with string of numbers', () => {
  const actual = '1234';
  const value = int(1357);
  assert.deepStrictEqual(value, {
    pactum_type: 'INT',
    value: 1357
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'int'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  const type = typeof(actual);
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't have type 'Number' at '$.body' but found '${type}'`);
});

test.run();