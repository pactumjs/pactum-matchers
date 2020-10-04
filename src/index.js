const MatchJson = require('./MatchJson');

const matchers = {

  like(value) {
    return like(value);
  },

  somethingLike(value) {
    return like(value);
  },

  term(options) {
    return term(options);
  },

  regex(options) {
    return term(options);
  },

  eachLike(content, options) {
    let min = 1;
    if (options && typeof options.min === 'number') {
      min = options.min;
    }
    const data = [];
    for (let i = 0; i < min; i++) {
      data[i] = content;
    }
    return {
      contents: content,
      value: data,
      json_class: "Pact::ArrayLike",
      min,
    };
  },

  contains(value) {
    const options = {
      generate: value,
      matcher: value
    };
    return term(options);
  },

  validate(actual, expected, matchingRules, rootPath = '$.body') {
    const v = new MatchJson(matchingRules);
    return v.compare(actual, expected, rootPath);
  }

}

function like(value) {
  return {
    contents: value,
    value,
    json_class: "Pact::SomethingLike"
  };
}

function term(options) {
  if (!(typeof options === 'object' || typeof options === 'string') || options === null) {
    throw new Error('`options` are required');
  }
  if (typeof options === 'string') {
    const matcher = options;
    let isValid = true;
    try {
      new RegExp(matcher);
    } catch (error) {
      isValid = false;
    }
    if (!isValid) {
      throw new Error('Invalid regex matching options');
    }
    options = {
      generate: '',
      matcher
    };
  } else if (options instanceof RegExp) {
    const matcher = options.source;
    options = {
      generate: '',
      matcher
    };
  } else {
    if (typeof options.matcher === 'object') {
      options.matcher = options.matcher.source;
    }
  }
  const { generate, matcher } = options;
  return {
    data: {
      generate,
      matcher: {
        json_class: "Regexp",
        o: 0,
        s: matcher,
      },
    },
    value: generate,
    json_class: "Pact::Term"
  };
}

module.exports = matchers;