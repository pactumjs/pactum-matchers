const suite = require('uvu').suite;
const assert = require('assert');
const { uuid, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('SetMatchingRules - Regex');

test('uuid - default value - root string - comparison passes', () => {
  const actual = '83994085-2dde-4dc6-82a9-27fedf9e0c09';
  const value = uuid();
  assert.deepStrictEqual(value, {
    matcher: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$',
    pactum_type: 'REGEX',
    value: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$'
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
    matcher: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$',
    pactum_type: 'REGEX',
    value: '83994085-2dde-4dc6-82a9-27fedf9e0c09'
  });
  const rules = setMatchingRules({}, value, '$.body');
  assert.deepStrictEqual(rules, {
    '$.body': {
      match: 'regex',
      regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$'
    }
  });
  const expected = getValue(value);
  const { equal, message } = compare(actual, expected, rules, '$.body');
  assert.strictEqual(equal, false);
  assert.strictEqual(message, `Json doesn't match with "^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$" at "$.body" but found "83994085-2dde-4dc6-82a9-27fedf9e0c0"`);
});

test.run();