const { setRules } = require('./rules');

function setMatchingRules(rules, data, path) {
  return setRules(rules, data, path);
}

module.exports = {
  setMatchingRules
};