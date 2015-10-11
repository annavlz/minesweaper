/* */ 
'use strict';
var VNode = require("virtual-dom/vnode/vnode");
var VText = require("virtual-dom/vnode/vtext");
var domParser = new DOMParser();
var propertyMap = require("./property-map");
var namespaceMap = require("./namespace-map");
var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
module.exports = parser;
function parser(el, attr) {
  if (!el) {
    return createNode(document.createTextNode(''));
  }
  if (typeof el === 'string') {
    var doc = domParser.parseFromString(el, 'text/html');
    if (doc.body.firstChild) {
      el = doc.body.firstChild;
    } else if (doc.head.firstChild && (doc.head.firstChild.tagName !== 'TITLE' || doc.title)) {
      el = doc.head.firstChild;
    } else if (doc.firstChild && doc.firstChild.tagName !== 'HTML') {
      el = doc.firstChild;
    } else {
      el = document.createTextNode('');
    }
  }
  if (typeof el !== 'object' || !el || !el.nodeType) {
    throw new Error('invalid dom node', el);
  }
  return createNode(el, attr);
}
function createNode(el, attr) {
  if (el.nodeType === 3) {
    return createVirtualTextNode(el);
  } else if (el.nodeType === 1 || el.nodeType === 9) {
    return createVirtualDomNode(el, attr);
  }
  return new VText('');
}
function createVirtualTextNode(el) {
  return new VText(el.nodeValue);
}
function createVirtualDomNode(el, attr) {
  var ns = el.namespaceURI !== HTML_NAMESPACE ? el.namespaceURI : null;
  var key = attr && el.getAttribute(attr) ? el.getAttribute(attr) : null;
  return new VNode(el.tagName, createProperties(el), createChildren(el, attr), key, ns);
}
function createChildren(el, attr) {
  var children = [];
  for (var i = 0; i < el.childNodes.length; i++) {
    children.push(createNode(el.childNodes[i], attr));
  }
  ;
  return children;
}
function createProperties(el) {
  var properties = {};
  if (!el.hasAttributes()) {
    return properties;
  }
  var ns;
  if (el.namespaceURI && el.namespaceURI !== HTML_NAMESPACE) {
    ns = el.namespaceURI;
  }
  var attr;
  for (var i = 0; i < el.attributes.length; i++) {
    if (ns) {
      attr = createPropertyNS(el.attributes[i]);
    } else {
      attr = createProperty(el.attributes[i]);
    }
    if (attr.ns) {
      properties[attr.name] = {
        namespace: attr.ns,
        value: attr.value
      };
    } else if (attr.isAttr) {
      if (!properties.attributes) {
        properties.attributes = {};
      }
      properties.attributes[attr.name] = attr.value;
    } else {
      properties[attr.name] = attr.value;
    }
  }
  ;
  return properties;
}
function createProperty(attr) {
  var name,
      value,
      isAttr;
  if (propertyMap[attr.name]) {
    name = propertyMap[attr.name];
  } else {
    name = attr.name;
  }
  if (name === 'style') {
    var style = {};
    attr.value.split(';').forEach(function(s) {
      var pos = s.indexOf(':');
      if (pos < 0) {
        return;
      }
      style[s.substr(0, pos).trim()] = s.substr(pos + 1).trim();
    });
    value = style;
  } else if (name.indexOf('data-') === 0) {
    value = attr.value;
    isAttr = true;
  } else {
    value = attr.value;
  }
  return {
    name: name,
    value: value,
    isAttr: isAttr || false
  };
}
function createPropertyNS(attr) {
  var name,
      value;
  return {
    name: attr.name,
    value: attr.value,
    ns: namespaceMap[attr.name] || ''
  };
}
