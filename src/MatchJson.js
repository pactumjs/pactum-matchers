class MatchJson {

  constructor(rules) {
    this.rules = rules;
  }

  compare(actual, expected, actualPath, expectedPath) {
    const matchingPath = actualPath.replace(/\[\d+\]/g, '[*]');
    const matchingRule = this.matchingRules[matchingPath];
    if (matchingRule) {
      const match = matchingRule.match;
      const min = matchingRule.min;
      if (match === 'type') {

      }
    } else {
      const valueRes = this.valueCompare(actual, expected, actualPath, expectedPath);
      if (valueRes !== null) {
        return valueRes;
      }
      if (Array.isArray(expected)) {
        const arrRes = this.arrayCompare(actual, expected, actualPath, expectedPath);
        if (arrRes) {
          return arrRes;
        }
      } else {
        const objRes = this.objectCompare(actual, expected, actualPath, expectedPath);
        if (objRes) {
          return objRes;
        }
      }
      return '';
    }
  }

  typeCompare(actual, expected, actualPath, expectedPath) {
    if (typeof actual !== typeof expected) {
      return `Json doesn't have type '${typeof expected}' at '${expectedPath}' but found '${typeof actual}'`;
    }
    if (Array.isArray(expected) && !Array.isArray(actual)) {
      return `Json doesn't have type 'array' at '${expectedPath}' but found 'object'`;
    }
    if (!Array.isArray(expected) && Array.isArray(actual)) {
      return `Json doesn't have type 'object' at '${expectedPath}' but found 'array'`;
    }
  }

  valueCompare(actual, expected, actualPath, expectedPath) {
    if (actual === expected) {
      return '';
    }
    if (expected instanceof RegExp) {
      if (expected.test(actual)) {
        return '';
      }
      return `Json doesn't match with '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    const typeResp = this.typeCompare(actual, expected, actualPath, expectedPath);
    if (typeResp) {
      return typeResp;
    }
    if (typeof expected !== 'object' && typeof actual !== 'object') {
      return `Json doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (expected === null || actual === null) {
      return `Json doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    return null;
  }

  arrayCompare(actual, expected, actualPath, expectedPath) {
    if (actual.length !== expected.length) {
      return `Json doesn't have 'array' with length '${expected.length}' at '${expectedPath}' but found 'array' with length '${actual.length}'`;
    }
    for (let i = 0; i < expected.length; i++) {
      const newActualPath = `${actualPath}[${i}]`;
      const resp = this.compare(actual[i], expected[i], newActualPath);
      if (resp) {
        return resp;
      }
    }
  }

  objectCompare(actual, expected, actualPath, expectedPath) {
    for (const prop in expected) {
      if (!Object.prototype.hasOwnProperty.call(expected, prop)) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
        return `Json doesn't have property '${prop}' at '${expectedPath}'`;
      }
      const newPath = expectedPath + '.' + prop;
      const resp = this.compare(actual[prop], expected[prop], newPath, newPath);
      if (resp) {
        return resp;
      }
    }
  }

  typeMatch(actual, expected, actualPath, expectedPath) {
    const typeResp = this.typeCompare(actual, expected, actualPath, expectedPath);
    if (typeResp) {
      return typeResp;
    }
    if (Array.isArray(expected)) {
      const arrResp = this.arrayCompare(actual, expected, actualPath, expectedPath);
      if (arrResp) {
        return arrResp;
      }
    } else if (typeof expected === 'object') {
    } else {
    }
  }

}

module.exports = MatchJson;