/* */ 
var isArray = require("x-is-array");
var VPatch = require("../vnode/vpatch");
var isVNode = require("../vnode/is-vnode");
var isVText = require("../vnode/is-vtext");
var isWidget = require("../vnode/is-widget");
var isThunk = require("../vnode/is-thunk");
var handleThunk = require("../vnode/handle-thunk");
var diffProps = require("./diff-props");
module.exports = diff;
function diff(a, b) {
  var patch = {a: a};
  walk(a, b, patch, 0);
  return patch;
}
function walk(a, b, patch, index) {
  if (a === b) {
    return;
  }
  var apply = patch[index];
  var applyClear = false;
  if (isThunk(a) || isThunk(b)) {
    thunks(a, b, patch, index);
  } else if (b == null) {
    if (!isWidget(a)) {
      clearState(a, patch, index);
      apply = patch[index];
    }
    apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
  } else if (isVNode(b)) {
    if (isVNode(a)) {
      if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
        var propsPatch = diffProps(a.properties, b.properties);
        if (propsPatch) {
          apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch));
        }
        apply = diffChildren(a, b, patch, apply, index);
      } else {
        apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
        applyClear = true;
      }
    } else {
      apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
      applyClear = true;
    }
  } else if (isVText(b)) {
    if (!isVText(a)) {
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
      applyClear = true;
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
    }
  } else if (isWidget(b)) {
    if (!isWidget(a)) {
      applyClear = true;
    }
    apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
  }
  if (apply) {
    patch[index] = apply;
  }
  if (applyClear) {
    clearState(a, patch, index);
  }
}
function diffChildren(a, b, patch, apply, index) {
  var aChildren = a.children;
  var orderedSet = reorder(aChildren, b.children);
  var bChildren = orderedSet.children;
  var aLen = aChildren.length;
  var bLen = bChildren.length;
  var len = aLen > bLen ? aLen : bLen;
  for (var i = 0; i < len; i++) {
    var leftNode = aChildren[i];
    var rightNode = bChildren[i];
    index += 1;
    if (!leftNode) {
      if (rightNode) {
        apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode));
      }
    } else {
      walk(leftNode, rightNode, patch, index);
    }
    if (isVNode(leftNode) && leftNode.count) {
      index += leftNode.count;
    }
  }
  if (orderedSet.moves) {
    apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves));
  }
  return apply;
}
function clearState(vNode, patch, index) {
  unhook(vNode, patch, index);
  destroyWidgets(vNode, patch, index);
}
function destroyWidgets(vNode, patch, index) {
  if (isWidget(vNode)) {
    if (typeof vNode.destroy === "function") {
      patch[index] = appendPatch(patch[index], new VPatch(VPatch.REMOVE, vNode, null));
    }
  } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
    var children = vNode.children;
    var len = children.length;
    for (var i = 0; i < len; i++) {
      var child = children[i];
      index += 1;
      destroyWidgets(child, patch, index);
      if (isVNode(child) && child.count) {
        index += child.count;
      }
    }
  } else if (isThunk(vNode)) {
    thunks(vNode, null, patch, index);
  }
}
function thunks(a, b, patch, index) {
  var nodes = handleThunk(a, b);
  var thunkPatch = diff(nodes.a, nodes.b);
  if (hasPatches(thunkPatch)) {
    patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
  }
}
function hasPatches(patch) {
  for (var index in patch) {
    if (index !== "a") {
      return true;
    }
  }
  return false;
}
function unhook(vNode, patch, index) {
  if (isVNode(vNode)) {
    if (vNode.hooks) {
      patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)));
    }
    if (vNode.descendantHooks || vNode.hasThunks) {
      var children = vNode.children;
      var len = children.length;
      for (var i = 0; i < len; i++) {
        var child = children[i];
        index += 1;
        unhook(child, patch, index);
        if (isVNode(child) && child.count) {
          index += child.count;
        }
      }
    }
  } else if (isThunk(vNode)) {
    thunks(vNode, null, patch, index);
  }
}
function undefinedKeys(obj) {
  var result = {};
  for (var key in obj) {
    result[key] = undefined;
  }
  return result;
}
function reorder(aChildren, bChildren) {
  var bChildIndex = keyIndex(bChildren);
  var bKeys = bChildIndex.keys;
  var bFree = bChildIndex.free;
  if (bFree.length === bChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var aChildIndex = keyIndex(aChildren);
  var aKeys = aChildIndex.keys;
  var aFree = aChildIndex.free;
  if (aFree.length === aChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var newChildren = [];
  var freeIndex = 0;
  var freeCount = bFree.length;
  var deletedItems = 0;
  for (var i = 0; i < aChildren.length; i++) {
    var aItem = aChildren[i];
    var itemIndex;
    if (aItem.key) {
      if (bKeys.hasOwnProperty(aItem.key)) {
        itemIndex = bKeys[aItem.key];
        newChildren.push(bChildren[itemIndex]);
      } else {
        itemIndex = i - deletedItems++;
        newChildren.push(null);
      }
    } else {
      if (freeIndex < freeCount) {
        itemIndex = bFree[freeIndex++];
        newChildren.push(bChildren[itemIndex]);
      } else {
        itemIndex = i - deletedItems++;
        newChildren.push(null);
      }
    }
  }
  var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];
  for (var j = 0; j < bChildren.length; j++) {
    var newItem = bChildren[j];
    if (newItem.key) {
      if (!aKeys.hasOwnProperty(newItem.key)) {
        newChildren.push(newItem);
      }
    } else if (j >= lastFreeIndex) {
      newChildren.push(newItem);
    }
  }
  var simulate = newChildren.slice();
  var simulateIndex = 0;
  var removes = [];
  var inserts = [];
  var simulateItem;
  for (var k = 0; k < bChildren.length; ) {
    var wantedItem = bChildren[k];
    simulateItem = simulate[simulateIndex];
    while (simulateItem === null && simulate.length) {
      removes.push(remove(simulate, simulateIndex, null));
      simulateItem = simulate[simulateIndex];
    }
    if (!simulateItem || simulateItem.key !== wantedItem.key) {
      if (wantedItem.key) {
        if (simulateItem && simulateItem.key) {
          if (bKeys[simulateItem.key] !== k + 1) {
            removes.push(remove(simulate, simulateIndex, simulateItem.key));
            simulateItem = simulate[simulateIndex];
            if (!simulateItem || simulateItem.key !== wantedItem.key) {
              inserts.push({
                key: wantedItem.key,
                to: k
              });
            } else {
              simulateIndex++;
            }
          } else {
            inserts.push({
              key: wantedItem.key,
              to: k
            });
          }
        } else {
          inserts.push({
            key: wantedItem.key,
            to: k
          });
        }
        k++;
      } else if (simulateItem && simulateItem.key) {
        removes.push(remove(simulate, simulateIndex, simulateItem.key));
      }
    } else {
      simulateIndex++;
      k++;
    }
  }
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex];
    removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
  }
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: newChildren,
      moves: null
    };
  }
  return {
    children: newChildren,
    moves: {
      removes: removes,
      inserts: inserts
    }
  };
}
function remove(arr, index, key) {
  arr.splice(index, 1);
  return {
    from: index,
    key: key
  };
}
function keyIndex(children) {
  var keys = {};
  var free = [];
  var length = children.length;
  for (var i = 0; i < length; i++) {
    var child = children[i];
    if (child.key) {
      keys[child.key] = i;
    } else {
      free.push(i);
    }
  }
  return {
    keys: keys,
    free: free
  };
}
function appendPatch(apply, patch) {
  if (apply) {
    if (isArray(apply)) {
      apply.push(patch);
    } else {
      apply = [apply, patch];
    }
    return apply;
  } else {
    return patch;
  }
}
