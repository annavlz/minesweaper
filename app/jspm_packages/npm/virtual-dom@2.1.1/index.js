/* */ 
var diff = require("./diff");
var patch = require("./patch");
var h = require("./h");
var create = require("./create-element");
var VNode = require("./vnode/vnode");
var VText = require("./vnode/vtext");
module.exports = {
  diff: diff,
  patch: patch,
  h: h,
  create: create,
  VNode: VNode,
  VText: VText
};
