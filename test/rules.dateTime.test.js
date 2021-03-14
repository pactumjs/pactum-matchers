const suite = require('uvu').suite;
const assert = require('assert');
const {  dateTime, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test(' dateTime - default value - root string - comparison passes', () => {
  const actual = '2021-03-14T06:34:25+00:00';
  const value =  dateTime();
  assert.deepStrictEqual(value, {
    matcher: '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$',
    pactum_type: 'REGEX',
    value: '2020-12-12T16:53:10+01:00'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test(' dateTime - default value - root string - comparison passes', () => {
  const actual = '2021-13-14T06:34:25+0000';
  const value =  dateTime('2021-03-14T06:34:25+0000');
  assert.deepStrictEqual(value, {
    matcher: '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$',
    pactum_type: 'REGEX',
    value: '2021-03-14T06:34:25+0000'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$" at "$.body" but found "2021-13-14T06:34:25+0000"`);
});

test.run();