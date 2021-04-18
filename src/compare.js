const { isPrimitive, getType } = require('./helpers');
const patterns = require('./patterns');

function compare(actual, expected, rules, path) {
  const rule = getCurrentPathRule(rules, path);
  if (rule) {
    compareWithRule(actual, expected, rules, path, rule);
  } else {
    typeCompare(actual, expected, path);
    arrayCompare(actual, expected, rules, path);
    objectCompare(actual, expected, rules, path);
    valueCompare(actual, expected, path);
  }
  return '';
}

function getCurrentPathRule(rules, path) {
  if (rules[path]) return rules[path];
  let dotIndex = path.lastIndexOf('.');
  const allPropsPath = `${path.slice(0, dotIndex)}.*`;
  if (rules[allPropsPath]) return rules[allPropsPath];
  const genericPath = path.replace(/\[\d+\]/g, '[*]');
  dotIndex = genericPath.lastIndexOf('.');
  const allPropsGenericPath = `${genericPath.slice(0, dotIndex)}.*`;
  if (rules[allPropsGenericPath]) return rules[allPropsGenericPath];
  return rules[genericPath];
}

function compareWithRule(actual, expected, rules, path, rule) {
  switch (rule.match) {
    case 'type':
      compareWithRuleType(actual, expected, rules, path);
      break;
    case 'regex':
      compareWithRuleRegex(actual, rule, path);
      break;
    case 'oneOf':
      compareWithRuleOneOf(actual, rule, path);
      break;
    case 'expr':
      compareWithRuleExpr(actual, rule, path);
      break;
    case 'string':
      compareWithString(actual, rule, path);
      break;
    case 'uuid':
      compareWithUUID(actual, rule, path);
      break;
    case 'email':
      compareWithEmail(actual, rule, path);
      break;
  }
}

function compareWithRuleType(actual, expected, rules, path) {
  typeCompare(actual, expected, path);
  const type = getType(expected);
  if (type === 'array') {
    const expectedItem = expected[0];
    if (actual.length === 0) throw `Json has an empty 'array' at '${path}'`;
    for (let i = 0; i < actual.length; i++) {
      compare(actual[i], expectedItem, rules, `${path}[${i}]`);
    }
  } else if (type === 'object') {
    objectCompare(actual, expected, rules, path);
  }
}

function compareWithRuleRegex(actual, rule, path) {
  const regex = new RegExp(rule.regex);
  if (!regex.test(actual)) {
    throw `Json doesn't match with "${rule.regex}" at "${path}" but found "${actual}"`;
  }
}

function compareWithRuleOneOf(actual, rule, path) {
  const values = rule.value;
  let found = false;
  for (let i = 0; i < values.length; i++) {
    found = actual === values[i];
    if (found) break;
  }
  if (!found) {
    throw `Json doesn't have one of the expected values at "${path}" but found "${actual}"`;
  }
}

function compareWithRuleExpr(actual, rule, path) {
  const expr = rule.expr;
  const expression = expr.replace('$V', 'actual');
  if (eval(expression) !== true) {
    throw `Json doesn't fulfil expression '${expression.replace('actual', path).trim()}'`;
  }
}

function compareWithString(actual, rule, path) {
  const type = getType(actual);
  if (type !== 'string') {
    throw `Json doesn't have type 'string' at '${path}' but found '${type}'`;
  }
  if (actual.length === 0) {
    throw `Json have an empty string at '${path}'`;
  }
}

function compareWithUUID(actual, rule, path) {
  const pattern = patterns.UUID;
  if (!pattern.test(actual)) {
    throw `Json doesn't match with "UUID" pattern at "${path}" but found "${actual}"`;
  }
}

function compareWithEmail(actual, rule, path) {
  const pattern = patterns.EMAIL;
  if (!pattern.test(actual)) {
    throw `Json doesn't match with "EMAIL" pattern at "${path}" but found "${actual}"`;
  }
}

function typeCompare(actual, expected, path) {
  const actualType = getType(actual);
  const expectedType = getType(expected);
  if (actualType !== expectedType) {
    throw `Json doesn't have type '${expectedType}' at '${path}' but found '${actualType}'`;
  }
}

function arrayCompare(actual, expected, rules, path) {
  if (getType(expected) === 'array') {
    if (actual.length !== expected.length) {
      throw `Json doesn't have 'array' with length '${expected.length}' at '${path}' but found 'array' with length '${actual.length}'`;
    }
    for (let i = 0; i < expected.length; i++) {
      compare(actual[i], expected[i], rules, `${path}[${i}]`);
    }
  }
}

function objectCompare(actual, expected, rules, path) {
  if (getType(expected) === 'object') {
    for (const prop in expected) {
      if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
        throw `Json doesn't have property '${prop}' at '${path}'`;
      }
      compare(actual[prop], expected[prop], rules, `${path}.${prop}`);
    }
  }
}

function valueCompare(actual, expected, path) {
  if (isPrimitive(expected)) {
    if (actual !== expected) throw `Json doesn't have value '${expected}' at '${path}' but found '${actual}'`;
  }
}

module.exports = {
  compare
};