const { setRules } = require('./rules');
const { getValue } = require('./value');

function setMatchingRules(rules, data, path) {
  return setRules(rules, data, path);
}

module.exports = {
  setMatchingRules,
  getValue
};