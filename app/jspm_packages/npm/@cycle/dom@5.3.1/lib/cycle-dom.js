/* */ 
"use strict";
var svg = require('virtual-dom/virtual-hyperscript/svg');
var _require = require('./render-dom');
var makeDOMDriver = _require.makeDOMDriver;
var _require2 = require('./render-html');
var makeHTMLDriver = _require2.makeHTMLDriver;
var mockDOMResponse = require('./mock-dom-response');
var h = require('./virtual-hyperscript');
var CycleDOM = {
  makeDOMDriver: makeDOMDriver,
  makeHTMLDriver: makeHTMLDriver,
  h: h,
  hJSX: function hJSX(tag, attrs) {
    for (var _len = arguments.length,
        children = Array(_len > 2 ? _len - 2 : 0),
        _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return h(tag, attrs, children);
  },
  svg: svg,
  mockDOMResponse: mockDOMResponse
};
module.exports = CycleDOM;
