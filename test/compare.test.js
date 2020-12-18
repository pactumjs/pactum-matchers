const suite = require('uvu').suite;
const assert = require('uvu/assert');
const { utils } = require('../src/index');

const test = suite('Compare');

test('null & null', () => {
  const actual = null;
  const expected = null;
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, '');
});

test('null & string', () => {
  const actual = null;
  const expected = 'str';
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have type 'string' at '$.body' but found 'null'`);
});

test('null & object', () => {
  const actual = null;
  const expected = {};
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have type 'object' at '$.body' but found 'null'`);
});

test('null & array', () => {
  const actual = null;
  const expected = [{}];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have type 'array' at '$.body' but found 'null'`);
});

test('string & null', () => {
  const actual = 'str';
  const expected = null;
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have type 'null' at '$.body' but found 'string'`);
});

test('empty object & empty object', () => {
  const actual = {};
  const expected = {};
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, ``);
});

test('object & empty object', () => {
  const actual = { name: 'jon' };
  const expected = {};
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, ``);
});

test('empty object & object', () => {
  const actual = {};
  const expected = { name: 'jon' };
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have property 'name' at '$.body'`);
});

test('objects with different properties', () => {
  const actual = { name: 'snow' };
  const expected = { name: 'jon' };
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have value 'jon' at '$.body.name' but found 'snow'`);
});

test('array of objects with different properties', () => {
  const actual = [{ name: 'snow' }];
  const expected = [{ name: 'jon' }];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have value 'jon' at '$.body[0].name' but found 'snow'`);
});

test('array of objects with extra properties', () => {
  const actual = [{ name: 'jon', age: 8 }];
  const expected = [{ name: 'jon' }];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, ``);
});

test('array of objects with extra properties', () => {
  const actual = [{ name: 'jon' }];
  const expected = [{ name: 'jon', age: 8 }];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have property 'age' at '$.body[0]'`);
});

test('array of nested objects with extra properties', () => {
  const actual = [{ name: 'jon', address: [{ city: 'some' }] }];
  const expected = [{ name: 'jon', address: [{ city: 'some', pin: 123 }] }];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have property 'pin' at '$.body[0].address[0]'`);
});

test('array of nested objects with different lengths', () => {
  const actual = [{ name: 'jon', address: [{ city: 'some' }] }];
  const expected = [{ name: 'jon', address: [{ city: 'some' }, { city: 'other' }] }];
  const { message } = utils.compare(actual, expected, {}, '$.body');
  assert.equal(message, `Json doesn't have 'array' with length '2' at '$.body[0].address' but found 'array' with length '1'`);
});

test('array of objects with extra properties - strict', () => {
  const actual = [{ name: 'jon', age: 8 }];
  const expected = [{ name: 'jon' }];
  const { message } = utils.compare(actual, expected, {}, '$.body', true);
  assert.equal(message, `Json doesn't have property 'age' at '$.body[0]'`);
});

test.run();