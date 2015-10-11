/* */ 
var escape = require("escape-html");
var propConfig = require("./property-config");
var types = propConfig.attributeTypes;
var properties = propConfig.properties;
var attributeNames = propConfig.attributeNames;
var prefixAttribute = memoizeString(function(name) {
  return escape(name) + '="';
});
module.exports = createAttribute;
function createAttribute(name, value, isAttribute) {
  if (properties.hasOwnProperty(name)) {
    if (shouldSkip(name, value))
      return '';
    name = (attributeNames[name] || name).toLowerCase();
    var attrType = properties[name];
    if ((attrType === types.BOOLEAN) || (attrType === types.OVERLOADED_BOOLEAN && value === true)) {
      return escape(name);
    }
    return prefixAttribute(name) + escape(value) + '"';
  } else if (isAttribute) {
    if (value == null)
      return '';
    return prefixAttribute(name) + escape(value) + '"';
  }
  return null;
}
function shouldSkip(name, value) {
  var attrType = properties[name];
  return value == null || (attrType === types.BOOLEAN && !value) || (attrType === types.OVERLOADED_BOOLEAN && value === false);
}
function memoizeString(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}
