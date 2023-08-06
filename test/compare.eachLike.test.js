const suite = require('uvu').suite;
const assert = require('uvu/assert');
const { like, eachLike, gt, any, utils } = require('../src/index');
const { setMatchingRules, getValue, compare } = utils;

const test = suite('Compare With eachLike');

test('root string', () => {
  const actual = ['null'];
  const value = eachLike('some string');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('root string - empty actual', () => {
  const actual = [];
  const value = eachLike('some string');
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'array' with min length of '1' at '$.body' but found 'array' with length '0'`);
});

test('root object', () => {
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

test('root object - empty array in strict mode', () => {
  const actual = [];
  const value = eachLike({
    name: 'snow',
    age: 18
  }, {
    min: 0
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body', true);
  assert.equal(message, '');
});

test('root object - one object fails', () => {
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

test('extra prop in nested object', () => {
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

test('nested matchers - pass', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: {
      line: 'flat',
      zip: null
    }
  }];
  const value = eachLike({
    name: 'snow',
    age: gt(5),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('nested matchers - multiple values - pass', () => {
  const actual = [
    {
      name: 'sand',
      age: 7,
      address: {
        line: 'south',
        zip: '1456'
      }
    },
    {
      name: 'jon',
      age: 8,
      address: {
        line: 'flat',
        zip: null
      }
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: gt(5),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('nested matchers - fail at root', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: {
      line: 'flat',
      zip: null
    }
  }];
  const value = eachLike({
    name: 'snow',
    age: gt(10),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'greater' value than '10' at '$.body[0].age' but found '8'`);
});

test('nested matchers - fail at nested', () => {
  const actual = [
    {
      name: 'jon',
      age: 8,
      address: {
        line: 'flat',
        zip: 13
      }
    },
    {
      name: 'sand',
      age: 8,
      address: {
        line: 'south',
        zip: 3
      }
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: gt(7),
    address: like({
      line: 'flat',
      zip: gt(7)
    })
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'greater' value than '7' at '$.body[1].address.zip' but found '3'`);
});

test('nested, normal and nested matchers - pass', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: ['city']
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  }];
  const value = eachLike({
    name: 'snow',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: eachLike('city')
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('nested, normal and nested matchers - fail with array length', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: []
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  }];
  const value = eachLike({
    name: 'snow',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: eachLike('city')
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'array' with min length of '1' at '$.body[0].address[1].tags' but found 'array' with length '0'`);
});

test('nested, normal and nested matchers - fail with type', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: [1]
      }
    ]
  }];
  const value = eachLike({
    name: 'snow',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001,
        tags: eachLike('city')
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'string' at '$.body[0].address[2].tags[0]' but found 'number'`);
});

test('nested, normal and nested matchers - fail with extra expected item', () => {
  const actual = [{
    name: 'jon',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  }];
  const value = eachLike({
    name: 'snow',
    age: 8,
    address: [
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      },
      {
        city: 'NLR',
        pin: 121001
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'array' with length '4' at '$.body[0].address' but found 'array' with length '3'`);
});

test('nested matchers - multiple values using items - pass', () => {
  const actual = [
    {
      name: 'sand',
      age: 7,
      address: {
        line: 'south',
        zip: '1456'
      }
    },
    {
      name: 'jon',
      age: 8,
      address: {
        line: 'flat',
        zip: null
      }
    }
  ];
  const value = eachLike({
    name: 'snow',
    age: gt(5),
    address: like({
      line: 'flat',
      zip: any('123')
    })
  }, {
    items: [
      {
        name: 'sand',
        age: 5,
        address: {
          line: 'south',
          zip: '1456'
        }
      },
      {
        name: 'jon',
        age: 8,
        address: {
          line: 'flat',
          zip: null
        }
      },
      {
        name: 'sand',
        age: 7,
        address: {
          line: 'south',
          zip: '1456'
        }
      },
      {
        name: 'jon',
        age: 8,
        address: {
          line: 'flat',
          zip: null
        }
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('nested matchers - with no matcher in the middle layer - pass', () => {
  const actual = [
    {
      name: 'sand',
      rates: [
        {
          price: 1000,
          taxes: [
            {
              name: 'gst',
              price: 10
            }
          ]
        },
        {
          price: 500,
          taxes: [
            {
              name: 'sgst',
              price: 20
            }
          ]
        },
        {
          price: 1000,
          taxes: [
            {
              name: 'cgst',
              price: 30
            }
          ]
        }
      ]
    },
    {
      name: 'snow',
      rates: [
        {
          price: 200,
          taxes: [
            {
              name: 'gst',
              price: 1
            }
          ]
        },
        {
          price: 30,
          taxes: [
            {
              name: 'sgst',
              price: 2
            }
          ]
        },
        {
          price: 10,
          taxes: [
            {
              name: 'cgst',
              price: 3
            }
          ]
        }
      ]
    }
  ];
  const value = eachLike({
    name: 'snow',
    rates: [
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, '');
});

test('nested matchers - with no matcher in the middle layer - fail with type patching', () => {
  const actual = [
    {
      name: 'sand',
      rates: [
        {
          price: 1000,
          taxes: [
            {
              name: 'gst',
              price: 10
            }
          ]
        },
        {
          price: 500,
          taxes: [
            {
              name: 'sgst',
              price: 20
            }
          ]
        },
        {
          price: 1000,
          taxes: [
            {
              name: 'cgst',
              price: 30
            }
          ]
        }
      ]
    },
    {
      name: 'snow',
      rates: [
        {
          price: 200,
          taxes: [
            {
              name: 'gst',
              price: 1
            }
          ]
        },
        {
          price: 30,
          taxes: [
            {
              name: 'sgst',
              price: 2
            }
          ]
        },
        {
          price: 10,
          taxes: [
            {
              name: 'cgst',
              price: '3'
            }
          ]
        }
      ]
    }
  ];
  const value = eachLike({
    name: 'snow',
    rates: [
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have type 'number' at '$.body[1].rates[2].taxes[0].price' but found 'string'`);
});

test('nested matchers - with no matcher in the middle layer - pass with overriding matcher', () => {
  const actual = [
    {
      name: 'sand',
      rates: [
        {
          price: 1000,
          taxes: [
            {
              name: 'gst',
              price: 10
            }
          ]
        },
        {
          price: 500,
          taxes: [
            {
              name: 'sgst',
              price: 20
            }
          ]
        },
        {
          price: 1000,
          taxes: [
            {
              name: 'cgst',
              price: 30
            }
          ]
        }
      ]
    },
    {
      name: 'snow',
      rates: [
        {
          price: 200,
          taxes: [
            {
              name: 'gst',
              price: 1
            }
          ]
        },
        {
          price: 30,
          taxes: [
            {
              name: 'sgst',
              price: 2
            }
          ]
        },
        {
          price: 10,
          taxes: [
            {
              name: 'cgst',
              price: 3
            }
          ]
        }
      ]
    }
  ];
  const value = eachLike({
    name: 'snow',
    rates: [
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: [
          {
            name: 'cgst',
            price: gt(0)
          }
        ]
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, ``);
});

test('nested matchers - with no matcher in the middle layer - fail with overriding matcher', () => {
  const actual = [
    {
      name: 'sand',
      rates: [
        {
          price: 1000,
          taxes: [
            {
              name: 'gst',
              price: 10
            }
          ]
        },
        {
          price: 500,
          taxes: [
            {
              name: 'sgst',
              price: 20
            }
          ]
        },
        {
          price: 1000,
          taxes: [
            {
              name: 'cgst',
              price: 30
            }
          ]
        }
      ]
    },
    {
      name: 'snow',
      rates: [
        {
          price: 200,
          taxes: [
            {
              name: 'gst',
              price: 1
            }
          ]
        },
        {
          price: 30,
          taxes: [
            {
              name: 'sgst',
              price: 2
            }
          ]
        },
        {
          price: 10,
          taxes: [
            {
              name: 'cgst',
              price: 3
            }
          ]
        }
      ]
    }
  ];
  const value = eachLike({
    name: 'snow',
    rates: [
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: 1
        })
      },
      {
        price: like(123),
        taxes: eachLike({
          name: 'gst',
          price: gt(10000)
        })
      }
    ]
  });
  const rules = setMatchingRules({}, value, '$.body');
  const expected = getValue(value);
  const { message } = compare(actual, expected, rules, '$.body');
  assert.equal(message, `Json doesn't have 'greater' value than '10000' at '$.body[0].rates[2].taxes[0].price' but found '30'`);
});

test.run();