const suite = require('uvu').suite;
const assert = require('assert');
const { uuid, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - uuid');

test('uuid - default value - root string - comparison passes', () => {
  const actual = '83994085-2dde-4dc6-82a9-27fedf9e0c09';
  const value = uuid();
  assert.deepStrictEqual(value, {
    pactum_type: 'UUID',
    value: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'uuid'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, true);
  assert.strictEqual(message, '');
});

test('uuid - custom value - root string - comparison fails', () => {
  const actual = '83994085-2dde-4dc6-82a9-27fedf9e0c0';
  const value = uuid('83994085-2dde-4dc6-82a9-27fedf9e0c09');
  assert.deepStrictEqual(value, {
    pactum_type: 'UUID',
    value: '83994085-2dde-4dc6-82a9-27fedf9e0c09'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'uuid'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "UUID" pattern at "$.body" but found "83994085-2dde-4dc6-82a9-27fedf9e0c0"`);
});

test.run();