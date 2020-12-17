function isPureObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

module.exports = {
  isPureObject,
  isObject
};