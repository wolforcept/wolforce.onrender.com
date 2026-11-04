"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/matter-js/build/matter.js
  var require_matter = __commonJS({
    "node_modules/matter-js/build/matter.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define("Matter", [], factory);
        else if (typeof exports === "object")
          exports["Matter"] = factory();
        else
          root["Matter"] = factory();
      })(exports, function() {
        return (
          /******/
          (function(modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module2 = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
                /******/
              };
              modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
              module2.l = true;
              return module2.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function(exports2, name, getter) {
              if (!__webpack_require__.o(exports2, name)) {
                Object.defineProperty(exports2, name, { enumerable: true, get: getter });
              }
            };
            __webpack_require__.r = function(exports2) {
              if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
              }
              Object.defineProperty(exports2, "__esModule", { value: true });
            };
            __webpack_require__.t = function(value, mode) {
              if (mode & 1) value = __webpack_require__(value);
              if (mode & 8) return value;
              if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
              var ns = /* @__PURE__ */ Object.create(null);
              __webpack_require__.r(ns);
              Object.defineProperty(ns, "default", { enumerable: true, value });
              if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key2) {
                return value[key2];
              }.bind(null, key));
              return ns;
            };
            __webpack_require__.n = function(module2) {
              var getter = module2 && module2.__esModule ? (
                /******/
                function getDefault() {
                  return module2["default"];
                }
              ) : (
                /******/
                function getModuleExports() {
                  return module2;
                }
              );
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__(__webpack_require__.s = 20);
          })([
            /* 0 */
            /***/
            (function(module2, exports2) {
              var Common = {};
              module2.exports = Common;
              (function() {
                Common._baseDelta = 1e3 / 60;
                Common._nextId = 0;
                Common._seed = 0;
                Common._nowStartTime = +/* @__PURE__ */ new Date();
                Common._warnedOnce = {};
                Common._decomp = null;
                Common.extend = function(obj, deep) {
                  var argsStart, args, deepClone;
                  if (typeof deep === "boolean") {
                    argsStart = 2;
                    deepClone = deep;
                  } else {
                    argsStart = 1;
                    deepClone = true;
                  }
                  for (var i = argsStart; i < arguments.length; i++) {
                    var source = arguments[i];
                    if (source) {
                      for (var prop in source) {
                        if (deepClone && source[prop] && source[prop].constructor === Object) {
                          if (!obj[prop] || obj[prop].constructor === Object) {
                            obj[prop] = obj[prop] || {};
                            Common.extend(obj[prop], deepClone, source[prop]);
                          } else {
                            obj[prop] = source[prop];
                          }
                        } else {
                          obj[prop] = source[prop];
                        }
                      }
                    }
                  }
                  return obj;
                };
                Common.clone = function(obj, deep) {
                  return Common.extend({}, deep, obj);
                };
                Common.keys = function(obj) {
                  if (Object.keys)
                    return Object.keys(obj);
                  var keys = [];
                  for (var key in obj)
                    keys.push(key);
                  return keys;
                };
                Common.values = function(obj) {
                  var values = [];
                  if (Object.keys) {
                    var keys = Object.keys(obj);
                    for (var i = 0; i < keys.length; i++) {
                      values.push(obj[keys[i]]);
                    }
                    return values;
                  }
                  for (var key in obj)
                    values.push(obj[key]);
                  return values;
                };
                Common.get = function(obj, path, begin, end) {
                  path = path.split(".").slice(begin, end);
                  for (var i = 0; i < path.length; i += 1) {
                    obj = obj[path[i]];
                  }
                  return obj;
                };
                Common.set = function(obj, path, val, begin, end) {
                  var parts = path.split(".").slice(begin, end);
                  Common.get(obj, path, 0, -1)[parts[parts.length - 1]] = val;
                  return val;
                };
                Common.shuffle = function(array) {
                  for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Common.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                  }
                  return array;
                };
                Common.choose = function(choices) {
                  return choices[Math.floor(Common.random() * choices.length)];
                };
                Common.isElement = function(obj) {
                  if (typeof HTMLElement !== "undefined") {
                    return obj instanceof HTMLElement;
                  }
                  return !!(obj && obj.nodeType && obj.nodeName);
                };
                Common.isArray = function(obj) {
                  return Object.prototype.toString.call(obj) === "[object Array]";
                };
                Common.isFunction = function(obj) {
                  return typeof obj === "function";
                };
                Common.isPlainObject = function(obj) {
                  return typeof obj === "object" && obj.constructor === Object;
                };
                Common.isString = function(obj) {
                  return toString.call(obj) === "[object String]";
                };
                Common.clamp = function(value, min, max) {
                  if (value < min)
                    return min;
                  if (value > max)
                    return max;
                  return value;
                };
                Common.sign = function(value) {
                  return value < 0 ? -1 : 1;
                };
                Common.now = function() {
                  if (typeof window !== "undefined" && window.performance) {
                    if (window.performance.now) {
                      return window.performance.now();
                    } else if (window.performance.webkitNow) {
                      return window.performance.webkitNow();
                    }
                  }
                  if (Date.now) {
                    return Date.now();
                  }
                  return /* @__PURE__ */ new Date() - Common._nowStartTime;
                };
                Common.random = function(min, max) {
                  min = typeof min !== "undefined" ? min : 0;
                  max = typeof max !== "undefined" ? max : 1;
                  return min + _seededRandom() * (max - min);
                };
                var _seededRandom = function() {
                  Common._seed = (Common._seed * 9301 + 49297) % 233280;
                  return Common._seed / 233280;
                };
                Common.colorToNumber = function(colorString) {
                  colorString = colorString.replace("#", "");
                  if (colorString.length == 3) {
                    colorString = colorString.charAt(0) + colorString.charAt(0) + colorString.charAt(1) + colorString.charAt(1) + colorString.charAt(2) + colorString.charAt(2);
                  }
                  return parseInt(colorString, 16);
                };
                Common.logLevel = 1;
                Common.log = function() {
                  if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
                    console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
                  }
                };
                Common.info = function() {
                  if (console && Common.logLevel > 0 && Common.logLevel <= 2) {
                    console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
                  }
                };
                Common.warn = function() {
                  if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
                    console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
                  }
                };
                Common.warnOnce = function() {
                  var message = Array.prototype.slice.call(arguments).join(" ");
                  if (!Common._warnedOnce[message]) {
                    Common.warn(message);
                    Common._warnedOnce[message] = true;
                  }
                };
                Common.deprecated = function(obj, prop, warning) {
                  obj[prop] = Common.chain(function() {
                    Common.warnOnce("\u{1F505} deprecated \u{1F505}", warning);
                  }, obj[prop]);
                };
                Common.nextId = function() {
                  return Common._nextId++;
                };
                Common.indexOf = function(haystack, needle) {
                  if (haystack.indexOf)
                    return haystack.indexOf(needle);
                  for (var i = 0; i < haystack.length; i++) {
                    if (haystack[i] === needle)
                      return i;
                  }
                  return -1;
                };
                Common.map = function(list, func) {
                  if (list.map) {
                    return list.map(func);
                  }
                  var mapped = [];
                  for (var i = 0; i < list.length; i += 1) {
                    mapped.push(func(list[i]));
                  }
                  return mapped;
                };
                Common.topologicalSort = function(graph) {
                  var result = [], visited = [], temp = [];
                  for (var node in graph) {
                    if (!visited[node] && !temp[node]) {
                      Common._topologicalSort(node, visited, temp, graph, result);
                    }
                  }
                  return result;
                };
                Common._topologicalSort = function(node, visited, temp, graph, result) {
                  var neighbors = graph[node] || [];
                  temp[node] = true;
                  for (var i = 0; i < neighbors.length; i += 1) {
                    var neighbor = neighbors[i];
                    if (temp[neighbor]) {
                      continue;
                    }
                    if (!visited[neighbor]) {
                      Common._topologicalSort(neighbor, visited, temp, graph, result);
                    }
                  }
                  temp[node] = false;
                  visited[node] = true;
                  result.push(node);
                };
                Common.chain = function() {
                  var funcs = [];
                  for (var i = 0; i < arguments.length; i += 1) {
                    var func = arguments[i];
                    if (func._chained) {
                      funcs.push.apply(funcs, func._chained);
                    } else {
                      funcs.push(func);
                    }
                  }
                  var chain = function() {
                    var lastResult, args = new Array(arguments.length);
                    for (var i2 = 0, l = arguments.length; i2 < l; i2++) {
                      args[i2] = arguments[i2];
                    }
                    for (i2 = 0; i2 < funcs.length; i2 += 1) {
                      var result = funcs[i2].apply(lastResult, args);
                      if (typeof result !== "undefined") {
                        lastResult = result;
                      }
                    }
                    return lastResult;
                  };
                  chain._chained = funcs;
                  return chain;
                };
                Common.chainPathBefore = function(base, path, func) {
                  return Common.set(base, path, Common.chain(
                    func,
                    Common.get(base, path)
                  ));
                };
                Common.chainPathAfter = function(base, path, func) {
                  return Common.set(base, path, Common.chain(
                    Common.get(base, path),
                    func
                  ));
                };
                Common.setDecomp = function(decomp) {
                  Common._decomp = decomp;
                };
                Common.getDecomp = function() {
                  var decomp = Common._decomp;
                  try {
                    if (!decomp && typeof window !== "undefined") {
                      decomp = window.decomp;
                    }
                    if (!decomp && typeof global !== "undefined") {
                      decomp = global.decomp;
                    }
                  } catch (e) {
                    decomp = null;
                  }
                  return decomp;
                };
              })();
            }),
            /* 1 */
            /***/
            (function(module2, exports2) {
              var Bounds = {};
              module2.exports = Bounds;
              (function() {
                Bounds.create = function(vertices) {
                  var bounds = {
                    min: { x: 0, y: 0 },
                    max: { x: 0, y: 0 }
                  };
                  if (vertices)
                    Bounds.update(bounds, vertices);
                  return bounds;
                };
                Bounds.update = function(bounds, vertices, velocity) {
                  bounds.min.x = Infinity;
                  bounds.max.x = -Infinity;
                  bounds.min.y = Infinity;
                  bounds.max.y = -Infinity;
                  for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
                    if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
                    if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
                    if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
                  }
                  if (velocity) {
                    if (velocity.x > 0) {
                      bounds.max.x += velocity.x;
                    } else {
                      bounds.min.x += velocity.x;
                    }
                    if (velocity.y > 0) {
                      bounds.max.y += velocity.y;
                    } else {
                      bounds.min.y += velocity.y;
                    }
                  }
                };
                Bounds.contains = function(bounds, point) {
                  return point.x >= bounds.min.x && point.x <= bounds.max.x && point.y >= bounds.min.y && point.y <= bounds.max.y;
                };
                Bounds.overlaps = function(boundsA, boundsB) {
                  return boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y;
                };
                Bounds.translate = function(bounds, vector) {
                  bounds.min.x += vector.x;
                  bounds.max.x += vector.x;
                  bounds.min.y += vector.y;
                  bounds.max.y += vector.y;
                };
                Bounds.shift = function(bounds, position) {
                  var deltaX = bounds.max.x - bounds.min.x, deltaY = bounds.max.y - bounds.min.y;
                  bounds.min.x = position.x;
                  bounds.max.x = position.x + deltaX;
                  bounds.min.y = position.y;
                  bounds.max.y = position.y + deltaY;
                };
              })();
            }),
            /* 2 */
            /***/
            (function(module2, exports2) {
              var Vector = {};
              module2.exports = Vector;
              (function() {
                Vector.create = function(x, y) {
                  return { x: x || 0, y: y || 0 };
                };
                Vector.clone = function(vector) {
                  return { x: vector.x, y: vector.y };
                };
                Vector.magnitude = function(vector) {
                  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
                };
                Vector.magnitudeSquared = function(vector) {
                  return vector.x * vector.x + vector.y * vector.y;
                };
                Vector.rotate = function(vector, angle, output) {
                  var cos = Math.cos(angle), sin = Math.sin(angle);
                  if (!output) output = {};
                  var x = vector.x * cos - vector.y * sin;
                  output.y = vector.x * sin + vector.y * cos;
                  output.x = x;
                  return output;
                };
                Vector.rotateAbout = function(vector, angle, point, output) {
                  var cos = Math.cos(angle), sin = Math.sin(angle);
                  if (!output) output = {};
                  var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
                  output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
                  output.x = x;
                  return output;
                };
                Vector.normalise = function(vector) {
                  var magnitude = Vector.magnitude(vector);
                  if (magnitude === 0)
                    return { x: 0, y: 0 };
                  return { x: vector.x / magnitude, y: vector.y / magnitude };
                };
                Vector.dot = function(vectorA, vectorB) {
                  return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
                };
                Vector.cross = function(vectorA, vectorB) {
                  return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
                };
                Vector.cross3 = function(vectorA, vectorB, vectorC) {
                  return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
                };
                Vector.add = function(vectorA, vectorB, output) {
                  if (!output) output = {};
                  output.x = vectorA.x + vectorB.x;
                  output.y = vectorA.y + vectorB.y;
                  return output;
                };
                Vector.sub = function(vectorA, vectorB, output) {
                  if (!output) output = {};
                  output.x = vectorA.x - vectorB.x;
                  output.y = vectorA.y - vectorB.y;
                  return output;
                };
                Vector.mult = function(vector, scalar) {
                  return { x: vector.x * scalar, y: vector.y * scalar };
                };
                Vector.div = function(vector, scalar) {
                  return { x: vector.x / scalar, y: vector.y / scalar };
                };
                Vector.perp = function(vector, negate) {
                  negate = negate === true ? -1 : 1;
                  return { x: negate * -vector.y, y: negate * vector.x };
                };
                Vector.neg = function(vector) {
                  return { x: -vector.x, y: -vector.y };
                };
                Vector.angle = function(vectorA, vectorB) {
                  return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
                };
                Vector._temp = [
                  Vector.create(),
                  Vector.create(),
                  Vector.create(),
                  Vector.create(),
                  Vector.create(),
                  Vector.create()
                ];
              })();
            }),
            /* 3 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Vertices = {};
              module2.exports = Vertices;
              var Vector = __webpack_require__(2);
              var Common = __webpack_require__(0);
              (function() {
                Vertices.create = function(points, body) {
                  var vertices = [];
                  for (var i = 0; i < points.length; i++) {
                    var point = points[i], vertex = {
                      x: point.x,
                      y: point.y,
                      index: i,
                      body,
                      isInternal: false
                    };
                    vertices.push(vertex);
                  }
                  return vertices;
                };
                Vertices.fromPath = function(path, body) {
                  var pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, points = [];
                  path.replace(pathPattern, function(match, x, y) {
                    points.push({ x: parseFloat(x), y: parseFloat(y) });
                  });
                  return Vertices.create(points, body);
                };
                Vertices.centre = function(vertices) {
                  var area = Vertices.area(vertices, true), centre = { x: 0, y: 0 }, cross, temp, j;
                  for (var i = 0; i < vertices.length; i++) {
                    j = (i + 1) % vertices.length;
                    cross = Vector.cross(vertices[i], vertices[j]);
                    temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
                    centre = Vector.add(centre, temp);
                  }
                  return Vector.div(centre, 6 * area);
                };
                Vertices.mean = function(vertices) {
                  var average = { x: 0, y: 0 };
                  for (var i = 0; i < vertices.length; i++) {
                    average.x += vertices[i].x;
                    average.y += vertices[i].y;
                  }
                  return Vector.div(average, vertices.length);
                };
                Vertices.area = function(vertices, signed) {
                  var area = 0, j = vertices.length - 1;
                  for (var i = 0; i < vertices.length; i++) {
                    area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
                    j = i;
                  }
                  if (signed)
                    return area / 2;
                  return Math.abs(area) / 2;
                };
                Vertices.inertia = function(vertices, mass) {
                  var numerator = 0, denominator = 0, v = vertices, cross, j;
                  for (var n = 0; n < v.length; n++) {
                    j = (n + 1) % v.length;
                    cross = Math.abs(Vector.cross(v[j], v[n]));
                    numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
                    denominator += cross;
                  }
                  return mass / 6 * (numerator / denominator);
                };
                Vertices.translate = function(vertices, vector, scalar) {
                  scalar = typeof scalar !== "undefined" ? scalar : 1;
                  var verticesLength = vertices.length, translateX = vector.x * scalar, translateY = vector.y * scalar, i;
                  for (i = 0; i < verticesLength; i++) {
                    vertices[i].x += translateX;
                    vertices[i].y += translateY;
                  }
                  return vertices;
                };
                Vertices.rotate = function(vertices, angle, point) {
                  if (angle === 0)
                    return;
                  var cos = Math.cos(angle), sin = Math.sin(angle), pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex, dx, dy, i;
                  for (i = 0; i < verticesLength; i++) {
                    vertex = vertices[i];
                    dx = vertex.x - pointX;
                    dy = vertex.y - pointY;
                    vertex.x = pointX + (dx * cos - dy * sin);
                    vertex.y = pointY + (dx * sin + dy * cos);
                  }
                  return vertices;
                };
                Vertices.contains = function(vertices, point) {
                  var pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex = vertices[verticesLength - 1], nextVertex;
                  for (var i = 0; i < verticesLength; i++) {
                    nextVertex = vertices[i];
                    if ((pointX - vertex.x) * (nextVertex.y - vertex.y) + (pointY - vertex.y) * (vertex.x - nextVertex.x) > 0) {
                      return false;
                    }
                    vertex = nextVertex;
                  }
                  return true;
                };
                Vertices.scale = function(vertices, scaleX, scaleY, point) {
                  if (scaleX === 1 && scaleY === 1)
                    return vertices;
                  point = point || Vertices.centre(vertices);
                  var vertex, delta;
                  for (var i = 0; i < vertices.length; i++) {
                    vertex = vertices[i];
                    delta = Vector.sub(vertex, point);
                    vertices[i].x = point.x + delta.x * scaleX;
                    vertices[i].y = point.y + delta.y * scaleY;
                  }
                  return vertices;
                };
                Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
                  if (typeof radius === "number") {
                    radius = [radius];
                  } else {
                    radius = radius || [8];
                  }
                  quality = typeof quality !== "undefined" ? quality : -1;
                  qualityMin = qualityMin || 2;
                  qualityMax = qualityMax || 14;
                  var newVertices = [];
                  for (var i = 0; i < vertices.length; i++) {
                    var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1], vertex = vertices[i], nextVertex = vertices[(i + 1) % vertices.length], currentRadius = radius[i < radius.length ? i : radius.length - 1];
                    if (currentRadius === 0) {
                      newVertices.push(vertex);
                      continue;
                    }
                    var prevNormal = Vector.normalise({
                      x: vertex.y - prevVertex.y,
                      y: prevVertex.x - vertex.x
                    });
                    var nextNormal = Vector.normalise({
                      x: nextVertex.y - vertex.y,
                      y: vertex.x - nextVertex.x
                    });
                    var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)), radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius), midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)), scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
                    var precision = quality;
                    if (quality === -1) {
                      precision = Math.pow(currentRadius, 0.32) * 1.75;
                    }
                    precision = Common.clamp(precision, qualityMin, qualityMax);
                    if (precision % 2 === 1)
                      precision += 1;
                    var alpha2 = Math.acos(Vector.dot(prevNormal, nextNormal)), theta = alpha2 / precision;
                    for (var j = 0; j < precision; j++) {
                      newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
                    }
                  }
                  return newVertices;
                };
                Vertices.clockwiseSort = function(vertices) {
                  var centre = Vertices.mean(vertices);
                  vertices.sort(function(vertexA, vertexB) {
                    return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
                  });
                  return vertices;
                };
                Vertices.isConvex = function(vertices) {
                  var flag = 0, n = vertices.length, i, j, k, z;
                  if (n < 3)
                    return null;
                  for (i = 0; i < n; i++) {
                    j = (i + 1) % n;
                    k = (i + 2) % n;
                    z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
                    z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
                    if (z < 0) {
                      flag |= 1;
                    } else if (z > 0) {
                      flag |= 2;
                    }
                    if (flag === 3) {
                      return false;
                    }
                  }
                  if (flag !== 0) {
                    return true;
                  } else {
                    return null;
                  }
                };
                Vertices.hull = function(vertices) {
                  var upper = [], lower = [], vertex, i;
                  vertices = vertices.slice(0);
                  vertices.sort(function(vertexA, vertexB) {
                    var dx = vertexA.x - vertexB.x;
                    return dx !== 0 ? dx : vertexA.y - vertexB.y;
                  });
                  for (i = 0; i < vertices.length; i += 1) {
                    vertex = vertices[i];
                    while (lower.length >= 2 && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
                      lower.pop();
                    }
                    lower.push(vertex);
                  }
                  for (i = vertices.length - 1; i >= 0; i -= 1) {
                    vertex = vertices[i];
                    while (upper.length >= 2 && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
                      upper.pop();
                    }
                    upper.push(vertex);
                  }
                  upper.pop();
                  lower.pop();
                  return upper.concat(lower);
                };
              })();
            }),
            /* 4 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Body = {};
              module2.exports = Body;
              var Vertices = __webpack_require__(3);
              var Vector = __webpack_require__(2);
              var Sleeping = __webpack_require__(7);
              var Common = __webpack_require__(0);
              var Bounds = __webpack_require__(1);
              var Axes = __webpack_require__(11);
              (function() {
                Body._timeCorrection = true;
                Body._inertiaScale = 4;
                Body._nextCollidingGroupId = 1;
                Body._nextNonCollidingGroupId = -1;
                Body._nextCategory = 1;
                Body._baseDelta = 1e3 / 60;
                Body.create = function(options) {
                  var defaults = {
                    id: Common.nextId(),
                    type: "body",
                    label: "Body",
                    parts: [],
                    plugin: {},
                    angle: 0,
                    vertices: Vertices.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
                    position: { x: 0, y: 0 },
                    force: { x: 0, y: 0 },
                    torque: 0,
                    positionImpulse: { x: 0, y: 0 },
                    constraintImpulse: { x: 0, y: 0, angle: 0 },
                    totalContacts: 0,
                    speed: 0,
                    angularSpeed: 0,
                    velocity: { x: 0, y: 0 },
                    angularVelocity: 0,
                    isSensor: false,
                    isStatic: false,
                    isSleeping: false,
                    motion: 0,
                    sleepThreshold: 60,
                    density: 1e-3,
                    restitution: 0,
                    friction: 0.1,
                    frictionStatic: 0.5,
                    frictionAir: 0.01,
                    collisionFilter: {
                      category: 1,
                      mask: 4294967295,
                      group: 0
                    },
                    slop: 0.05,
                    timeScale: 1,
                    render: {
                      visible: true,
                      opacity: 1,
                      strokeStyle: null,
                      fillStyle: null,
                      lineWidth: null,
                      sprite: {
                        xScale: 1,
                        yScale: 1,
                        xOffset: 0,
                        yOffset: 0
                      }
                    },
                    events: null,
                    bounds: null,
                    chamfer: null,
                    circleRadius: 0,
                    positionPrev: null,
                    anglePrev: 0,
                    parent: null,
                    axes: null,
                    area: 0,
                    mass: 0,
                    inertia: 0,
                    deltaTime: 1e3 / 60,
                    _original: null
                  };
                  var body = Common.extend(defaults, options);
                  _initProperties(body, options);
                  return body;
                };
                Body.nextGroup = function(isNonColliding) {
                  if (isNonColliding)
                    return Body._nextNonCollidingGroupId--;
                  return Body._nextCollidingGroupId++;
                };
                Body.nextCategory = function() {
                  Body._nextCategory = Body._nextCategory << 1;
                  return Body._nextCategory;
                };
                var _initProperties = function(body, options) {
                  options = options || {};
                  Body.set(body, {
                    bounds: body.bounds || Bounds.create(body.vertices),
                    positionPrev: body.positionPrev || Vector.clone(body.position),
                    anglePrev: body.anglePrev || body.angle,
                    vertices: body.vertices,
                    parts: body.parts || [body],
                    isStatic: body.isStatic,
                    isSleeping: body.isSleeping,
                    parent: body.parent || body
                  });
                  Vertices.rotate(body.vertices, body.angle, body.position);
                  Axes.rotate(body.axes, body.angle);
                  Bounds.update(body.bounds, body.vertices, body.velocity);
                  Body.set(body, {
                    axes: options.axes || body.axes,
                    area: options.area || body.area,
                    mass: options.mass || body.mass,
                    inertia: options.inertia || body.inertia
                  });
                  var defaultFillStyle = body.isStatic ? "#14151f" : Common.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), defaultStrokeStyle = body.isStatic ? "#555" : "#ccc", defaultLineWidth = body.isStatic && body.render.fillStyle === null ? 1 : 0;
                  body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
                  body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
                  body.render.lineWidth = body.render.lineWidth || defaultLineWidth;
                  body.render.sprite.xOffset += -(body.bounds.min.x - body.position.x) / (body.bounds.max.x - body.bounds.min.x);
                  body.render.sprite.yOffset += -(body.bounds.min.y - body.position.y) / (body.bounds.max.y - body.bounds.min.y);
                };
                Body.set = function(body, settings, value) {
                  var property;
                  if (typeof settings === "string") {
                    property = settings;
                    settings = {};
                    settings[property] = value;
                  }
                  for (property in settings) {
                    if (!Object.prototype.hasOwnProperty.call(settings, property))
                      continue;
                    value = settings[property];
                    switch (property) {
                      case "isStatic":
                        Body.setStatic(body, value);
                        break;
                      case "isSleeping":
                        Sleeping.set(body, value);
                        break;
                      case "mass":
                        Body.setMass(body, value);
                        break;
                      case "density":
                        Body.setDensity(body, value);
                        break;
                      case "inertia":
                        Body.setInertia(body, value);
                        break;
                      case "vertices":
                        Body.setVertices(body, value);
                        break;
                      case "position":
                        Body.setPosition(body, value);
                        break;
                      case "angle":
                        Body.setAngle(body, value);
                        break;
                      case "velocity":
                        Body.setVelocity(body, value);
                        break;
                      case "angularVelocity":
                        Body.setAngularVelocity(body, value);
                        break;
                      case "speed":
                        Body.setSpeed(body, value);
                        break;
                      case "angularSpeed":
                        Body.setAngularSpeed(body, value);
                        break;
                      case "parts":
                        Body.setParts(body, value);
                        break;
                      case "centre":
                        Body.setCentre(body, value);
                        break;
                      default:
                        body[property] = value;
                    }
                  }
                };
                Body.setStatic = function(body, isStatic) {
                  for (var i = 0; i < body.parts.length; i++) {
                    var part = body.parts[i];
                    part.isStatic = isStatic;
                    if (isStatic) {
                      part._original = {
                        restitution: part.restitution,
                        friction: part.friction,
                        mass: part.mass,
                        inertia: part.inertia,
                        density: part.density,
                        inverseMass: part.inverseMass,
                        inverseInertia: part.inverseInertia
                      };
                      part.restitution = 0;
                      part.friction = 1;
                      part.mass = part.inertia = part.density = Infinity;
                      part.inverseMass = part.inverseInertia = 0;
                      part.positionPrev.x = part.position.x;
                      part.positionPrev.y = part.position.y;
                      part.anglePrev = part.angle;
                      part.angularVelocity = 0;
                      part.speed = 0;
                      part.angularSpeed = 0;
                      part.motion = 0;
                    } else if (part._original) {
                      part.restitution = part._original.restitution;
                      part.friction = part._original.friction;
                      part.mass = part._original.mass;
                      part.inertia = part._original.inertia;
                      part.density = part._original.density;
                      part.inverseMass = part._original.inverseMass;
                      part.inverseInertia = part._original.inverseInertia;
                      part._original = null;
                    }
                  }
                };
                Body.setMass = function(body, mass) {
                  var moment = body.inertia / (body.mass / 6);
                  body.inertia = moment * (mass / 6);
                  body.inverseInertia = 1 / body.inertia;
                  body.mass = mass;
                  body.inverseMass = 1 / body.mass;
                  body.density = body.mass / body.area;
                };
                Body.setDensity = function(body, density) {
                  Body.setMass(body, density * body.area);
                  body.density = density;
                };
                Body.setInertia = function(body, inertia) {
                  body.inertia = inertia;
                  body.inverseInertia = 1 / body.inertia;
                };
                Body.setVertices = function(body, vertices) {
                  if (vertices[0].body === body) {
                    body.vertices = vertices;
                  } else {
                    body.vertices = Vertices.create(vertices, body);
                  }
                  body.axes = Axes.fromVertices(body.vertices);
                  body.area = Vertices.area(body.vertices);
                  Body.setMass(body, body.density * body.area);
                  var centre = Vertices.centre(body.vertices);
                  Vertices.translate(body.vertices, centre, -1);
                  Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
                  Vertices.translate(body.vertices, body.position);
                  Bounds.update(body.bounds, body.vertices, body.velocity);
                };
                Body.setParts = function(body, parts, autoHull) {
                  var i;
                  parts = parts.slice(0);
                  body.parts.length = 0;
                  body.parts.push(body);
                  body.parent = body;
                  for (i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    if (part !== body) {
                      part.parent = body;
                      body.parts.push(part);
                    }
                  }
                  if (body.parts.length === 1)
                    return;
                  autoHull = typeof autoHull !== "undefined" ? autoHull : true;
                  if (autoHull) {
                    var vertices = [];
                    for (i = 0; i < parts.length; i++) {
                      vertices = vertices.concat(parts[i].vertices);
                    }
                    Vertices.clockwiseSort(vertices);
                    var hull = Vertices.hull(vertices), hullCentre = Vertices.centre(hull);
                    Body.setVertices(body, hull);
                    Vertices.translate(body.vertices, hullCentre);
                  }
                  var total = Body._totalProperties(body);
                  body.area = total.area;
                  body.parent = body;
                  body.position.x = total.centre.x;
                  body.position.y = total.centre.y;
                  body.positionPrev.x = total.centre.x;
                  body.positionPrev.y = total.centre.y;
                  Body.setMass(body, total.mass);
                  Body.setInertia(body, total.inertia);
                  Body.setPosition(body, total.centre);
                };
                Body.setCentre = function(body, centre, relative) {
                  if (!relative) {
                    body.positionPrev.x = centre.x - (body.position.x - body.positionPrev.x);
                    body.positionPrev.y = centre.y - (body.position.y - body.positionPrev.y);
                    body.position.x = centre.x;
                    body.position.y = centre.y;
                  } else {
                    body.positionPrev.x += centre.x;
                    body.positionPrev.y += centre.y;
                    body.position.x += centre.x;
                    body.position.y += centre.y;
                  }
                };
                Body.setPosition = function(body, position, updateVelocity) {
                  var delta = Vector.sub(position, body.position);
                  if (updateVelocity) {
                    body.positionPrev.x = body.position.x;
                    body.positionPrev.y = body.position.y;
                    body.velocity.x = delta.x;
                    body.velocity.y = delta.y;
                    body.speed = Vector.magnitude(delta);
                  } else {
                    body.positionPrev.x += delta.x;
                    body.positionPrev.y += delta.y;
                  }
                  for (var i = 0; i < body.parts.length; i++) {
                    var part = body.parts[i];
                    part.position.x += delta.x;
                    part.position.y += delta.y;
                    Vertices.translate(part.vertices, delta);
                    Bounds.update(part.bounds, part.vertices, body.velocity);
                  }
                };
                Body.setAngle = function(body, angle, updateVelocity) {
                  var delta = angle - body.angle;
                  if (updateVelocity) {
                    body.anglePrev = body.angle;
                    body.angularVelocity = delta;
                    body.angularSpeed = Math.abs(delta);
                  } else {
                    body.anglePrev += delta;
                  }
                  for (var i = 0; i < body.parts.length; i++) {
                    var part = body.parts[i];
                    part.angle += delta;
                    Vertices.rotate(part.vertices, delta, body.position);
                    Axes.rotate(part.axes, delta);
                    Bounds.update(part.bounds, part.vertices, body.velocity);
                    if (i > 0) {
                      Vector.rotateAbout(part.position, delta, body.position, part.position);
                    }
                  }
                };
                Body.setVelocity = function(body, velocity) {
                  var timeScale = body.deltaTime / Body._baseDelta;
                  body.positionPrev.x = body.position.x - velocity.x * timeScale;
                  body.positionPrev.y = body.position.y - velocity.y * timeScale;
                  body.velocity.x = (body.position.x - body.positionPrev.x) / timeScale;
                  body.velocity.y = (body.position.y - body.positionPrev.y) / timeScale;
                  body.speed = Vector.magnitude(body.velocity);
                };
                Body.getVelocity = function(body) {
                  var timeScale = Body._baseDelta / body.deltaTime;
                  return {
                    x: (body.position.x - body.positionPrev.x) * timeScale,
                    y: (body.position.y - body.positionPrev.y) * timeScale
                  };
                };
                Body.getSpeed = function(body) {
                  return Vector.magnitude(Body.getVelocity(body));
                };
                Body.setSpeed = function(body, speed) {
                  Body.setVelocity(body, Vector.mult(Vector.normalise(Body.getVelocity(body)), speed));
                };
                Body.setAngularVelocity = function(body, velocity) {
                  var timeScale = body.deltaTime / Body._baseDelta;
                  body.anglePrev = body.angle - velocity * timeScale;
                  body.angularVelocity = (body.angle - body.anglePrev) / timeScale;
                  body.angularSpeed = Math.abs(body.angularVelocity);
                };
                Body.getAngularVelocity = function(body) {
                  return (body.angle - body.anglePrev) * Body._baseDelta / body.deltaTime;
                };
                Body.getAngularSpeed = function(body) {
                  return Math.abs(Body.getAngularVelocity(body));
                };
                Body.setAngularSpeed = function(body, speed) {
                  Body.setAngularVelocity(body, Common.sign(Body.getAngularVelocity(body)) * speed);
                };
                Body.translate = function(body, translation, updateVelocity) {
                  Body.setPosition(body, Vector.add(body.position, translation), updateVelocity);
                };
                Body.rotate = function(body, rotation, point, updateVelocity) {
                  if (!point) {
                    Body.setAngle(body, body.angle + rotation, updateVelocity);
                  } else {
                    var cos = Math.cos(rotation), sin = Math.sin(rotation), dx = body.position.x - point.x, dy = body.position.y - point.y;
                    Body.setPosition(body, {
                      x: point.x + (dx * cos - dy * sin),
                      y: point.y + (dx * sin + dy * cos)
                    }, updateVelocity);
                    Body.setAngle(body, body.angle + rotation, updateVelocity);
                  }
                };
                Body.scale = function(body, scaleX, scaleY, point) {
                  var totalArea = 0, totalInertia = 0;
                  point = point || body.position;
                  for (var i = 0; i < body.parts.length; i++) {
                    var part = body.parts[i];
                    Vertices.scale(part.vertices, scaleX, scaleY, point);
                    part.axes = Axes.fromVertices(part.vertices);
                    part.area = Vertices.area(part.vertices);
                    Body.setMass(part, body.density * part.area);
                    Vertices.translate(part.vertices, { x: -part.position.x, y: -part.position.y });
                    Body.setInertia(part, Body._inertiaScale * Vertices.inertia(part.vertices, part.mass));
                    Vertices.translate(part.vertices, { x: part.position.x, y: part.position.y });
                    if (i > 0) {
                      totalArea += part.area;
                      totalInertia += part.inertia;
                    }
                    part.position.x = point.x + (part.position.x - point.x) * scaleX;
                    part.position.y = point.y + (part.position.y - point.y) * scaleY;
                    Bounds.update(part.bounds, part.vertices, body.velocity);
                  }
                  if (body.parts.length > 1) {
                    body.area = totalArea;
                    if (!body.isStatic) {
                      Body.setMass(body, body.density * totalArea);
                      Body.setInertia(body, totalInertia);
                    }
                  }
                  if (body.circleRadius) {
                    if (scaleX === scaleY) {
                      body.circleRadius *= scaleX;
                    } else {
                      body.circleRadius = null;
                    }
                  }
                };
                Body.update = function(body, deltaTime) {
                  deltaTime = (typeof deltaTime !== "undefined" ? deltaTime : 1e3 / 60) * body.timeScale;
                  var deltaTimeSquared = deltaTime * deltaTime, correction = Body._timeCorrection ? deltaTime / (body.deltaTime || deltaTime) : 1;
                  var frictionAir = 1 - body.frictionAir * (deltaTime / Common._baseDelta), velocityPrevX = (body.position.x - body.positionPrev.x) * correction, velocityPrevY = (body.position.y - body.positionPrev.y) * correction;
                  body.velocity.x = velocityPrevX * frictionAir + body.force.x / body.mass * deltaTimeSquared;
                  body.velocity.y = velocityPrevY * frictionAir + body.force.y / body.mass * deltaTimeSquared;
                  body.positionPrev.x = body.position.x;
                  body.positionPrev.y = body.position.y;
                  body.position.x += body.velocity.x;
                  body.position.y += body.velocity.y;
                  body.deltaTime = deltaTime;
                  body.angularVelocity = (body.angle - body.anglePrev) * frictionAir * correction + body.torque / body.inertia * deltaTimeSquared;
                  body.anglePrev = body.angle;
                  body.angle += body.angularVelocity;
                  for (var i = 0; i < body.parts.length; i++) {
                    var part = body.parts[i];
                    Vertices.translate(part.vertices, body.velocity);
                    if (i > 0) {
                      part.position.x += body.velocity.x;
                      part.position.y += body.velocity.y;
                    }
                    if (body.angularVelocity !== 0) {
                      Vertices.rotate(part.vertices, body.angularVelocity, body.position);
                      Axes.rotate(part.axes, body.angularVelocity);
                      if (i > 0) {
                        Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
                      }
                    }
                    Bounds.update(part.bounds, part.vertices, body.velocity);
                  }
                };
                Body.updateVelocities = function(body) {
                  var timeScale = Body._baseDelta / body.deltaTime, bodyVelocity = body.velocity;
                  bodyVelocity.x = (body.position.x - body.positionPrev.x) * timeScale;
                  bodyVelocity.y = (body.position.y - body.positionPrev.y) * timeScale;
                  body.speed = Math.sqrt(bodyVelocity.x * bodyVelocity.x + bodyVelocity.y * bodyVelocity.y);
                  body.angularVelocity = (body.angle - body.anglePrev) * timeScale;
                  body.angularSpeed = Math.abs(body.angularVelocity);
                };
                Body.applyForce = function(body, position, force) {
                  var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
                  body.force.x += force.x;
                  body.force.y += force.y;
                  body.torque += offset.x * force.y - offset.y * force.x;
                };
                Body._totalProperties = function(body) {
                  var properties = {
                    mass: 0,
                    area: 0,
                    inertia: 0,
                    centre: { x: 0, y: 0 }
                  };
                  for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
                    var part = body.parts[i], mass = part.mass !== Infinity ? part.mass : 1;
                    properties.mass += mass;
                    properties.area += part.area;
                    properties.inertia += part.inertia;
                    properties.centre = Vector.add(properties.centre, Vector.mult(part.position, mass));
                  }
                  properties.centre = Vector.div(properties.centre, properties.mass);
                  return properties;
                };
              })();
            }),
            /* 5 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Events = {};
              module2.exports = Events;
              var Common = __webpack_require__(0);
              (function() {
                Events.on = function(object, eventNames, callback) {
                  var names = eventNames.split(" "), name;
                  for (var i = 0; i < names.length; i++) {
                    name = names[i];
                    object.events = object.events || {};
                    object.events[name] = object.events[name] || [];
                    object.events[name].push(callback);
                  }
                  return callback;
                };
                Events.off = function(object, eventNames, callback) {
                  if (!eventNames) {
                    object.events = {};
                    return;
                  }
                  if (typeof eventNames === "function") {
                    callback = eventNames;
                    eventNames = Common.keys(object.events).join(" ");
                  }
                  var names = eventNames.split(" ");
                  for (var i = 0; i < names.length; i++) {
                    var callbacks = object.events[names[i]], newCallbacks = [];
                    if (callback && callbacks) {
                      for (var j = 0; j < callbacks.length; j++) {
                        if (callbacks[j] !== callback)
                          newCallbacks.push(callbacks[j]);
                      }
                    }
                    object.events[names[i]] = newCallbacks;
                  }
                };
                Events.trigger = function(object, eventNames, event) {
                  var names, name, callbacks, eventClone;
                  var events = object.events;
                  if (events && Common.keys(events).length > 0) {
                    if (!event)
                      event = {};
                    names = eventNames.split(" ");
                    for (var i = 0; i < names.length; i++) {
                      name = names[i];
                      callbacks = events[name];
                      if (callbacks) {
                        eventClone = Common.clone(event, false);
                        eventClone.name = name;
                        eventClone.source = object;
                        for (var j = 0; j < callbacks.length; j++) {
                          callbacks[j].apply(object, [eventClone]);
                        }
                      }
                    }
                  }
                };
              })();
            }),
            /* 6 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Composite = {};
              module2.exports = Composite;
              var Events = __webpack_require__(5);
              var Common = __webpack_require__(0);
              var Bounds = __webpack_require__(1);
              var Body = __webpack_require__(4);
              (function() {
                Composite.create = function(options) {
                  return Common.extend({
                    id: Common.nextId(),
                    type: "composite",
                    parent: null,
                    isModified: false,
                    bodies: [],
                    constraints: [],
                    composites: [],
                    label: "Composite",
                    plugin: {},
                    cache: {
                      allBodies: null,
                      allConstraints: null,
                      allComposites: null
                    }
                  }, options);
                };
                Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
                  composite.isModified = isModified;
                  if (isModified && composite.cache) {
                    composite.cache.allBodies = null;
                    composite.cache.allConstraints = null;
                    composite.cache.allComposites = null;
                  }
                  if (updateParents && composite.parent) {
                    Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
                  }
                  if (updateChildren) {
                    for (var i = 0; i < composite.composites.length; i++) {
                      var childComposite = composite.composites[i];
                      Composite.setModified(childComposite, isModified, updateParents, updateChildren);
                    }
                  }
                };
                Composite.add = function(composite, object) {
                  var objects = [].concat(object);
                  Events.trigger(composite, "beforeAdd", { object });
                  for (var i = 0; i < objects.length; i++) {
                    var obj = objects[i];
                    switch (obj.type) {
                      case "body":
                        if (obj.parent !== obj) {
                          Common.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                          break;
                        }
                        Composite.addBody(composite, obj);
                        break;
                      case "constraint":
                        Composite.addConstraint(composite, obj);
                        break;
                      case "composite":
                        Composite.addComposite(composite, obj);
                        break;
                      case "mouseConstraint":
                        Composite.addConstraint(composite, obj.constraint);
                        break;
                    }
                  }
                  Events.trigger(composite, "afterAdd", { object });
                  return composite;
                };
                Composite.remove = function(composite, object, deep) {
                  var objects = [].concat(object);
                  Events.trigger(composite, "beforeRemove", { object });
                  for (var i = 0; i < objects.length; i++) {
                    var obj = objects[i];
                    switch (obj.type) {
                      case "body":
                        Composite.removeBody(composite, obj, deep);
                        break;
                      case "constraint":
                        Composite.removeConstraint(composite, obj, deep);
                        break;
                      case "composite":
                        Composite.removeComposite(composite, obj, deep);
                        break;
                      case "mouseConstraint":
                        Composite.removeConstraint(composite, obj.constraint);
                        break;
                    }
                  }
                  Events.trigger(composite, "afterRemove", { object });
                  return composite;
                };
                Composite.addComposite = function(compositeA, compositeB) {
                  compositeA.composites.push(compositeB);
                  compositeB.parent = compositeA;
                  Composite.setModified(compositeA, true, true, false);
                  return compositeA;
                };
                Composite.removeComposite = function(compositeA, compositeB, deep) {
                  var position = Common.indexOf(compositeA.composites, compositeB);
                  if (position !== -1) {
                    Composite.removeCompositeAt(compositeA, position);
                  }
                  if (deep) {
                    for (var i = 0; i < compositeA.composites.length; i++) {
                      Composite.removeComposite(compositeA.composites[i], compositeB, true);
                    }
                  }
                  return compositeA;
                };
                Composite.removeCompositeAt = function(composite, position) {
                  composite.composites.splice(position, 1);
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.addBody = function(composite, body) {
                  composite.bodies.push(body);
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.removeBody = function(composite, body, deep) {
                  var position = Common.indexOf(composite.bodies, body);
                  if (position !== -1) {
                    Composite.removeBodyAt(composite, position);
                  }
                  if (deep) {
                    for (var i = 0; i < composite.composites.length; i++) {
                      Composite.removeBody(composite.composites[i], body, true);
                    }
                  }
                  return composite;
                };
                Composite.removeBodyAt = function(composite, position) {
                  composite.bodies.splice(position, 1);
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.addConstraint = function(composite, constraint) {
                  composite.constraints.push(constraint);
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.removeConstraint = function(composite, constraint, deep) {
                  var position = Common.indexOf(composite.constraints, constraint);
                  if (position !== -1) {
                    Composite.removeConstraintAt(composite, position);
                  }
                  if (deep) {
                    for (var i = 0; i < composite.composites.length; i++) {
                      Composite.removeConstraint(composite.composites[i], constraint, true);
                    }
                  }
                  return composite;
                };
                Composite.removeConstraintAt = function(composite, position) {
                  composite.constraints.splice(position, 1);
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.clear = function(composite, keepStatic, deep) {
                  if (deep) {
                    for (var i = 0; i < composite.composites.length; i++) {
                      Composite.clear(composite.composites[i], keepStatic, true);
                    }
                  }
                  if (keepStatic) {
                    composite.bodies = composite.bodies.filter(function(body) {
                      return body.isStatic;
                    });
                  } else {
                    composite.bodies.length = 0;
                  }
                  composite.constraints.length = 0;
                  composite.composites.length = 0;
                  Composite.setModified(composite, true, true, false);
                  return composite;
                };
                Composite.allBodies = function(composite) {
                  if (composite.cache && composite.cache.allBodies) {
                    return composite.cache.allBodies;
                  }
                  var bodies = [].concat(composite.bodies);
                  for (var i = 0; i < composite.composites.length; i++)
                    bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
                  if (composite.cache) {
                    composite.cache.allBodies = bodies;
                  }
                  return bodies;
                };
                Composite.allConstraints = function(composite) {
                  if (composite.cache && composite.cache.allConstraints) {
                    return composite.cache.allConstraints;
                  }
                  var constraints = [].concat(composite.constraints);
                  for (var i = 0; i < composite.composites.length; i++)
                    constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
                  if (composite.cache) {
                    composite.cache.allConstraints = constraints;
                  }
                  return constraints;
                };
                Composite.allComposites = function(composite) {
                  if (composite.cache && composite.cache.allComposites) {
                    return composite.cache.allComposites;
                  }
                  var composites = [].concat(composite.composites);
                  for (var i = 0; i < composite.composites.length; i++)
                    composites = composites.concat(Composite.allComposites(composite.composites[i]));
                  if (composite.cache) {
                    composite.cache.allComposites = composites;
                  }
                  return composites;
                };
                Composite.get = function(composite, id, type) {
                  var objects, object;
                  switch (type) {
                    case "body":
                      objects = Composite.allBodies(composite);
                      break;
                    case "constraint":
                      objects = Composite.allConstraints(composite);
                      break;
                    case "composite":
                      objects = Composite.allComposites(composite).concat(composite);
                      break;
                  }
                  if (!objects)
                    return null;
                  object = objects.filter(function(object2) {
                    return object2.id.toString() === id.toString();
                  });
                  return object.length === 0 ? null : object[0];
                };
                Composite.move = function(compositeA, objects, compositeB) {
                  Composite.remove(compositeA, objects);
                  Composite.add(compositeB, objects);
                  return compositeA;
                };
                Composite.rebase = function(composite) {
                  var objects = Composite.allBodies(composite).concat(Composite.allConstraints(composite)).concat(Composite.allComposites(composite));
                  for (var i = 0; i < objects.length; i++) {
                    objects[i].id = Common.nextId();
                  }
                  return composite;
                };
                Composite.translate = function(composite, translation, recursive) {
                  var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                  for (var i = 0; i < bodies.length; i++) {
                    Body.translate(bodies[i], translation);
                  }
                  return composite;
                };
                Composite.rotate = function(composite, rotation, point, recursive) {
                  var cos = Math.cos(rotation), sin = Math.sin(rotation), bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                    Body.setPosition(body, {
                      x: point.x + (dx * cos - dy * sin),
                      y: point.y + (dx * sin + dy * cos)
                    });
                    Body.rotate(body, rotation);
                  }
                  return composite;
                };
                Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
                  var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                    Body.setPosition(body, {
                      x: point.x + dx * scaleX,
                      y: point.y + dy * scaleY
                    });
                    Body.scale(body, scaleX, scaleY);
                  }
                  return composite;
                };
                Composite.bounds = function(composite) {
                  var bodies = Composite.allBodies(composite), vertices = [];
                  for (var i = 0; i < bodies.length; i += 1) {
                    var body = bodies[i];
                    vertices.push(body.bounds.min, body.bounds.max);
                  }
                  return Bounds.create(vertices);
                };
              })();
            }),
            /* 7 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Sleeping = {};
              module2.exports = Sleeping;
              var Body = __webpack_require__(4);
              var Events = __webpack_require__(5);
              var Common = __webpack_require__(0);
              (function() {
                Sleeping._motionWakeThreshold = 0.18;
                Sleeping._motionSleepThreshold = 0.08;
                Sleeping._minBias = 0.9;
                Sleeping.update = function(bodies, delta) {
                  var timeScale = delta / Common._baseDelta, motionSleepThreshold = Sleeping._motionSleepThreshold;
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i], speed = Body.getSpeed(body), angularSpeed = Body.getAngularSpeed(body), motion = speed * speed + angularSpeed * angularSpeed;
                    if (body.force.x !== 0 || body.force.y !== 0) {
                      Sleeping.set(body, false);
                      continue;
                    }
                    var minMotion = Math.min(body.motion, motion), maxMotion = Math.max(body.motion, motion);
                    body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
                    if (body.sleepThreshold > 0 && body.motion < motionSleepThreshold) {
                      body.sleepCounter += 1;
                      if (body.sleepCounter >= body.sleepThreshold / timeScale) {
                        Sleeping.set(body, true);
                      }
                    } else if (body.sleepCounter > 0) {
                      body.sleepCounter -= 1;
                    }
                  }
                };
                Sleeping.afterCollisions = function(pairs) {
                  var motionSleepThreshold = Sleeping._motionSleepThreshold;
                  for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i];
                    if (!pair.isActive)
                      continue;
                    var collision = pair.collision, bodyA = collision.bodyA.parent, bodyB = collision.bodyB.parent;
                    if (bodyA.isSleeping && bodyB.isSleeping || bodyA.isStatic || bodyB.isStatic)
                      continue;
                    if (bodyA.isSleeping || bodyB.isSleeping) {
                      var sleepingBody = bodyA.isSleeping && !bodyA.isStatic ? bodyA : bodyB, movingBody = sleepingBody === bodyA ? bodyB : bodyA;
                      if (!sleepingBody.isStatic && movingBody.motion > motionSleepThreshold) {
                        Sleeping.set(sleepingBody, false);
                      }
                    }
                  }
                };
                Sleeping.set = function(body, isSleeping) {
                  var wasSleeping = body.isSleeping;
                  if (isSleeping) {
                    body.isSleeping = true;
                    body.sleepCounter = body.sleepThreshold;
                    body.positionImpulse.x = 0;
                    body.positionImpulse.y = 0;
                    body.positionPrev.x = body.position.x;
                    body.positionPrev.y = body.position.y;
                    body.anglePrev = body.angle;
                    body.speed = 0;
                    body.angularSpeed = 0;
                    body.motion = 0;
                    if (!wasSleeping) {
                      Events.trigger(body, "sleepStart");
                    }
                  } else {
                    body.isSleeping = false;
                    body.sleepCounter = 0;
                    if (wasSleeping) {
                      Events.trigger(body, "sleepEnd");
                    }
                  }
                };
              })();
            }),
            /* 8 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Collision = {};
              module2.exports = Collision;
              var Vertices = __webpack_require__(3);
              var Pair = __webpack_require__(9);
              (function() {
                var _supports = [];
                var _overlapAB = {
                  overlap: 0,
                  axis: null
                };
                var _overlapBA = {
                  overlap: 0,
                  axis: null
                };
                Collision.create = function(bodyA, bodyB) {
                  return {
                    pair: null,
                    collided: false,
                    bodyA,
                    bodyB,
                    parentA: bodyA.parent,
                    parentB: bodyB.parent,
                    depth: 0,
                    normal: { x: 0, y: 0 },
                    tangent: { x: 0, y: 0 },
                    penetration: { x: 0, y: 0 },
                    supports: []
                  };
                };
                Collision.collides = function(bodyA, bodyB, pairs) {
                  Collision._overlapAxes(_overlapAB, bodyA.vertices, bodyB.vertices, bodyA.axes);
                  if (_overlapAB.overlap <= 0) {
                    return null;
                  }
                  Collision._overlapAxes(_overlapBA, bodyB.vertices, bodyA.vertices, bodyB.axes);
                  if (_overlapBA.overlap <= 0) {
                    return null;
                  }
                  var pair = pairs && pairs.table[Pair.id(bodyA, bodyB)], collision;
                  if (!pair) {
                    collision = Collision.create(bodyA, bodyB);
                    collision.collided = true;
                    collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
                    collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
                    collision.parentA = collision.bodyA.parent;
                    collision.parentB = collision.bodyB.parent;
                  } else {
                    collision = pair.collision;
                  }
                  bodyA = collision.bodyA;
                  bodyB = collision.bodyB;
                  var minOverlap;
                  if (_overlapAB.overlap < _overlapBA.overlap) {
                    minOverlap = _overlapAB;
                  } else {
                    minOverlap = _overlapBA;
                  }
                  var normal = collision.normal, supports = collision.supports, minAxis = minOverlap.axis, minAxisX = minAxis.x, minAxisY = minAxis.y;
                  if (minAxisX * (bodyB.position.x - bodyA.position.x) + minAxisY * (bodyB.position.y - bodyA.position.y) < 0) {
                    normal.x = minAxisX;
                    normal.y = minAxisY;
                  } else {
                    normal.x = -minAxisX;
                    normal.y = -minAxisY;
                  }
                  collision.tangent.x = -normal.y;
                  collision.tangent.y = normal.x;
                  collision.depth = minOverlap.overlap;
                  collision.penetration.x = normal.x * collision.depth;
                  collision.penetration.y = normal.y * collision.depth;
                  var supportsB = Collision._findSupports(bodyA, bodyB, normal, 1), supportCount = 0;
                  if (Vertices.contains(bodyA.vertices, supportsB[0])) {
                    supports[supportCount++] = supportsB[0];
                  }
                  if (Vertices.contains(bodyA.vertices, supportsB[1])) {
                    supports[supportCount++] = supportsB[1];
                  }
                  if (supportCount < 2) {
                    var supportsA = Collision._findSupports(bodyB, bodyA, normal, -1);
                    if (Vertices.contains(bodyB.vertices, supportsA[0])) {
                      supports[supportCount++] = supportsA[0];
                    }
                    if (supportCount < 2 && Vertices.contains(bodyB.vertices, supportsA[1])) {
                      supports[supportCount++] = supportsA[1];
                    }
                  }
                  if (supportCount === 0) {
                    supports[supportCount++] = supportsB[0];
                  }
                  supports.length = supportCount;
                  return collision;
                };
                Collision._overlapAxes = function(result, verticesA, verticesB, axes) {
                  var verticesALength = verticesA.length, verticesBLength = verticesB.length, verticesAX = verticesA[0].x, verticesAY = verticesA[0].y, verticesBX = verticesB[0].x, verticesBY = verticesB[0].y, axesLength = axes.length, overlapMin = Number.MAX_VALUE, overlapAxisNumber = 0, overlap, overlapAB, overlapBA, dot, i, j;
                  for (i = 0; i < axesLength; i++) {
                    var axis = axes[i], axisX = axis.x, axisY = axis.y, minA = verticesAX * axisX + verticesAY * axisY, minB = verticesBX * axisX + verticesBY * axisY, maxA = minA, maxB = minB;
                    for (j = 1; j < verticesALength; j += 1) {
                      dot = verticesA[j].x * axisX + verticesA[j].y * axisY;
                      if (dot > maxA) {
                        maxA = dot;
                      } else if (dot < minA) {
                        minA = dot;
                      }
                    }
                    for (j = 1; j < verticesBLength; j += 1) {
                      dot = verticesB[j].x * axisX + verticesB[j].y * axisY;
                      if (dot > maxB) {
                        maxB = dot;
                      } else if (dot < minB) {
                        minB = dot;
                      }
                    }
                    overlapAB = maxA - minB;
                    overlapBA = maxB - minA;
                    overlap = overlapAB < overlapBA ? overlapAB : overlapBA;
                    if (overlap < overlapMin) {
                      overlapMin = overlap;
                      overlapAxisNumber = i;
                      if (overlap <= 0) {
                        break;
                      }
                    }
                  }
                  result.axis = axes[overlapAxisNumber];
                  result.overlap = overlapMin;
                };
                Collision._projectToAxis = function(projection, vertices, axis) {
                  var min = vertices[0].x * axis.x + vertices[0].y * axis.y, max = min;
                  for (var i = 1; i < vertices.length; i += 1) {
                    var dot = vertices[i].x * axis.x + vertices[i].y * axis.y;
                    if (dot > max) {
                      max = dot;
                    } else if (dot < min) {
                      min = dot;
                    }
                  }
                  projection.min = min;
                  projection.max = max;
                };
                Collision._findSupports = function(bodyA, bodyB, normal, direction) {
                  var vertices = bodyB.vertices, verticesLength = vertices.length, bodyAPositionX = bodyA.position.x, bodyAPositionY = bodyA.position.y, normalX = normal.x * direction, normalY = normal.y * direction, nearestDistance = Number.MAX_VALUE, vertexA, vertexB, vertexC, distance, j;
                  for (j = 0; j < verticesLength; j += 1) {
                    vertexB = vertices[j];
                    distance = normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y);
                    if (distance < nearestDistance) {
                      nearestDistance = distance;
                      vertexA = vertexB;
                    }
                  }
                  vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength];
                  nearestDistance = normalX * (bodyAPositionX - vertexC.x) + normalY * (bodyAPositionY - vertexC.y);
                  vertexB = vertices[(vertexA.index + 1) % verticesLength];
                  if (normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y) < nearestDistance) {
                    _supports[0] = vertexA;
                    _supports[1] = vertexB;
                    return _supports;
                  }
                  _supports[0] = vertexA;
                  _supports[1] = vertexC;
                  return _supports;
                };
              })();
            }),
            /* 9 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Pair = {};
              module2.exports = Pair;
              var Contact = __webpack_require__(16);
              (function() {
                Pair.create = function(collision, timestamp) {
                  var bodyA = collision.bodyA, bodyB = collision.bodyB;
                  var pair = {
                    id: Pair.id(bodyA, bodyB),
                    bodyA,
                    bodyB,
                    collision,
                    contacts: [],
                    activeContacts: [],
                    separation: 0,
                    isActive: true,
                    confirmedActive: true,
                    isSensor: bodyA.isSensor || bodyB.isSensor,
                    timeCreated: timestamp,
                    timeUpdated: timestamp,
                    inverseMass: 0,
                    friction: 0,
                    frictionStatic: 0,
                    restitution: 0,
                    slop: 0
                  };
                  Pair.update(pair, collision, timestamp);
                  return pair;
                };
                Pair.update = function(pair, collision, timestamp) {
                  var contacts = pair.contacts, supports = collision.supports, activeContacts = pair.activeContacts, parentA = collision.parentA, parentB = collision.parentB, parentAVerticesLength = parentA.vertices.length;
                  pair.isActive = true;
                  pair.timeUpdated = timestamp;
                  pair.collision = collision;
                  pair.separation = collision.depth;
                  pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
                  pair.friction = parentA.friction < parentB.friction ? parentA.friction : parentB.friction;
                  pair.frictionStatic = parentA.frictionStatic > parentB.frictionStatic ? parentA.frictionStatic : parentB.frictionStatic;
                  pair.restitution = parentA.restitution > parentB.restitution ? parentA.restitution : parentB.restitution;
                  pair.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop;
                  collision.pair = pair;
                  activeContacts.length = 0;
                  for (var i = 0; i < supports.length; i++) {
                    var support = supports[i], contactId = support.body === parentA ? support.index : parentAVerticesLength + support.index, contact = contacts[contactId];
                    if (contact) {
                      activeContacts.push(contact);
                    } else {
                      activeContacts.push(contacts[contactId] = Contact.create(support));
                    }
                  }
                };
                Pair.setActive = function(pair, isActive, timestamp) {
                  if (isActive) {
                    pair.isActive = true;
                    pair.timeUpdated = timestamp;
                  } else {
                    pair.isActive = false;
                    pair.activeContacts.length = 0;
                  }
                };
                Pair.id = function(bodyA, bodyB) {
                  if (bodyA.id < bodyB.id) {
                    return "A" + bodyA.id + "B" + bodyB.id;
                  } else {
                    return "A" + bodyB.id + "B" + bodyA.id;
                  }
                };
              })();
            }),
            /* 10 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Constraint = {};
              module2.exports = Constraint;
              var Vertices = __webpack_require__(3);
              var Vector = __webpack_require__(2);
              var Sleeping = __webpack_require__(7);
              var Bounds = __webpack_require__(1);
              var Axes = __webpack_require__(11);
              var Common = __webpack_require__(0);
              (function() {
                Constraint._warming = 0.4;
                Constraint._torqueDampen = 1;
                Constraint._minLength = 1e-6;
                Constraint.create = function(options) {
                  var constraint = options;
                  if (constraint.bodyA && !constraint.pointA)
                    constraint.pointA = { x: 0, y: 0 };
                  if (constraint.bodyB && !constraint.pointB)
                    constraint.pointB = { x: 0, y: 0 };
                  var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA, initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB, length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
                  constraint.length = typeof constraint.length !== "undefined" ? constraint.length : length;
                  constraint.id = constraint.id || Common.nextId();
                  constraint.label = constraint.label || "Constraint";
                  constraint.type = "constraint";
                  constraint.stiffness = constraint.stiffness || (constraint.length > 0 ? 1 : 0.7);
                  constraint.damping = constraint.damping || 0;
                  constraint.angularStiffness = constraint.angularStiffness || 0;
                  constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
                  constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
                  constraint.plugin = {};
                  var render = {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: "#ffffff",
                    type: "line",
                    anchors: true
                  };
                  if (constraint.length === 0 && constraint.stiffness > 0.1) {
                    render.type = "pin";
                    render.anchors = false;
                  } else if (constraint.stiffness < 0.9) {
                    render.type = "spring";
                  }
                  constraint.render = Common.extend(render, constraint.render);
                  return constraint;
                };
                Constraint.preSolveAll = function(bodies) {
                  for (var i = 0; i < bodies.length; i += 1) {
                    var body = bodies[i], impulse = body.constraintImpulse;
                    if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
                      continue;
                    }
                    body.position.x += impulse.x;
                    body.position.y += impulse.y;
                    body.angle += impulse.angle;
                  }
                };
                Constraint.solveAll = function(constraints, delta) {
                  var timeScale = Common.clamp(delta / Common._baseDelta, 0, 1);
                  for (var i = 0; i < constraints.length; i += 1) {
                    var constraint = constraints[i], fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic, fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
                    if (fixedA || fixedB) {
                      Constraint.solve(constraints[i], timeScale);
                    }
                  }
                  for (i = 0; i < constraints.length; i += 1) {
                    constraint = constraints[i];
                    fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic;
                    fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
                    if (!fixedA && !fixedB) {
                      Constraint.solve(constraints[i], timeScale);
                    }
                  }
                };
                Constraint.solve = function(constraint, timeScale) {
                  var bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointA = constraint.pointA, pointB = constraint.pointB;
                  if (!bodyA && !bodyB)
                    return;
                  if (bodyA && !bodyA.isStatic) {
                    Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA);
                    constraint.angleA = bodyA.angle;
                  }
                  if (bodyB && !bodyB.isStatic) {
                    Vector.rotate(pointB, bodyB.angle - constraint.angleB, pointB);
                    constraint.angleB = bodyB.angle;
                  }
                  var pointAWorld = pointA, pointBWorld = pointB;
                  if (bodyA) pointAWorld = Vector.add(bodyA.position, pointA);
                  if (bodyB) pointBWorld = Vector.add(bodyB.position, pointB);
                  if (!pointAWorld || !pointBWorld)
                    return;
                  var delta = Vector.sub(pointAWorld, pointBWorld), currentLength = Vector.magnitude(delta);
                  if (currentLength < Constraint._minLength) {
                    currentLength = Constraint._minLength;
                  }
                  var difference = (currentLength - constraint.length) / currentLength, isRigid = constraint.stiffness >= 1 || constraint.length === 0, stiffness = isRigid ? constraint.stiffness * timeScale : constraint.stiffness * timeScale * timeScale, damping = constraint.damping * timeScale, force = Vector.mult(delta, difference * stiffness), massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0), inertiaTotal = (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0), resistanceTotal = massTotal + inertiaTotal, torque, share, normal, normalVelocity, relativeVelocity;
                  if (damping > 0) {
                    var zero = Vector.create();
                    normal = Vector.div(delta, currentLength);
                    relativeVelocity = Vector.sub(
                      bodyB && Vector.sub(bodyB.position, bodyB.positionPrev) || zero,
                      bodyA && Vector.sub(bodyA.position, bodyA.positionPrev) || zero
                    );
                    normalVelocity = Vector.dot(normal, relativeVelocity);
                  }
                  if (bodyA && !bodyA.isStatic) {
                    share = bodyA.inverseMass / massTotal;
                    bodyA.constraintImpulse.x -= force.x * share;
                    bodyA.constraintImpulse.y -= force.y * share;
                    bodyA.position.x -= force.x * share;
                    bodyA.position.y -= force.y * share;
                    if (damping > 0) {
                      bodyA.positionPrev.x -= damping * normal.x * normalVelocity * share;
                      bodyA.positionPrev.y -= damping * normal.y * normalVelocity * share;
                    }
                    torque = Vector.cross(pointA, force) / resistanceTotal * Constraint._torqueDampen * bodyA.inverseInertia * (1 - constraint.angularStiffness);
                    bodyA.constraintImpulse.angle -= torque;
                    bodyA.angle -= torque;
                  }
                  if (bodyB && !bodyB.isStatic) {
                    share = bodyB.inverseMass / massTotal;
                    bodyB.constraintImpulse.x += force.x * share;
                    bodyB.constraintImpulse.y += force.y * share;
                    bodyB.position.x += force.x * share;
                    bodyB.position.y += force.y * share;
                    if (damping > 0) {
                      bodyB.positionPrev.x += damping * normal.x * normalVelocity * share;
                      bodyB.positionPrev.y += damping * normal.y * normalVelocity * share;
                    }
                    torque = Vector.cross(pointB, force) / resistanceTotal * Constraint._torqueDampen * bodyB.inverseInertia * (1 - constraint.angularStiffness);
                    bodyB.constraintImpulse.angle += torque;
                    bodyB.angle += torque;
                  }
                };
                Constraint.postSolveAll = function(bodies) {
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i], impulse = body.constraintImpulse;
                    if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
                      continue;
                    }
                    Sleeping.set(body, false);
                    for (var j = 0; j < body.parts.length; j++) {
                      var part = body.parts[j];
                      Vertices.translate(part.vertices, impulse);
                      if (j > 0) {
                        part.position.x += impulse.x;
                        part.position.y += impulse.y;
                      }
                      if (impulse.angle !== 0) {
                        Vertices.rotate(part.vertices, impulse.angle, body.position);
                        Axes.rotate(part.axes, impulse.angle);
                        if (j > 0) {
                          Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
                        }
                      }
                      Bounds.update(part.bounds, part.vertices, body.velocity);
                    }
                    impulse.angle *= Constraint._warming;
                    impulse.x *= Constraint._warming;
                    impulse.y *= Constraint._warming;
                  }
                };
                Constraint.pointAWorld = function(constraint) {
                  return {
                    x: (constraint.bodyA ? constraint.bodyA.position.x : 0) + (constraint.pointA ? constraint.pointA.x : 0),
                    y: (constraint.bodyA ? constraint.bodyA.position.y : 0) + (constraint.pointA ? constraint.pointA.y : 0)
                  };
                };
                Constraint.pointBWorld = function(constraint) {
                  return {
                    x: (constraint.bodyB ? constraint.bodyB.position.x : 0) + (constraint.pointB ? constraint.pointB.x : 0),
                    y: (constraint.bodyB ? constraint.bodyB.position.y : 0) + (constraint.pointB ? constraint.pointB.y : 0)
                  };
                };
              })();
            }),
            /* 11 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Axes = {};
              module2.exports = Axes;
              var Vector = __webpack_require__(2);
              var Common = __webpack_require__(0);
              (function() {
                Axes.fromVertices = function(vertices) {
                  var axes = {};
                  for (var i = 0; i < vertices.length; i++) {
                    var j = (i + 1) % vertices.length, normal = Vector.normalise({
                      x: vertices[j].y - vertices[i].y,
                      y: vertices[i].x - vertices[j].x
                    }), gradient = normal.y === 0 ? Infinity : normal.x / normal.y;
                    gradient = gradient.toFixed(3).toString();
                    axes[gradient] = normal;
                  }
                  return Common.values(axes);
                };
                Axes.rotate = function(axes, angle) {
                  if (angle === 0)
                    return;
                  var cos = Math.cos(angle), sin = Math.sin(angle);
                  for (var i = 0; i < axes.length; i++) {
                    var axis = axes[i], xx;
                    xx = axis.x * cos - axis.y * sin;
                    axis.y = axis.x * sin + axis.y * cos;
                    axis.x = xx;
                  }
                };
              })();
            }),
            /* 12 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Bodies = {};
              module2.exports = Bodies;
              var Vertices = __webpack_require__(3);
              var Common = __webpack_require__(0);
              var Body = __webpack_require__(4);
              var Bounds = __webpack_require__(1);
              var Vector = __webpack_require__(2);
              (function() {
                Bodies.rectangle = function(x, y, width, height, options) {
                  options = options || {};
                  var rectangle = {
                    label: "Rectangle Body",
                    position: { x, y },
                    vertices: Vertices.fromPath("L 0 0 L " + width + " 0 L " + width + " " + height + " L 0 " + height)
                  };
                  if (options.chamfer) {
                    var chamfer = options.chamfer;
                    rectangle.vertices = Vertices.chamfer(
                      rectangle.vertices,
                      chamfer.radius,
                      chamfer.quality,
                      chamfer.qualityMin,
                      chamfer.qualityMax
                    );
                    delete options.chamfer;
                  }
                  return Body.create(Common.extend({}, rectangle, options));
                };
                Bodies.trapezoid = function(x, y, width, height, slope, options) {
                  options = options || {};
                  slope *= 0.5;
                  var roof = (1 - slope * 2) * width;
                  var x1 = width * slope, x2 = x1 + roof, x3 = x2 + x1, verticesPath;
                  if (slope < 0.5) {
                    verticesPath = "L 0 0 L " + x1 + " " + -height + " L " + x2 + " " + -height + " L " + x3 + " 0";
                  } else {
                    verticesPath = "L 0 0 L " + x2 + " " + -height + " L " + x3 + " 0";
                  }
                  var trapezoid = {
                    label: "Trapezoid Body",
                    position: { x, y },
                    vertices: Vertices.fromPath(verticesPath)
                  };
                  if (options.chamfer) {
                    var chamfer = options.chamfer;
                    trapezoid.vertices = Vertices.chamfer(
                      trapezoid.vertices,
                      chamfer.radius,
                      chamfer.quality,
                      chamfer.qualityMin,
                      chamfer.qualityMax
                    );
                    delete options.chamfer;
                  }
                  return Body.create(Common.extend({}, trapezoid, options));
                };
                Bodies.circle = function(x, y, radius, options, maxSides) {
                  options = options || {};
                  var circle = {
                    label: "Circle Body",
                    circleRadius: radius
                  };
                  maxSides = maxSides || 25;
                  var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
                  if (sides % 2 === 1)
                    sides += 1;
                  return Bodies.polygon(x, y, sides, radius, Common.extend({}, circle, options));
                };
                Bodies.polygon = function(x, y, sides, radius, options) {
                  options = options || {};
                  if (sides < 3)
                    return Bodies.circle(x, y, radius, options);
                  var theta = 2 * Math.PI / sides, path = "", offset = theta * 0.5;
                  for (var i = 0; i < sides; i += 1) {
                    var angle = offset + i * theta, xx = Math.cos(angle) * radius, yy = Math.sin(angle) * radius;
                    path += "L " + xx.toFixed(3) + " " + yy.toFixed(3) + " ";
                  }
                  var polygon = {
                    label: "Polygon Body",
                    position: { x, y },
                    vertices: Vertices.fromPath(path)
                  };
                  if (options.chamfer) {
                    var chamfer = options.chamfer;
                    polygon.vertices = Vertices.chamfer(
                      polygon.vertices,
                      chamfer.radius,
                      chamfer.quality,
                      chamfer.qualityMin,
                      chamfer.qualityMax
                    );
                    delete options.chamfer;
                  }
                  return Body.create(Common.extend({}, polygon, options));
                };
                Bodies.fromVertices = function(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea, removeDuplicatePoints) {
                  var decomp = Common.getDecomp(), canDecomp, body, parts, isConvex, isConcave, vertices, i, j, k, v, z;
                  canDecomp = Boolean(decomp && decomp.quickDecomp);
                  options = options || {};
                  parts = [];
                  flagInternal = typeof flagInternal !== "undefined" ? flagInternal : false;
                  removeCollinear = typeof removeCollinear !== "undefined" ? removeCollinear : 0.01;
                  minimumArea = typeof minimumArea !== "undefined" ? minimumArea : 10;
                  removeDuplicatePoints = typeof removeDuplicatePoints !== "undefined" ? removeDuplicatePoints : 0.01;
                  if (!Common.isArray(vertexSets[0])) {
                    vertexSets = [vertexSets];
                  }
                  for (v = 0; v < vertexSets.length; v += 1) {
                    vertices = vertexSets[v];
                    isConvex = Vertices.isConvex(vertices);
                    isConcave = !isConvex;
                    if (isConcave && !canDecomp) {
                      Common.warnOnce(
                        "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                      );
                    }
                    if (isConvex || !canDecomp) {
                      if (isConvex) {
                        vertices = Vertices.clockwiseSort(vertices);
                      } else {
                        vertices = Vertices.hull(vertices);
                      }
                      parts.push({
                        position: { x, y },
                        vertices
                      });
                    } else {
                      var concave = vertices.map(function(vertex) {
                        return [vertex.x, vertex.y];
                      });
                      decomp.makeCCW(concave);
                      if (removeCollinear !== false)
                        decomp.removeCollinearPoints(concave, removeCollinear);
                      if (removeDuplicatePoints !== false && decomp.removeDuplicatePoints)
                        decomp.removeDuplicatePoints(concave, removeDuplicatePoints);
                      var decomposed = decomp.quickDecomp(concave);
                      for (i = 0; i < decomposed.length; i++) {
                        var chunk = decomposed[i];
                        var chunkVertices = chunk.map(function(vertices2) {
                          return {
                            x: vertices2[0],
                            y: vertices2[1]
                          };
                        });
                        if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea)
                          continue;
                        parts.push({
                          position: Vertices.centre(chunkVertices),
                          vertices: chunkVertices
                        });
                      }
                    }
                  }
                  for (i = 0; i < parts.length; i++) {
                    parts[i] = Body.create(Common.extend(parts[i], options));
                  }
                  if (flagInternal) {
                    var coincident_max_dist = 5;
                    for (i = 0; i < parts.length; i++) {
                      var partA = parts[i];
                      for (j = i + 1; j < parts.length; j++) {
                        var partB = parts[j];
                        if (Bounds.overlaps(partA.bounds, partB.bounds)) {
                          var pav = partA.vertices, pbv = partB.vertices;
                          for (k = 0; k < partA.vertices.length; k++) {
                            for (z = 0; z < partB.vertices.length; z++) {
                              var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])), db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));
                              if (da < coincident_max_dist && db < coincident_max_dist) {
                                pav[k].isInternal = true;
                                pbv[z].isInternal = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (parts.length > 1) {
                    body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
                    Body.setPosition(body, { x, y });
                    return body;
                  } else {
                    return parts[0];
                  }
                };
              })();
            }),
            /* 13 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Detector = {};
              module2.exports = Detector;
              var Common = __webpack_require__(0);
              var Collision = __webpack_require__(8);
              (function() {
                Detector.create = function(options) {
                  var defaults = {
                    bodies: [],
                    pairs: null
                  };
                  return Common.extend(defaults, options);
                };
                Detector.setBodies = function(detector, bodies) {
                  detector.bodies = bodies.slice(0);
                };
                Detector.clear = function(detector) {
                  detector.bodies = [];
                };
                Detector.collisions = function(detector) {
                  var collisions = [], pairs = detector.pairs, bodies = detector.bodies, bodiesLength = bodies.length, canCollide = Detector.canCollide, collides = Collision.collides, i, j;
                  bodies.sort(Detector._compareBoundsX);
                  for (i = 0; i < bodiesLength; i++) {
                    var bodyA = bodies[i], boundsA = bodyA.bounds, boundXMax = bodyA.bounds.max.x, boundYMax = bodyA.bounds.max.y, boundYMin = bodyA.bounds.min.y, bodyAStatic = bodyA.isStatic || bodyA.isSleeping, partsALength = bodyA.parts.length, partsASingle = partsALength === 1;
                    for (j = i + 1; j < bodiesLength; j++) {
                      var bodyB = bodies[j], boundsB = bodyB.bounds;
                      if (boundsB.min.x > boundXMax) {
                        break;
                      }
                      if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) {
                        continue;
                      }
                      if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) {
                        continue;
                      }
                      if (!canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) {
                        continue;
                      }
                      var partsBLength = bodyB.parts.length;
                      if (partsASingle && partsBLength === 1) {
                        var collision = collides(bodyA, bodyB, pairs);
                        if (collision) {
                          collisions.push(collision);
                        }
                      } else {
                        var partsAStart = partsALength > 1 ? 1 : 0, partsBStart = partsBLength > 1 ? 1 : 0;
                        for (var k = partsAStart; k < partsALength; k++) {
                          var partA = bodyA.parts[k], boundsA = partA.bounds;
                          for (var z = partsBStart; z < partsBLength; z++) {
                            var partB = bodyB.parts[z], boundsB = partB.bounds;
                            if (boundsA.min.x > boundsB.max.x || boundsA.max.x < boundsB.min.x || boundsA.max.y < boundsB.min.y || boundsA.min.y > boundsB.max.y) {
                              continue;
                            }
                            var collision = collides(partA, partB, pairs);
                            if (collision) {
                              collisions.push(collision);
                            }
                          }
                        }
                      }
                    }
                  }
                  return collisions;
                };
                Detector.canCollide = function(filterA, filterB) {
                  if (filterA.group === filterB.group && filterA.group !== 0)
                    return filterA.group > 0;
                  return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
                };
                Detector._compareBoundsX = function(bodyA, bodyB) {
                  return bodyA.bounds.min.x - bodyB.bounds.min.x;
                };
              })();
            }),
            /* 14 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Mouse = {};
              module2.exports = Mouse;
              var Common = __webpack_require__(0);
              (function() {
                Mouse.create = function(element) {
                  var mouse = {};
                  if (!element) {
                    Common.log("Mouse.create: element was undefined, defaulting to document.body", "warn");
                  }
                  mouse.element = element || document.body;
                  mouse.absolute = { x: 0, y: 0 };
                  mouse.position = { x: 0, y: 0 };
                  mouse.mousedownPosition = { x: 0, y: 0 };
                  mouse.mouseupPosition = { x: 0, y: 0 };
                  mouse.offset = { x: 0, y: 0 };
                  mouse.scale = { x: 1, y: 1 };
                  mouse.wheelDelta = 0;
                  mouse.button = -1;
                  mouse.pixelRatio = parseInt(mouse.element.getAttribute("data-pixel-ratio"), 10) || 1;
                  mouse.sourceEvents = {
                    mousemove: null,
                    mousedown: null,
                    mouseup: null,
                    mousewheel: null
                  };
                  mouse.mousemove = function(event) {
                    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                    if (touches) {
                      mouse.button = 0;
                      event.preventDefault();
                    }
                    mouse.absolute.x = position.x;
                    mouse.absolute.y = position.y;
                    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                    mouse.sourceEvents.mousemove = event;
                  };
                  mouse.mousedown = function(event) {
                    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                    if (touches) {
                      mouse.button = 0;
                      event.preventDefault();
                    } else {
                      mouse.button = event.button;
                    }
                    mouse.absolute.x = position.x;
                    mouse.absolute.y = position.y;
                    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                    mouse.mousedownPosition.x = mouse.position.x;
                    mouse.mousedownPosition.y = mouse.position.y;
                    mouse.sourceEvents.mousedown = event;
                  };
                  mouse.mouseup = function(event) {
                    var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                    if (touches) {
                      event.preventDefault();
                    }
                    mouse.button = -1;
                    mouse.absolute.x = position.x;
                    mouse.absolute.y = position.y;
                    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                    mouse.mouseupPosition.x = mouse.position.x;
                    mouse.mouseupPosition.y = mouse.position.y;
                    mouse.sourceEvents.mouseup = event;
                  };
                  mouse.mousewheel = function(event) {
                    mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
                    event.preventDefault();
                  };
                  Mouse.setElement(mouse, mouse.element);
                  return mouse;
                };
                Mouse.setElement = function(mouse, element) {
                  mouse.element = element;
                  element.addEventListener("mousemove", mouse.mousemove);
                  element.addEventListener("mousedown", mouse.mousedown);
                  element.addEventListener("mouseup", mouse.mouseup);
                  element.addEventListener("mousewheel", mouse.mousewheel);
                  element.addEventListener("DOMMouseScroll", mouse.mousewheel);
                  element.addEventListener("touchmove", mouse.mousemove);
                  element.addEventListener("touchstart", mouse.mousedown);
                  element.addEventListener("touchend", mouse.mouseup);
                };
                Mouse.clearSourceEvents = function(mouse) {
                  mouse.sourceEvents.mousemove = null;
                  mouse.sourceEvents.mousedown = null;
                  mouse.sourceEvents.mouseup = null;
                  mouse.sourceEvents.mousewheel = null;
                  mouse.wheelDelta = 0;
                };
                Mouse.setOffset = function(mouse, offset) {
                  mouse.offset.x = offset.x;
                  mouse.offset.y = offset.y;
                  mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                  mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                };
                Mouse.setScale = function(mouse, scale) {
                  mouse.scale.x = scale.x;
                  mouse.scale.y = scale.y;
                  mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                  mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                };
                Mouse._getRelativeMousePosition = function(event, element, pixelRatio) {
                  var elementBounds = element.getBoundingClientRect(), rootNode = document.documentElement || document.body.parentNode || document.body, scrollX = window.pageXOffset !== void 0 ? window.pageXOffset : rootNode.scrollLeft, scrollY = window.pageYOffset !== void 0 ? window.pageYOffset : rootNode.scrollTop, touches = event.changedTouches, x, y;
                  if (touches) {
                    x = touches[0].pageX - elementBounds.left - scrollX;
                    y = touches[0].pageY - elementBounds.top - scrollY;
                  } else {
                    x = event.pageX - elementBounds.left - scrollX;
                    y = event.pageY - elementBounds.top - scrollY;
                  }
                  return {
                    x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
                    y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
                  };
                };
              })();
            }),
            /* 15 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Plugin = {};
              module2.exports = Plugin;
              var Common = __webpack_require__(0);
              (function() {
                Plugin._registry = {};
                Plugin.register = function(plugin) {
                  if (!Plugin.isPlugin(plugin)) {
                    Common.warn("Plugin.register:", Plugin.toString(plugin), "does not implement all required fields.");
                  }
                  if (plugin.name in Plugin._registry) {
                    var registered = Plugin._registry[plugin.name], pluginVersion = Plugin.versionParse(plugin.version).number, registeredVersion = Plugin.versionParse(registered.version).number;
                    if (pluginVersion > registeredVersion) {
                      Common.warn("Plugin.register:", Plugin.toString(registered), "was upgraded to", Plugin.toString(plugin));
                      Plugin._registry[plugin.name] = plugin;
                    } else if (pluginVersion < registeredVersion) {
                      Common.warn("Plugin.register:", Plugin.toString(registered), "can not be downgraded to", Plugin.toString(plugin));
                    } else if (plugin !== registered) {
                      Common.warn("Plugin.register:", Plugin.toString(plugin), "is already registered to different plugin object");
                    }
                  } else {
                    Plugin._registry[plugin.name] = plugin;
                  }
                  return plugin;
                };
                Plugin.resolve = function(dependency) {
                  return Plugin._registry[Plugin.dependencyParse(dependency).name];
                };
                Plugin.toString = function(plugin) {
                  return typeof plugin === "string" ? plugin : (plugin.name || "anonymous") + "@" + (plugin.version || plugin.range || "0.0.0");
                };
                Plugin.isPlugin = function(obj) {
                  return obj && obj.name && obj.version && obj.install;
                };
                Plugin.isUsed = function(module3, name) {
                  return module3.used.indexOf(name) > -1;
                };
                Plugin.isFor = function(plugin, module3) {
                  var parsed = plugin.for && Plugin.dependencyParse(plugin.for);
                  return !plugin.for || module3.name === parsed.name && Plugin.versionSatisfies(module3.version, parsed.range);
                };
                Plugin.use = function(module3, plugins) {
                  module3.uses = (module3.uses || []).concat(plugins || []);
                  if (module3.uses.length === 0) {
                    Common.warn("Plugin.use:", Plugin.toString(module3), "does not specify any dependencies to install.");
                    return;
                  }
                  var dependencies = Plugin.dependencies(module3), sortedDependencies = Common.topologicalSort(dependencies), status = [];
                  for (var i = 0; i < sortedDependencies.length; i += 1) {
                    if (sortedDependencies[i] === module3.name) {
                      continue;
                    }
                    var plugin = Plugin.resolve(sortedDependencies[i]);
                    if (!plugin) {
                      status.push("\u274C " + sortedDependencies[i]);
                      continue;
                    }
                    if (Plugin.isUsed(module3, plugin.name)) {
                      continue;
                    }
                    if (!Plugin.isFor(plugin, module3)) {
                      Common.warn("Plugin.use:", Plugin.toString(plugin), "is for", plugin.for, "but installed on", Plugin.toString(module3) + ".");
                      plugin._warned = true;
                    }
                    if (plugin.install) {
                      plugin.install(module3);
                    } else {
                      Common.warn("Plugin.use:", Plugin.toString(plugin), "does not specify an install function.");
                      plugin._warned = true;
                    }
                    if (plugin._warned) {
                      status.push("\u{1F536} " + Plugin.toString(plugin));
                      delete plugin._warned;
                    } else {
                      status.push("\u2705 " + Plugin.toString(plugin));
                    }
                    module3.used.push(plugin.name);
                  }
                  if (status.length > 0) {
                    Common.info(status.join("  "));
                  }
                };
                Plugin.dependencies = function(module3, tracked) {
                  var parsedBase = Plugin.dependencyParse(module3), name = parsedBase.name;
                  tracked = tracked || {};
                  if (name in tracked) {
                    return;
                  }
                  module3 = Plugin.resolve(module3) || module3;
                  tracked[name] = Common.map(module3.uses || [], function(dependency) {
                    if (Plugin.isPlugin(dependency)) {
                      Plugin.register(dependency);
                    }
                    var parsed = Plugin.dependencyParse(dependency), resolved = Plugin.resolve(dependency);
                    if (resolved && !Plugin.versionSatisfies(resolved.version, parsed.range)) {
                      Common.warn(
                        "Plugin.dependencies:",
                        Plugin.toString(resolved),
                        "does not satisfy",
                        Plugin.toString(parsed),
                        "used by",
                        Plugin.toString(parsedBase) + "."
                      );
                      resolved._warned = true;
                      module3._warned = true;
                    } else if (!resolved) {
                      Common.warn(
                        "Plugin.dependencies:",
                        Plugin.toString(dependency),
                        "used by",
                        Plugin.toString(parsedBase),
                        "could not be resolved."
                      );
                      module3._warned = true;
                    }
                    return parsed.name;
                  });
                  for (var i = 0; i < tracked[name].length; i += 1) {
                    Plugin.dependencies(tracked[name][i], tracked);
                  }
                  return tracked;
                };
                Plugin.dependencyParse = function(dependency) {
                  if (Common.isString(dependency)) {
                    var pattern = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                    if (!pattern.test(dependency)) {
                      Common.warn("Plugin.dependencyParse:", dependency, "is not a valid dependency string.");
                    }
                    return {
                      name: dependency.split("@")[0],
                      range: dependency.split("@")[1] || "*"
                    };
                  }
                  return {
                    name: dependency.name,
                    range: dependency.range || dependency.version
                  };
                };
                Plugin.versionParse = function(range) {
                  var pattern = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
                  if (!pattern.test(range)) {
                    Common.warn("Plugin.versionParse:", range, "is not a valid version or range.");
                  }
                  var parts = pattern.exec(range);
                  var major = Number(parts[4]);
                  var minor = Number(parts[5]);
                  var patch = Number(parts[6]);
                  return {
                    isRange: Boolean(parts[1] || parts[2]),
                    version: parts[3],
                    range,
                    operator: parts[1] || parts[2] || "",
                    major,
                    minor,
                    patch,
                    parts: [major, minor, patch],
                    prerelease: parts[7],
                    number: major * 1e8 + minor * 1e4 + patch
                  };
                };
                Plugin.versionSatisfies = function(version, range) {
                  range = range || "*";
                  var r = Plugin.versionParse(range), v = Plugin.versionParse(version);
                  if (r.isRange) {
                    if (r.operator === "*" || version === "*") {
                      return true;
                    }
                    if (r.operator === ">") {
                      return v.number > r.number;
                    }
                    if (r.operator === ">=") {
                      return v.number >= r.number;
                    }
                    if (r.operator === "~") {
                      return v.major === r.major && v.minor === r.minor && v.patch >= r.patch;
                    }
                    if (r.operator === "^") {
                      if (r.major > 0) {
                        return v.major === r.major && v.number >= r.number;
                      }
                      if (r.minor > 0) {
                        return v.minor === r.minor && v.patch >= r.patch;
                      }
                      return v.patch === r.patch;
                    }
                  }
                  return version === range || version === "*";
                };
              })();
            }),
            /* 16 */
            /***/
            (function(module2, exports2) {
              var Contact = {};
              module2.exports = Contact;
              (function() {
                Contact.create = function(vertex) {
                  return {
                    vertex,
                    normalImpulse: 0,
                    tangentImpulse: 0
                  };
                };
              })();
            }),
            /* 17 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Engine = {};
              module2.exports = Engine;
              var Sleeping = __webpack_require__(7);
              var Resolver = __webpack_require__(18);
              var Detector = __webpack_require__(13);
              var Pairs = __webpack_require__(19);
              var Events = __webpack_require__(5);
              var Composite = __webpack_require__(6);
              var Constraint = __webpack_require__(10);
              var Common = __webpack_require__(0);
              var Body = __webpack_require__(4);
              (function() {
                Engine.create = function(options) {
                  options = options || {};
                  var defaults = {
                    positionIterations: 6,
                    velocityIterations: 4,
                    constraintIterations: 2,
                    enableSleeping: false,
                    events: [],
                    plugin: {},
                    gravity: {
                      x: 0,
                      y: 1,
                      scale: 1e-3
                    },
                    timing: {
                      timestamp: 0,
                      timeScale: 1,
                      lastDelta: 0,
                      lastElapsed: 0
                    }
                  };
                  var engine = Common.extend(defaults, options);
                  engine.world = options.world || Composite.create({ label: "World" });
                  engine.pairs = options.pairs || Pairs.create();
                  engine.detector = options.detector || Detector.create();
                  engine.grid = { buckets: [] };
                  engine.world.gravity = engine.gravity;
                  engine.broadphase = engine.grid;
                  engine.metrics = {};
                  return engine;
                };
                Engine.update = function(engine, delta) {
                  var startTime = Common.now();
                  var world = engine.world, detector = engine.detector, pairs = engine.pairs, timing = engine.timing, timestamp = timing.timestamp, i;
                  delta = typeof delta !== "undefined" ? delta : Common._baseDelta;
                  delta *= timing.timeScale;
                  timing.timestamp += delta;
                  timing.lastDelta = delta;
                  var event = {
                    timestamp: timing.timestamp,
                    delta
                  };
                  Events.trigger(engine, "beforeUpdate", event);
                  var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world);
                  if (world.isModified) {
                    Detector.setBodies(detector, allBodies);
                    Composite.setModified(world, false, false, true);
                  }
                  if (engine.enableSleeping)
                    Sleeping.update(allBodies, delta);
                  Engine._bodiesApplyGravity(allBodies, engine.gravity);
                  if (delta > 0) {
                    Engine._bodiesUpdate(allBodies, delta);
                  }
                  Constraint.preSolveAll(allBodies);
                  for (i = 0; i < engine.constraintIterations; i++) {
                    Constraint.solveAll(allConstraints, delta);
                  }
                  Constraint.postSolveAll(allBodies);
                  detector.pairs = engine.pairs;
                  var collisions = Detector.collisions(detector);
                  Pairs.update(pairs, collisions, timestamp);
                  if (engine.enableSleeping)
                    Sleeping.afterCollisions(pairs.list);
                  if (pairs.collisionStart.length > 0)
                    Events.trigger(engine, "collisionStart", { pairs: pairs.collisionStart });
                  var positionDamping = Common.clamp(20 / engine.positionIterations, 0, 1);
                  Resolver.preSolvePosition(pairs.list);
                  for (i = 0; i < engine.positionIterations; i++) {
                    Resolver.solvePosition(pairs.list, delta, positionDamping);
                  }
                  Resolver.postSolvePosition(allBodies);
                  Constraint.preSolveAll(allBodies);
                  for (i = 0; i < engine.constraintIterations; i++) {
                    Constraint.solveAll(allConstraints, delta);
                  }
                  Constraint.postSolveAll(allBodies);
                  Resolver.preSolveVelocity(pairs.list);
                  for (i = 0; i < engine.velocityIterations; i++) {
                    Resolver.solveVelocity(pairs.list, delta);
                  }
                  Engine._bodiesUpdateVelocities(allBodies);
                  if (pairs.collisionActive.length > 0)
                    Events.trigger(engine, "collisionActive", { pairs: pairs.collisionActive });
                  if (pairs.collisionEnd.length > 0)
                    Events.trigger(engine, "collisionEnd", { pairs: pairs.collisionEnd });
                  Engine._bodiesClearForces(allBodies);
                  Events.trigger(engine, "afterUpdate", event);
                  engine.timing.lastElapsed = Common.now() - startTime;
                  return engine;
                };
                Engine.merge = function(engineA, engineB) {
                  Common.extend(engineA, engineB);
                  if (engineB.world) {
                    engineA.world = engineB.world;
                    Engine.clear(engineA);
                    var bodies = Composite.allBodies(engineA.world);
                    for (var i = 0; i < bodies.length; i++) {
                      var body = bodies[i];
                      Sleeping.set(body, false);
                      body.id = Common.nextId();
                    }
                  }
                };
                Engine.clear = function(engine) {
                  Pairs.clear(engine.pairs);
                  Detector.clear(engine.detector);
                };
                Engine._bodiesClearForces = function(bodies) {
                  var bodiesLength = bodies.length;
                  for (var i = 0; i < bodiesLength; i++) {
                    var body = bodies[i];
                    body.force.x = 0;
                    body.force.y = 0;
                    body.torque = 0;
                  }
                };
                Engine._bodiesApplyGravity = function(bodies, gravity) {
                  var gravityScale = typeof gravity.scale !== "undefined" ? gravity.scale : 1e-3, bodiesLength = bodies.length;
                  if (gravity.x === 0 && gravity.y === 0 || gravityScale === 0) {
                    return;
                  }
                  for (var i = 0; i < bodiesLength; i++) {
                    var body = bodies[i];
                    if (body.isStatic || body.isSleeping)
                      continue;
                    body.force.y += body.mass * gravity.y * gravityScale;
                    body.force.x += body.mass * gravity.x * gravityScale;
                  }
                };
                Engine._bodiesUpdate = function(bodies, delta) {
                  var bodiesLength = bodies.length;
                  for (var i = 0; i < bodiesLength; i++) {
                    var body = bodies[i];
                    if (body.isStatic || body.isSleeping)
                      continue;
                    Body.update(body, delta);
                  }
                };
                Engine._bodiesUpdateVelocities = function(bodies) {
                  var bodiesLength = bodies.length;
                  for (var i = 0; i < bodiesLength; i++) {
                    Body.updateVelocities(bodies[i]);
                  }
                };
              })();
            }),
            /* 18 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Resolver = {};
              module2.exports = Resolver;
              var Vertices = __webpack_require__(3);
              var Common = __webpack_require__(0);
              var Bounds = __webpack_require__(1);
              (function() {
                Resolver._restingThresh = 2;
                Resolver._restingThreshTangent = Math.sqrt(6);
                Resolver._positionDampen = 0.9;
                Resolver._positionWarming = 0.8;
                Resolver._frictionNormalMultiplier = 5;
                Resolver._frictionMaxStatic = Number.MAX_VALUE;
                Resolver.preSolvePosition = function(pairs) {
                  var i, pair, activeCount, pairsLength = pairs.length;
                  for (i = 0; i < pairsLength; i++) {
                    pair = pairs[i];
                    if (!pair.isActive)
                      continue;
                    activeCount = pair.activeContacts.length;
                    pair.collision.parentA.totalContacts += activeCount;
                    pair.collision.parentB.totalContacts += activeCount;
                  }
                };
                Resolver.solvePosition = function(pairs, delta, damping) {
                  var i, pair, collision, bodyA, bodyB, normal, contactShare, positionImpulse, positionDampen = Resolver._positionDampen * (damping || 1), slopDampen = Common.clamp(delta / Common._baseDelta, 0, 1), pairsLength = pairs.length;
                  for (i = 0; i < pairsLength; i++) {
                    pair = pairs[i];
                    if (!pair.isActive || pair.isSensor)
                      continue;
                    collision = pair.collision;
                    bodyA = collision.parentA;
                    bodyB = collision.parentB;
                    normal = collision.normal;
                    pair.separation = normal.x * (bodyB.positionImpulse.x + collision.penetration.x - bodyA.positionImpulse.x) + normal.y * (bodyB.positionImpulse.y + collision.penetration.y - bodyA.positionImpulse.y);
                  }
                  for (i = 0; i < pairsLength; i++) {
                    pair = pairs[i];
                    if (!pair.isActive || pair.isSensor)
                      continue;
                    collision = pair.collision;
                    bodyA = collision.parentA;
                    bodyB = collision.parentB;
                    normal = collision.normal;
                    positionImpulse = pair.separation - pair.slop * slopDampen;
                    if (bodyA.isStatic || bodyB.isStatic)
                      positionImpulse *= 2;
                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                      contactShare = positionDampen / bodyA.totalContacts;
                      bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
                      bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
                    }
                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                      contactShare = positionDampen / bodyB.totalContacts;
                      bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
                      bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
                    }
                  }
                };
                Resolver.postSolvePosition = function(bodies) {
                  var positionWarming = Resolver._positionWarming, bodiesLength = bodies.length, verticesTranslate = Vertices.translate, boundsUpdate = Bounds.update;
                  for (var i = 0; i < bodiesLength; i++) {
                    var body = bodies[i], positionImpulse = body.positionImpulse, positionImpulseX = positionImpulse.x, positionImpulseY = positionImpulse.y, velocity = body.velocity;
                    body.totalContacts = 0;
                    if (positionImpulseX !== 0 || positionImpulseY !== 0) {
                      for (var j = 0; j < body.parts.length; j++) {
                        var part = body.parts[j];
                        verticesTranslate(part.vertices, positionImpulse);
                        boundsUpdate(part.bounds, part.vertices, velocity);
                        part.position.x += positionImpulseX;
                        part.position.y += positionImpulseY;
                      }
                      body.positionPrev.x += positionImpulseX;
                      body.positionPrev.y += positionImpulseY;
                      if (positionImpulseX * velocity.x + positionImpulseY * velocity.y < 0) {
                        positionImpulse.x = 0;
                        positionImpulse.y = 0;
                      } else {
                        positionImpulse.x *= positionWarming;
                        positionImpulse.y *= positionWarming;
                      }
                    }
                  }
                };
                Resolver.preSolveVelocity = function(pairs) {
                  var pairsLength = pairs.length, i, j;
                  for (i = 0; i < pairsLength; i++) {
                    var pair = pairs[i];
                    if (!pair.isActive || pair.isSensor)
                      continue;
                    var contacts = pair.activeContacts, contactsLength = contacts.length, collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, normal = collision.normal, tangent = collision.tangent;
                    for (j = 0; j < contactsLength; j++) {
                      var contact = contacts[j], contactVertex = contact.vertex, normalImpulse = contact.normalImpulse, tangentImpulse = contact.tangentImpulse;
                      if (normalImpulse !== 0 || tangentImpulse !== 0) {
                        var impulseX = normal.x * normalImpulse + tangent.x * tangentImpulse, impulseY = normal.y * normalImpulse + tangent.y * tangentImpulse;
                        if (!(bodyA.isStatic || bodyA.isSleeping)) {
                          bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                          bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                          bodyA.anglePrev += bodyA.inverseInertia * ((contactVertex.x - bodyA.position.x) * impulseY - (contactVertex.y - bodyA.position.y) * impulseX);
                        }
                        if (!(bodyB.isStatic || bodyB.isSleeping)) {
                          bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                          bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                          bodyB.anglePrev -= bodyB.inverseInertia * ((contactVertex.x - bodyB.position.x) * impulseY - (contactVertex.y - bodyB.position.y) * impulseX);
                        }
                      }
                    }
                  }
                };
                Resolver.solveVelocity = function(pairs, delta) {
                  var timeScale = delta / Common._baseDelta, timeScaleSquared = timeScale * timeScale, timeScaleCubed = timeScaleSquared * timeScale, restingThresh = -Resolver._restingThresh * timeScale, restingThreshTangent = Resolver._restingThreshTangent, frictionNormalMultiplier = Resolver._frictionNormalMultiplier * timeScale, frictionMaxStatic = Resolver._frictionMaxStatic, pairsLength = pairs.length, tangentImpulse, maxFriction, i, j;
                  for (i = 0; i < pairsLength; i++) {
                    var pair = pairs[i];
                    if (!pair.isActive || pair.isSensor)
                      continue;
                    var collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, bodyAVelocity = bodyA.velocity, bodyBVelocity = bodyB.velocity, normalX = collision.normal.x, normalY = collision.normal.y, tangentX = collision.tangent.x, tangentY = collision.tangent.y, contacts = pair.activeContacts, contactsLength = contacts.length, contactShare = 1 / contactsLength, inverseMassTotal = bodyA.inverseMass + bodyB.inverseMass, friction = pair.friction * pair.frictionStatic * frictionNormalMultiplier;
                    bodyAVelocity.x = bodyA.position.x - bodyA.positionPrev.x;
                    bodyAVelocity.y = bodyA.position.y - bodyA.positionPrev.y;
                    bodyBVelocity.x = bodyB.position.x - bodyB.positionPrev.x;
                    bodyBVelocity.y = bodyB.position.y - bodyB.positionPrev.y;
                    bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
                    bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
                    for (j = 0; j < contactsLength; j++) {
                      var contact = contacts[j], contactVertex = contact.vertex;
                      var offsetAX = contactVertex.x - bodyA.position.x, offsetAY = contactVertex.y - bodyA.position.y, offsetBX = contactVertex.x - bodyB.position.x, offsetBY = contactVertex.y - bodyB.position.y;
                      var velocityPointAX = bodyAVelocity.x - offsetAY * bodyA.angularVelocity, velocityPointAY = bodyAVelocity.y + offsetAX * bodyA.angularVelocity, velocityPointBX = bodyBVelocity.x - offsetBY * bodyB.angularVelocity, velocityPointBY = bodyBVelocity.y + offsetBX * bodyB.angularVelocity;
                      var relativeVelocityX = velocityPointAX - velocityPointBX, relativeVelocityY = velocityPointAY - velocityPointBY;
                      var normalVelocity = normalX * relativeVelocityX + normalY * relativeVelocityY, tangentVelocity = tangentX * relativeVelocityX + tangentY * relativeVelocityY;
                      var normalOverlap = pair.separation + normalVelocity;
                      var normalForce = Math.min(normalOverlap, 1);
                      normalForce = normalOverlap < 0 ? 0 : normalForce;
                      var frictionLimit = normalForce * friction;
                      if (tangentVelocity < -frictionLimit || tangentVelocity > frictionLimit) {
                        maxFriction = tangentVelocity > 0 ? tangentVelocity : -tangentVelocity;
                        tangentImpulse = pair.friction * (tangentVelocity > 0 ? 1 : -1) * timeScaleCubed;
                        if (tangentImpulse < -maxFriction) {
                          tangentImpulse = -maxFriction;
                        } else if (tangentImpulse > maxFriction) {
                          tangentImpulse = maxFriction;
                        }
                      } else {
                        tangentImpulse = tangentVelocity;
                        maxFriction = frictionMaxStatic;
                      }
                      var oAcN = offsetAX * normalY - offsetAY * normalX, oBcN = offsetBX * normalY - offsetBY * normalX, share = contactShare / (inverseMassTotal + bodyA.inverseInertia * oAcN * oAcN + bodyB.inverseInertia * oBcN * oBcN);
                      var normalImpulse = (1 + pair.restitution) * normalVelocity * share;
                      tangentImpulse *= share;
                      if (normalVelocity < restingThresh) {
                        contact.normalImpulse = 0;
                      } else {
                        var contactNormalImpulse = contact.normalImpulse;
                        contact.normalImpulse += normalImpulse;
                        if (contact.normalImpulse > 0) contact.normalImpulse = 0;
                        normalImpulse = contact.normalImpulse - contactNormalImpulse;
                      }
                      if (tangentVelocity < -restingThreshTangent || tangentVelocity > restingThreshTangent) {
                        contact.tangentImpulse = 0;
                      } else {
                        var contactTangentImpulse = contact.tangentImpulse;
                        contact.tangentImpulse += tangentImpulse;
                        if (contact.tangentImpulse < -maxFriction) contact.tangentImpulse = -maxFriction;
                        if (contact.tangentImpulse > maxFriction) contact.tangentImpulse = maxFriction;
                        tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
                      }
                      var impulseX = normalX * normalImpulse + tangentX * tangentImpulse, impulseY = normalY * normalImpulse + tangentY * tangentImpulse;
                      if (!(bodyA.isStatic || bodyA.isSleeping)) {
                        bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                        bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                        bodyA.anglePrev += (offsetAX * impulseY - offsetAY * impulseX) * bodyA.inverseInertia;
                      }
                      if (!(bodyB.isStatic || bodyB.isSleeping)) {
                        bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                        bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                        bodyB.anglePrev -= (offsetBX * impulseY - offsetBY * impulseX) * bodyB.inverseInertia;
                      }
                    }
                  }
                };
              })();
            }),
            /* 19 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Pairs = {};
              module2.exports = Pairs;
              var Pair = __webpack_require__(9);
              var Common = __webpack_require__(0);
              (function() {
                Pairs.create = function(options) {
                  return Common.extend({
                    table: {},
                    list: [],
                    collisionStart: [],
                    collisionActive: [],
                    collisionEnd: []
                  }, options);
                };
                Pairs.update = function(pairs, collisions, timestamp) {
                  var pairsList = pairs.list, pairsListLength = pairsList.length, pairsTable = pairs.table, collisionsLength = collisions.length, collisionStart = pairs.collisionStart, collisionEnd = pairs.collisionEnd, collisionActive = pairs.collisionActive, collision, pairIndex, pair, i;
                  collisionStart.length = 0;
                  collisionEnd.length = 0;
                  collisionActive.length = 0;
                  for (i = 0; i < pairsListLength; i++) {
                    pairsList[i].confirmedActive = false;
                  }
                  for (i = 0; i < collisionsLength; i++) {
                    collision = collisions[i];
                    pair = collision.pair;
                    if (pair) {
                      if (pair.isActive) {
                        collisionActive.push(pair);
                      } else {
                        collisionStart.push(pair);
                      }
                      Pair.update(pair, collision, timestamp);
                      pair.confirmedActive = true;
                    } else {
                      pair = Pair.create(collision, timestamp);
                      pairsTable[pair.id] = pair;
                      collisionStart.push(pair);
                      pairsList.push(pair);
                    }
                  }
                  var removePairIndex = [];
                  pairsListLength = pairsList.length;
                  for (i = 0; i < pairsListLength; i++) {
                    pair = pairsList[i];
                    if (!pair.confirmedActive) {
                      Pair.setActive(pair, false, timestamp);
                      collisionEnd.push(pair);
                      if (!pair.collision.bodyA.isSleeping && !pair.collision.bodyB.isSleeping) {
                        removePairIndex.push(i);
                      }
                    }
                  }
                  for (i = 0; i < removePairIndex.length; i++) {
                    pairIndex = removePairIndex[i] - i;
                    pair = pairsList[pairIndex];
                    pairsList.splice(pairIndex, 1);
                    delete pairsTable[pair.id];
                  }
                };
                Pairs.clear = function(pairs) {
                  pairs.table = {};
                  pairs.list.length = 0;
                  pairs.collisionStart.length = 0;
                  pairs.collisionActive.length = 0;
                  pairs.collisionEnd.length = 0;
                  return pairs;
                };
              })();
            }),
            /* 20 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Matter2 = module2.exports = __webpack_require__(21);
              Matter2.Axes = __webpack_require__(11);
              Matter2.Bodies = __webpack_require__(12);
              Matter2.Body = __webpack_require__(4);
              Matter2.Bounds = __webpack_require__(1);
              Matter2.Collision = __webpack_require__(8);
              Matter2.Common = __webpack_require__(0);
              Matter2.Composite = __webpack_require__(6);
              Matter2.Composites = __webpack_require__(22);
              Matter2.Constraint = __webpack_require__(10);
              Matter2.Contact = __webpack_require__(16);
              Matter2.Detector = __webpack_require__(13);
              Matter2.Engine = __webpack_require__(17);
              Matter2.Events = __webpack_require__(5);
              Matter2.Grid = __webpack_require__(23);
              Matter2.Mouse = __webpack_require__(14);
              Matter2.MouseConstraint = __webpack_require__(24);
              Matter2.Pair = __webpack_require__(9);
              Matter2.Pairs = __webpack_require__(19);
              Matter2.Plugin = __webpack_require__(15);
              Matter2.Query = __webpack_require__(25);
              Matter2.Render = __webpack_require__(26);
              Matter2.Resolver = __webpack_require__(18);
              Matter2.Runner = __webpack_require__(27);
              Matter2.SAT = __webpack_require__(28);
              Matter2.Sleeping = __webpack_require__(7);
              Matter2.Svg = __webpack_require__(29);
              Matter2.Vector = __webpack_require__(2);
              Matter2.Vertices = __webpack_require__(3);
              Matter2.World = __webpack_require__(30);
              Matter2.Engine.run = Matter2.Runner.run;
              Matter2.Common.deprecated(Matter2.Engine, "run", "Engine.run \u27A4 use Matter.Runner.run(engine) instead");
            }),
            /* 21 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Matter2 = {};
              module2.exports = Matter2;
              var Plugin = __webpack_require__(15);
              var Common = __webpack_require__(0);
              (function() {
                Matter2.name = "matter-js";
                Matter2.version = true ? "0.19.0" : void 0;
                Matter2.uses = [];
                Matter2.used = [];
                Matter2.use = function() {
                  Plugin.use(Matter2, Array.prototype.slice.call(arguments));
                };
                Matter2.before = function(path, func) {
                  path = path.replace(/^Matter./, "");
                  return Common.chainPathBefore(Matter2, path, func);
                };
                Matter2.after = function(path, func) {
                  path = path.replace(/^Matter./, "");
                  return Common.chainPathAfter(Matter2, path, func);
                };
              })();
            }),
            /* 22 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Composites = {};
              module2.exports = Composites;
              var Composite = __webpack_require__(6);
              var Constraint = __webpack_require__(10);
              var Common = __webpack_require__(0);
              var Body = __webpack_require__(4);
              var Bodies = __webpack_require__(12);
              var deprecated = Common.deprecated;
              (function() {
                Composites.stack = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
                  var stack = Composite.create({ label: "Stack" }), x = xx, y = yy, lastBody, i = 0;
                  for (var row = 0; row < rows; row++) {
                    var maxHeight = 0;
                    for (var column = 0; column < columns; column++) {
                      var body = callback(x, y, column, row, lastBody, i);
                      if (body) {
                        var bodyHeight = body.bounds.max.y - body.bounds.min.y, bodyWidth = body.bounds.max.x - body.bounds.min.x;
                        if (bodyHeight > maxHeight)
                          maxHeight = bodyHeight;
                        Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
                        x = body.bounds.max.x + columnGap;
                        Composite.addBody(stack, body);
                        lastBody = body;
                        i += 1;
                      } else {
                        x += columnGap;
                      }
                    }
                    y += maxHeight + rowGap;
                    x = xx;
                  }
                  return stack;
                };
                Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
                  var bodies = composite.bodies;
                  for (var i = 1; i < bodies.length; i++) {
                    var bodyA = bodies[i - 1], bodyB = bodies[i], bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y, bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y, bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
                    var defaults = {
                      bodyA,
                      pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
                      bodyB,
                      pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
                    };
                    var constraint = Common.extend(defaults, options);
                    Composite.addConstraint(composite, Constraint.create(constraint));
                  }
                  composite.label += " Chain";
                  return composite;
                };
                Composites.mesh = function(composite, columns, rows, crossBrace, options) {
                  var bodies = composite.bodies, row, col, bodyA, bodyB, bodyC;
                  for (row = 0; row < rows; row++) {
                    for (col = 1; col < columns; col++) {
                      bodyA = bodies[col - 1 + row * columns];
                      bodyB = bodies[col + row * columns];
                      Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA, bodyB }, options)));
                    }
                    if (row > 0) {
                      for (col = 0; col < columns; col++) {
                        bodyA = bodies[col + (row - 1) * columns];
                        bodyB = bodies[col + row * columns];
                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA, bodyB }, options)));
                        if (crossBrace && col > 0) {
                          bodyC = bodies[col - 1 + (row - 1) * columns];
                          Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB }, options)));
                        }
                        if (crossBrace && col < columns - 1) {
                          bodyC = bodies[col + 1 + (row - 1) * columns];
                          Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB }, options)));
                        }
                      }
                    }
                  }
                  composite.label += " Mesh";
                  return composite;
                };
                Composites.pyramid = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
                  return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
                    var actualRows = Math.min(rows, Math.ceil(columns / 2)), lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
                    if (row > actualRows)
                      return;
                    row = actualRows - row;
                    var start = row, end = columns - 1 - row;
                    if (column < start || column > end)
                      return;
                    if (i === 1) {
                      Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
                    }
                    var xOffset = lastBody ? column * lastBodyWidth : 0;
                    return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
                  });
                };
                Composites.newtonsCradle = function(xx, yy, number, size, length) {
                  var newtonsCradle = Composite.create({ label: "Newtons Cradle" });
                  for (var i = 0; i < number; i++) {
                    var separation = 1.9, circle = Bodies.circle(
                      xx + i * (size * separation),
                      yy + length,
                      size,
                      { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                    ), constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });
                    Composite.addBody(newtonsCradle, circle);
                    Composite.addConstraint(newtonsCradle, constraint);
                  }
                  return newtonsCradle;
                };
                deprecated(Composites, "newtonsCradle", "Composites.newtonsCradle \u27A4 moved to newtonsCradle example");
                Composites.car = function(xx, yy, width, height, wheelSize) {
                  var group = Body.nextGroup(true), wheelBase = 20, wheelAOffset = -width * 0.5 + wheelBase, wheelBOffset = width * 0.5 - wheelBase, wheelYOffset = 0;
                  var car = Composite.create({ label: "Car" }), body = Bodies.rectangle(xx, yy, width, height, {
                    collisionFilter: {
                      group
                    },
                    chamfer: {
                      radius: height * 0.5
                    },
                    density: 2e-4
                  });
                  var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
                    collisionFilter: {
                      group
                    },
                    friction: 0.8
                  });
                  var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
                    collisionFilter: {
                      group
                    },
                    friction: 0.8
                  });
                  var axelA = Constraint.create({
                    bodyB: body,
                    pointB: { x: wheelAOffset, y: wheelYOffset },
                    bodyA: wheelA,
                    stiffness: 1,
                    length: 0
                  });
                  var axelB = Constraint.create({
                    bodyB: body,
                    pointB: { x: wheelBOffset, y: wheelYOffset },
                    bodyA: wheelB,
                    stiffness: 1,
                    length: 0
                  });
                  Composite.addBody(car, body);
                  Composite.addBody(car, wheelA);
                  Composite.addBody(car, wheelB);
                  Composite.addConstraint(car, axelA);
                  Composite.addConstraint(car, axelB);
                  return car;
                };
                deprecated(Composites, "car", "Composites.car \u27A4 moved to car example");
                Composites.softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
                  particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
                  constraintOptions = Common.extend({ stiffness: 0.2, render: { type: "line", anchors: false } }, constraintOptions);
                  var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
                    return Bodies.circle(x, y, particleRadius, particleOptions);
                  });
                  Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
                  softBody.label = "Soft Body";
                  return softBody;
                };
                deprecated(Composites, "softBody", "Composites.softBody \u27A4 moved to softBody and cloth examples");
              })();
            }),
            /* 23 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Grid = {};
              module2.exports = Grid;
              var Pair = __webpack_require__(9);
              var Common = __webpack_require__(0);
              var deprecated = Common.deprecated;
              (function() {
                Grid.create = function(options) {
                  var defaults = {
                    buckets: {},
                    pairs: {},
                    pairsList: [],
                    bucketWidth: 48,
                    bucketHeight: 48
                  };
                  return Common.extend(defaults, options);
                };
                Grid.update = function(grid, bodies, engine, forceUpdate) {
                  var i, col, row, world = engine.world, buckets = grid.buckets, bucket, bucketId, gridChanged = false;
                  for (i = 0; i < bodies.length; i++) {
                    var body = bodies[i];
                    if (body.isSleeping && !forceUpdate)
                      continue;
                    if (world.bounds && (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x || body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y))
                      continue;
                    var newRegion = Grid._getRegion(grid, body);
                    if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
                      if (!body.region || forceUpdate)
                        body.region = newRegion;
                      var union = Grid._regionUnion(newRegion, body.region);
                      for (col = union.startCol; col <= union.endCol; col++) {
                        for (row = union.startRow; row <= union.endRow; row++) {
                          bucketId = Grid._getBucketId(col, row);
                          bucket = buckets[bucketId];
                          var isInsideNewRegion = col >= newRegion.startCol && col <= newRegion.endCol && row >= newRegion.startRow && row <= newRegion.endRow;
                          var isInsideOldRegion = col >= body.region.startCol && col <= body.region.endCol && row >= body.region.startRow && row <= body.region.endRow;
                          if (!isInsideNewRegion && isInsideOldRegion) {
                            if (isInsideOldRegion) {
                              if (bucket)
                                Grid._bucketRemoveBody(grid, bucket, body);
                            }
                          }
                          if (body.region === newRegion || isInsideNewRegion && !isInsideOldRegion || forceUpdate) {
                            if (!bucket)
                              bucket = Grid._createBucket(buckets, bucketId);
                            Grid._bucketAddBody(grid, bucket, body);
                          }
                        }
                      }
                      body.region = newRegion;
                      gridChanged = true;
                    }
                  }
                  if (gridChanged)
                    grid.pairsList = Grid._createActivePairsList(grid);
                };
                deprecated(Grid, "update", "Grid.update \u27A4 replaced by Matter.Detector");
                Grid.clear = function(grid) {
                  grid.buckets = {};
                  grid.pairs = {};
                  grid.pairsList = [];
                };
                deprecated(Grid, "clear", "Grid.clear \u27A4 replaced by Matter.Detector");
                Grid._regionUnion = function(regionA, regionB) {
                  var startCol = Math.min(regionA.startCol, regionB.startCol), endCol = Math.max(regionA.endCol, regionB.endCol), startRow = Math.min(regionA.startRow, regionB.startRow), endRow = Math.max(regionA.endRow, regionB.endRow);
                  return Grid._createRegion(startCol, endCol, startRow, endRow);
                };
                Grid._getRegion = function(grid, body) {
                  var bounds = body.bounds, startCol = Math.floor(bounds.min.x / grid.bucketWidth), endCol = Math.floor(bounds.max.x / grid.bucketWidth), startRow = Math.floor(bounds.min.y / grid.bucketHeight), endRow = Math.floor(bounds.max.y / grid.bucketHeight);
                  return Grid._createRegion(startCol, endCol, startRow, endRow);
                };
                Grid._createRegion = function(startCol, endCol, startRow, endRow) {
                  return {
                    id: startCol + "," + endCol + "," + startRow + "," + endRow,
                    startCol,
                    endCol,
                    startRow,
                    endRow
                  };
                };
                Grid._getBucketId = function(column, row) {
                  return "C" + column + "R" + row;
                };
                Grid._createBucket = function(buckets, bucketId) {
                  var bucket = buckets[bucketId] = [];
                  return bucket;
                };
                Grid._bucketAddBody = function(grid, bucket, body) {
                  var gridPairs = grid.pairs, pairId = Pair.id, bucketLength = bucket.length, i;
                  for (i = 0; i < bucketLength; i++) {
                    var bodyB = bucket[i];
                    if (body.id === bodyB.id || body.isStatic && bodyB.isStatic)
                      continue;
                    var id = pairId(body, bodyB), pair = gridPairs[id];
                    if (pair) {
                      pair[2] += 1;
                    } else {
                      gridPairs[id] = [body, bodyB, 1];
                    }
                  }
                  bucket.push(body);
                };
                Grid._bucketRemoveBody = function(grid, bucket, body) {
                  var gridPairs = grid.pairs, pairId = Pair.id, i;
                  bucket.splice(Common.indexOf(bucket, body), 1);
                  var bucketLength = bucket.length;
                  for (i = 0; i < bucketLength; i++) {
                    var pair = gridPairs[pairId(body, bucket[i])];
                    if (pair)
                      pair[2] -= 1;
                  }
                };
                Grid._createActivePairsList = function(grid) {
                  var pair, gridPairs = grid.pairs, pairKeys = Common.keys(gridPairs), pairKeysLength = pairKeys.length, pairs = [], k;
                  for (k = 0; k < pairKeysLength; k++) {
                    pair = gridPairs[pairKeys[k]];
                    if (pair[2] > 0) {
                      pairs.push(pair);
                    } else {
                      delete gridPairs[pairKeys[k]];
                    }
                  }
                  return pairs;
                };
              })();
            }),
            /* 24 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var MouseConstraint = {};
              module2.exports = MouseConstraint;
              var Vertices = __webpack_require__(3);
              var Sleeping = __webpack_require__(7);
              var Mouse = __webpack_require__(14);
              var Events = __webpack_require__(5);
              var Detector = __webpack_require__(13);
              var Constraint = __webpack_require__(10);
              var Composite = __webpack_require__(6);
              var Common = __webpack_require__(0);
              var Bounds = __webpack_require__(1);
              (function() {
                MouseConstraint.create = function(engine, options) {
                  var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
                  if (!mouse) {
                    if (engine && engine.render && engine.render.canvas) {
                      mouse = Mouse.create(engine.render.canvas);
                    } else if (options && options.element) {
                      mouse = Mouse.create(options.element);
                    } else {
                      mouse = Mouse.create();
                      Common.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected");
                    }
                  }
                  var constraint = Constraint.create({
                    label: "Mouse Constraint",
                    pointA: mouse.position,
                    pointB: { x: 0, y: 0 },
                    length: 0.01,
                    stiffness: 0.1,
                    angularStiffness: 1,
                    render: {
                      strokeStyle: "#90EE90",
                      lineWidth: 3
                    }
                  });
                  var defaults = {
                    type: "mouseConstraint",
                    mouse,
                    element: null,
                    body: null,
                    constraint,
                    collisionFilter: {
                      category: 1,
                      mask: 4294967295,
                      group: 0
                    }
                  };
                  var mouseConstraint = Common.extend(defaults, options);
                  Events.on(engine, "beforeUpdate", function() {
                    var allBodies = Composite.allBodies(engine.world);
                    MouseConstraint.update(mouseConstraint, allBodies);
                    MouseConstraint._triggerEvents(mouseConstraint);
                  });
                  return mouseConstraint;
                };
                MouseConstraint.update = function(mouseConstraint, bodies) {
                  var mouse = mouseConstraint.mouse, constraint = mouseConstraint.constraint, body = mouseConstraint.body;
                  if (mouse.button === 0) {
                    if (!constraint.bodyB) {
                      for (var i = 0; i < bodies.length; i++) {
                        body = bodies[i];
                        if (Bounds.contains(body.bounds, mouse.position) && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
                          for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                            var part = body.parts[j];
                            if (Vertices.contains(part.vertices, mouse.position)) {
                              constraint.pointA = mouse.position;
                              constraint.bodyB = mouseConstraint.body = body;
                              constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
                              constraint.angleB = body.angle;
                              Sleeping.set(body, false);
                              Events.trigger(mouseConstraint, "startdrag", { mouse, body });
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      Sleeping.set(constraint.bodyB, false);
                      constraint.pointA = mouse.position;
                    }
                  } else {
                    constraint.bodyB = mouseConstraint.body = null;
                    constraint.pointB = null;
                    if (body)
                      Events.trigger(mouseConstraint, "enddrag", { mouse, body });
                  }
                };
                MouseConstraint._triggerEvents = function(mouseConstraint) {
                  var mouse = mouseConstraint.mouse, mouseEvents = mouse.sourceEvents;
                  if (mouseEvents.mousemove)
                    Events.trigger(mouseConstraint, "mousemove", { mouse });
                  if (mouseEvents.mousedown)
                    Events.trigger(mouseConstraint, "mousedown", { mouse });
                  if (mouseEvents.mouseup)
                    Events.trigger(mouseConstraint, "mouseup", { mouse });
                  Mouse.clearSourceEvents(mouse);
                };
              })();
            }),
            /* 25 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Query = {};
              module2.exports = Query;
              var Vector = __webpack_require__(2);
              var Collision = __webpack_require__(8);
              var Bounds = __webpack_require__(1);
              var Bodies = __webpack_require__(12);
              var Vertices = __webpack_require__(3);
              (function() {
                Query.collides = function(body, bodies) {
                  var collisions = [], bodiesLength = bodies.length, bounds = body.bounds, collides = Collision.collides, overlaps = Bounds.overlaps;
                  for (var i = 0; i < bodiesLength; i++) {
                    var bodyA = bodies[i], partsALength = bodyA.parts.length, partsAStart = partsALength === 1 ? 0 : 1;
                    if (overlaps(bodyA.bounds, bounds)) {
                      for (var j = partsAStart; j < partsALength; j++) {
                        var part = bodyA.parts[j];
                        if (overlaps(part.bounds, bounds)) {
                          var collision = collides(part, body);
                          if (collision) {
                            collisions.push(collision);
                            break;
                          }
                        }
                      }
                    }
                  }
                  return collisions;
                };
                Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
                  rayWidth = rayWidth || 1e-100;
                  var rayAngle = Vector.angle(startPoint, endPoint), rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)), rayX = (endPoint.x + startPoint.x) * 0.5, rayY = (endPoint.y + startPoint.y) * 0.5, ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }), collisions = Query.collides(ray, bodies);
                  for (var i = 0; i < collisions.length; i += 1) {
                    var collision = collisions[i];
                    collision.body = collision.bodyB = collision.bodyA;
                  }
                  return collisions;
                };
                Query.region = function(bodies, bounds, outside) {
                  var result = [];
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i], overlaps = Bounds.overlaps(body.bounds, bounds);
                    if (overlaps && !outside || !overlaps && outside)
                      result.push(body);
                  }
                  return result;
                };
                Query.point = function(bodies, point) {
                  var result = [];
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i];
                    if (Bounds.contains(body.bounds, point)) {
                      for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
                        var part = body.parts[j];
                        if (Bounds.contains(part.bounds, point) && Vertices.contains(part.vertices, point)) {
                          result.push(body);
                          break;
                        }
                      }
                    }
                  }
                  return result;
                };
              })();
            }),
            /* 26 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Render = {};
              module2.exports = Render;
              var Body = __webpack_require__(4);
              var Common = __webpack_require__(0);
              var Composite = __webpack_require__(6);
              var Bounds = __webpack_require__(1);
              var Events = __webpack_require__(5);
              var Vector = __webpack_require__(2);
              var Mouse = __webpack_require__(14);
              (function() {
                var _requestAnimationFrame, _cancelAnimationFrame;
                if (typeof window !== "undefined") {
                  _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    window.setTimeout(function() {
                      callback(Common.now());
                    }, 1e3 / 60);
                  };
                  _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
                }
                Render._goodFps = 30;
                Render._goodDelta = 1e3 / 60;
                Render.create = function(options) {
                  var defaults = {
                    engine: null,
                    element: null,
                    canvas: null,
                    mouse: null,
                    frameRequestId: null,
                    timing: {
                      historySize: 60,
                      delta: 0,
                      deltaHistory: [],
                      lastTime: 0,
                      lastTimestamp: 0,
                      lastElapsed: 0,
                      timestampElapsed: 0,
                      timestampElapsedHistory: [],
                      engineDeltaHistory: [],
                      engineElapsedHistory: [],
                      elapsedHistory: []
                    },
                    options: {
                      width: 800,
                      height: 600,
                      pixelRatio: 1,
                      background: "#14151f",
                      wireframeBackground: "#14151f",
                      hasBounds: !!options.bounds,
                      enabled: true,
                      wireframes: true,
                      showSleeping: true,
                      showDebug: false,
                      showStats: false,
                      showPerformance: false,
                      showBounds: false,
                      showVelocity: false,
                      showCollisions: false,
                      showSeparations: false,
                      showAxes: false,
                      showPositions: false,
                      showAngleIndicator: false,
                      showIds: false,
                      showVertexNumbers: false,
                      showConvexHulls: false,
                      showInternalEdges: false,
                      showMousePosition: false
                    }
                  };
                  var render = Common.extend(defaults, options);
                  if (render.canvas) {
                    render.canvas.width = render.options.width || render.canvas.width;
                    render.canvas.height = render.options.height || render.canvas.height;
                  }
                  render.mouse = options.mouse;
                  render.engine = options.engine;
                  render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
                  render.context = render.canvas.getContext("2d");
                  render.textures = {};
                  render.bounds = render.bounds || {
                    min: {
                      x: 0,
                      y: 0
                    },
                    max: {
                      x: render.canvas.width,
                      y: render.canvas.height
                    }
                  };
                  render.controller = Render;
                  render.options.showBroadphase = false;
                  if (render.options.pixelRatio !== 1) {
                    Render.setPixelRatio(render, render.options.pixelRatio);
                  }
                  if (Common.isElement(render.element)) {
                    render.element.appendChild(render.canvas);
                  }
                  return render;
                };
                Render.run = function(render) {
                  (function loop(time) {
                    render.frameRequestId = _requestAnimationFrame(loop);
                    _updateTiming(render, time);
                    Render.world(render, time);
                    if (render.options.showStats || render.options.showDebug) {
                      Render.stats(render, render.context, time);
                    }
                    if (render.options.showPerformance || render.options.showDebug) {
                      Render.performance(render, render.context, time);
                    }
                  })();
                };
                Render.stop = function(render) {
                  _cancelAnimationFrame(render.frameRequestId);
                };
                Render.setPixelRatio = function(render, pixelRatio) {
                  var options = render.options, canvas = render.canvas;
                  if (pixelRatio === "auto") {
                    pixelRatio = _getPixelRatio(canvas);
                  }
                  options.pixelRatio = pixelRatio;
                  canvas.setAttribute("data-pixel-ratio", pixelRatio);
                  canvas.width = options.width * pixelRatio;
                  canvas.height = options.height * pixelRatio;
                  canvas.style.width = options.width + "px";
                  canvas.style.height = options.height + "px";
                };
                Render.lookAt = function(render, objects, padding, center) {
                  center = typeof center !== "undefined" ? center : true;
                  objects = Common.isArray(objects) ? objects : [objects];
                  padding = padding || {
                    x: 0,
                    y: 0
                  };
                  var bounds = {
                    min: { x: Infinity, y: Infinity },
                    max: { x: -Infinity, y: -Infinity }
                  };
                  for (var i = 0; i < objects.length; i += 1) {
                    var object = objects[i], min = object.bounds ? object.bounds.min : object.min || object.position || object, max = object.bounds ? object.bounds.max : object.max || object.position || object;
                    if (min && max) {
                      if (min.x < bounds.min.x)
                        bounds.min.x = min.x;
                      if (max.x > bounds.max.x)
                        bounds.max.x = max.x;
                      if (min.y < bounds.min.y)
                        bounds.min.y = min.y;
                      if (max.y > bounds.max.y)
                        bounds.max.y = max.y;
                    }
                  }
                  var width = bounds.max.x - bounds.min.x + 2 * padding.x, height = bounds.max.y - bounds.min.y + 2 * padding.y, viewHeight = render.canvas.height, viewWidth = render.canvas.width, outerRatio = viewWidth / viewHeight, innerRatio = width / height, scaleX = 1, scaleY = 1;
                  if (innerRatio > outerRatio) {
                    scaleY = innerRatio / outerRatio;
                  } else {
                    scaleX = outerRatio / innerRatio;
                  }
                  render.options.hasBounds = true;
                  render.bounds.min.x = bounds.min.x;
                  render.bounds.max.x = bounds.min.x + width * scaleX;
                  render.bounds.min.y = bounds.min.y;
                  render.bounds.max.y = bounds.min.y + height * scaleY;
                  if (center) {
                    render.bounds.min.x += width * 0.5 - width * scaleX * 0.5;
                    render.bounds.max.x += width * 0.5 - width * scaleX * 0.5;
                    render.bounds.min.y += height * 0.5 - height * scaleY * 0.5;
                    render.bounds.max.y += height * 0.5 - height * scaleY * 0.5;
                  }
                  render.bounds.min.x -= padding.x;
                  render.bounds.max.x -= padding.x;
                  render.bounds.min.y -= padding.y;
                  render.bounds.max.y -= padding.y;
                  if (render.mouse) {
                    Mouse.setScale(render.mouse, {
                      x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
                      y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height
                    });
                    Mouse.setOffset(render.mouse, render.bounds.min);
                  }
                };
                Render.startViewTransform = function(render) {
                  var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
                  render.context.setTransform(
                    render.options.pixelRatio / boundsScaleX,
                    0,
                    0,
                    render.options.pixelRatio / boundsScaleY,
                    0,
                    0
                  );
                  render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
                };
                Render.endViewTransform = function(render) {
                  render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
                };
                Render.world = function(render, time) {
                  var startTime = Common.now(), engine = render.engine, world = engine.world, canvas = render.canvas, context = render.context, options = render.options, timing = render.timing;
                  var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world), background = options.wireframes ? options.wireframeBackground : options.background, bodies = [], constraints = [], i;
                  var event = {
                    timestamp: engine.timing.timestamp
                  };
                  Events.trigger(render, "beforeRender", event);
                  if (render.currentBackground !== background)
                    _applyBackground(render, background);
                  context.globalCompositeOperation = "source-in";
                  context.fillStyle = "transparent";
                  context.fillRect(0, 0, canvas.width, canvas.height);
                  context.globalCompositeOperation = "source-over";
                  if (options.hasBounds) {
                    for (i = 0; i < allBodies.length; i++) {
                      var body = allBodies[i];
                      if (Bounds.overlaps(body.bounds, render.bounds))
                        bodies.push(body);
                    }
                    for (i = 0; i < allConstraints.length; i++) {
                      var constraint = allConstraints[i], bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointAWorld = constraint.pointA, pointBWorld = constraint.pointB;
                      if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                      if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
                      if (!pointAWorld || !pointBWorld)
                        continue;
                      if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                        constraints.push(constraint);
                    }
                    Render.startViewTransform(render);
                    if (render.mouse) {
                      Mouse.setScale(render.mouse, {
                        x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
                        y: (render.bounds.max.y - render.bounds.min.y) / render.options.height
                      });
                      Mouse.setOffset(render.mouse, render.bounds.min);
                    }
                  } else {
                    constraints = allConstraints;
                    bodies = allBodies;
                    if (render.options.pixelRatio !== 1) {
                      render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
                    }
                  }
                  if (!options.wireframes || engine.enableSleeping && options.showSleeping) {
                    Render.bodies(render, bodies, context);
                  } else {
                    if (options.showConvexHulls)
                      Render.bodyConvexHulls(render, bodies, context);
                    Render.bodyWireframes(render, bodies, context);
                  }
                  if (options.showBounds)
                    Render.bodyBounds(render, bodies, context);
                  if (options.showAxes || options.showAngleIndicator)
                    Render.bodyAxes(render, bodies, context);
                  if (options.showPositions)
                    Render.bodyPositions(render, bodies, context);
                  if (options.showVelocity)
                    Render.bodyVelocity(render, bodies, context);
                  if (options.showIds)
                    Render.bodyIds(render, bodies, context);
                  if (options.showSeparations)
                    Render.separations(render, engine.pairs.list, context);
                  if (options.showCollisions)
                    Render.collisions(render, engine.pairs.list, context);
                  if (options.showVertexNumbers)
                    Render.vertexNumbers(render, bodies, context);
                  if (options.showMousePosition)
                    Render.mousePosition(render, render.mouse, context);
                  Render.constraints(constraints, context);
                  if (options.hasBounds) {
                    Render.endViewTransform(render);
                  }
                  Events.trigger(render, "afterRender", event);
                  timing.lastElapsed = Common.now() - startTime;
                };
                Render.stats = function(render, context, time) {
                  var engine = render.engine, world = engine.world, bodies = Composite.allBodies(world), parts = 0, width = 55, height = 44, x = 0, y = 0;
                  for (var i = 0; i < bodies.length; i += 1) {
                    parts += bodies[i].parts.length;
                  }
                  var sections = {
                    "Part": parts,
                    "Body": bodies.length,
                    "Cons": Composite.allConstraints(world).length,
                    "Comp": Composite.allComposites(world).length,
                    "Pair": engine.pairs.list.length
                  };
                  context.fillStyle = "#0e0f19";
                  context.fillRect(x, y, width * 5.5, height);
                  context.font = "12px Arial";
                  context.textBaseline = "top";
                  context.textAlign = "right";
                  for (var key in sections) {
                    var section = sections[key];
                    context.fillStyle = "#aaa";
                    context.fillText(key, x + width, y + 8);
                    context.fillStyle = "#eee";
                    context.fillText(section, x + width, y + 26);
                    x += width;
                  }
                };
                Render.performance = function(render, context) {
                  var engine = render.engine, timing = render.timing, deltaHistory = timing.deltaHistory, elapsedHistory = timing.elapsedHistory, timestampElapsedHistory = timing.timestampElapsedHistory, engineDeltaHistory = timing.engineDeltaHistory, engineElapsedHistory = timing.engineElapsedHistory, lastEngineDelta = engine.timing.lastDelta;
                  var deltaMean = _mean(deltaHistory), elapsedMean = _mean(elapsedHistory), engineDeltaMean = _mean(engineDeltaHistory), engineElapsedMean = _mean(engineElapsedHistory), timestampElapsedMean = _mean(timestampElapsedHistory), rateMean = timestampElapsedMean / deltaMean || 0, fps = 1e3 / deltaMean || 0;
                  var graphHeight = 4, gap = 12, width = 60, height = 34, x = 10, y = 69;
                  context.fillStyle = "#0e0f19";
                  context.fillRect(0, 50, gap * 4 + width * 5 + 22, height);
                  Render.status(
                    context,
                    x,
                    y,
                    width,
                    graphHeight,
                    deltaHistory.length,
                    Math.round(fps) + " fps",
                    fps / Render._goodFps,
                    function(i) {
                      return deltaHistory[i] / deltaMean - 1;
                    }
                  );
                  Render.status(
                    context,
                    x + gap + width,
                    y,
                    width,
                    graphHeight,
                    engineDeltaHistory.length,
                    lastEngineDelta.toFixed(2) + " dt",
                    Render._goodDelta / lastEngineDelta,
                    function(i) {
                      return engineDeltaHistory[i] / engineDeltaMean - 1;
                    }
                  );
                  Render.status(
                    context,
                    x + (gap + width) * 2,
                    y,
                    width,
                    graphHeight,
                    engineElapsedHistory.length,
                    engineElapsedMean.toFixed(2) + " ut",
                    1 - engineElapsedMean / Render._goodFps,
                    function(i) {
                      return engineElapsedHistory[i] / engineElapsedMean - 1;
                    }
                  );
                  Render.status(
                    context,
                    x + (gap + width) * 3,
                    y,
                    width,
                    graphHeight,
                    elapsedHistory.length,
                    elapsedMean.toFixed(2) + " rt",
                    1 - elapsedMean / Render._goodFps,
                    function(i) {
                      return elapsedHistory[i] / elapsedMean - 1;
                    }
                  );
                  Render.status(
                    context,
                    x + (gap + width) * 4,
                    y,
                    width,
                    graphHeight,
                    timestampElapsedHistory.length,
                    rateMean.toFixed(2) + " x",
                    rateMean * rateMean * rateMean,
                    function(i) {
                      return (timestampElapsedHistory[i] / deltaHistory[i] / rateMean || 0) - 1;
                    }
                  );
                };
                Render.status = function(context, x, y, width, height, count, label, indicator, plotY) {
                  context.strokeStyle = "#888";
                  context.fillStyle = "#444";
                  context.lineWidth = 1;
                  context.fillRect(x, y + 7, width, 1);
                  context.beginPath();
                  context.moveTo(x, y + 7 - height * Common.clamp(0.4 * plotY(0), -2, 2));
                  for (var i = 0; i < width; i += 1) {
                    context.lineTo(x + i, y + 7 - (i < count ? height * Common.clamp(0.4 * plotY(i), -2, 2) : 0));
                  }
                  context.stroke();
                  context.fillStyle = "hsl(" + Common.clamp(25 + 95 * indicator, 0, 120) + ",100%,60%)";
                  context.fillRect(x, y - 7, 4, 4);
                  context.font = "12px Arial";
                  context.textBaseline = "middle";
                  context.textAlign = "right";
                  context.fillStyle = "#eee";
                  context.fillText(label, x + width, y - 5);
                };
                Render.constraints = function(constraints, context) {
                  var c = context;
                  for (var i = 0; i < constraints.length; i++) {
                    var constraint = constraints[i];
                    if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                      continue;
                    var bodyA = constraint.bodyA, bodyB = constraint.bodyB, start, end;
                    if (bodyA) {
                      start = Vector.add(bodyA.position, constraint.pointA);
                    } else {
                      start = constraint.pointA;
                    }
                    if (constraint.render.type === "pin") {
                      c.beginPath();
                      c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                      c.closePath();
                    } else {
                      if (bodyB) {
                        end = Vector.add(bodyB.position, constraint.pointB);
                      } else {
                        end = constraint.pointB;
                      }
                      c.beginPath();
                      c.moveTo(start.x, start.y);
                      if (constraint.render.type === "spring") {
                        var delta = Vector.sub(end, start), normal = Vector.perp(Vector.normalise(delta)), coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20)), offset;
                        for (var j = 1; j < coils; j += 1) {
                          offset = j % 2 === 0 ? 1 : -1;
                          c.lineTo(
                            start.x + delta.x * (j / coils) + normal.x * offset * 4,
                            start.y + delta.y * (j / coils) + normal.y * offset * 4
                          );
                        }
                      }
                      c.lineTo(end.x, end.y);
                    }
                    if (constraint.render.lineWidth) {
                      c.lineWidth = constraint.render.lineWidth;
                      c.strokeStyle = constraint.render.strokeStyle;
                      c.stroke();
                    }
                    if (constraint.render.anchors) {
                      c.fillStyle = constraint.render.strokeStyle;
                      c.beginPath();
                      c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                      c.arc(end.x, end.y, 3, 0, 2 * Math.PI);
                      c.closePath();
                      c.fill();
                    }
                  }
                };
                Render.bodies = function(render, bodies, context) {
                  var c = context, engine = render.engine, options = render.options, showInternalEdges = options.showInternalEdges || !options.wireframes, body, part, i, k;
                  for (i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (!body.render.visible)
                      continue;
                    for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                      part = body.parts[k];
                      if (!part.render.visible)
                        continue;
                      if (options.showSleeping && body.isSleeping) {
                        c.globalAlpha = 0.5 * part.render.opacity;
                      } else if (part.render.opacity !== 1) {
                        c.globalAlpha = part.render.opacity;
                      }
                      if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
                        var sprite = part.render.sprite, texture = _getTexture(render, sprite.texture);
                        c.translate(part.position.x, part.position.y);
                        c.rotate(part.angle);
                        c.drawImage(
                          texture,
                          texture.width * -sprite.xOffset * sprite.xScale,
                          texture.height * -sprite.yOffset * sprite.yScale,
                          texture.width * sprite.xScale,
                          texture.height * sprite.yScale
                        );
                        c.rotate(-part.angle);
                        c.translate(-part.position.x, -part.position.y);
                      } else {
                        if (part.circleRadius) {
                          c.beginPath();
                          c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
                        } else {
                          c.beginPath();
                          c.moveTo(part.vertices[0].x, part.vertices[0].y);
                          for (var j = 1; j < part.vertices.length; j++) {
                            if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                              c.lineTo(part.vertices[j].x, part.vertices[j].y);
                            } else {
                              c.moveTo(part.vertices[j].x, part.vertices[j].y);
                            }
                            if (part.vertices[j].isInternal && !showInternalEdges) {
                              c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                            }
                          }
                          c.lineTo(part.vertices[0].x, part.vertices[0].y);
                          c.closePath();
                        }
                        if (!options.wireframes) {
                          c.fillStyle = part.render.fillStyle;
                          if (part.render.lineWidth) {
                            c.lineWidth = part.render.lineWidth;
                            c.strokeStyle = part.render.strokeStyle;
                            c.stroke();
                          }
                          c.fill();
                        } else {
                          c.lineWidth = 1;
                          c.strokeStyle = "#bbb";
                          c.stroke();
                        }
                      }
                      c.globalAlpha = 1;
                    }
                  }
                };
                Render.bodyWireframes = function(render, bodies, context) {
                  var c = context, showInternalEdges = render.options.showInternalEdges, body, part, i, j, k;
                  c.beginPath();
                  for (i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (!body.render.visible)
                      continue;
                    for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                      part = body.parts[k];
                      c.moveTo(part.vertices[0].x, part.vertices[0].y);
                      for (j = 1; j < part.vertices.length; j++) {
                        if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                          c.lineTo(part.vertices[j].x, part.vertices[j].y);
                        } else {
                          c.moveTo(part.vertices[j].x, part.vertices[j].y);
                        }
                        if (part.vertices[j].isInternal && !showInternalEdges) {
                          c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                        }
                      }
                      c.lineTo(part.vertices[0].x, part.vertices[0].y);
                    }
                  }
                  c.lineWidth = 1;
                  c.strokeStyle = "#bbb";
                  c.stroke();
                };
                Render.bodyConvexHulls = function(render, bodies, context) {
                  var c = context, body, part, i, j, k;
                  c.beginPath();
                  for (i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (!body.render.visible || body.parts.length === 1)
                      continue;
                    c.moveTo(body.vertices[0].x, body.vertices[0].y);
                    for (j = 1; j < body.vertices.length; j++) {
                      c.lineTo(body.vertices[j].x, body.vertices[j].y);
                    }
                    c.lineTo(body.vertices[0].x, body.vertices[0].y);
                  }
                  c.lineWidth = 1;
                  c.strokeStyle = "rgba(255,255,255,0.2)";
                  c.stroke();
                };
                Render.vertexNumbers = function(render, bodies, context) {
                  var c = context, i, j, k;
                  for (i = 0; i < bodies.length; i++) {
                    var parts = bodies[i].parts;
                    for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
                      var part = parts[k];
                      for (j = 0; j < part.vertices.length; j++) {
                        c.fillStyle = "rgba(255,255,255,0.2)";
                        c.fillText(i + "_" + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
                      }
                    }
                  }
                };
                Render.mousePosition = function(render, mouse, context) {
                  var c = context;
                  c.fillStyle = "rgba(255,255,255,0.8)";
                  c.fillText(mouse.position.x + "  " + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
                };
                Render.bodyBounds = function(render, bodies, context) {
                  var c = context, engine = render.engine, options = render.options;
                  c.beginPath();
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i];
                    if (body.render.visible) {
                      var parts = bodies[i].parts;
                      for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                        var part = parts[j];
                        c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
                      }
                    }
                  }
                  if (options.wireframes) {
                    c.strokeStyle = "rgba(255,255,255,0.08)";
                  } else {
                    c.strokeStyle = "rgba(0,0,0,0.1)";
                  }
                  c.lineWidth = 1;
                  c.stroke();
                };
                Render.bodyAxes = function(render, bodies, context) {
                  var c = context, engine = render.engine, options = render.options, part, i, j, k;
                  c.beginPath();
                  for (i = 0; i < bodies.length; i++) {
                    var body = bodies[i], parts = body.parts;
                    if (!body.render.visible)
                      continue;
                    if (options.showAxes) {
                      for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                        part = parts[j];
                        for (k = 0; k < part.axes.length; k++) {
                          var axis = part.axes[k];
                          c.moveTo(part.position.x, part.position.y);
                          c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
                        }
                      }
                    } else {
                      for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                        part = parts[j];
                        for (k = 0; k < part.axes.length; k++) {
                          c.moveTo(part.position.x, part.position.y);
                          c.lineTo(
                            (part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2,
                            (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2
                          );
                        }
                      }
                    }
                  }
                  if (options.wireframes) {
                    c.strokeStyle = "indianred";
                    c.lineWidth = 1;
                  } else {
                    c.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    c.globalCompositeOperation = "overlay";
                    c.lineWidth = 2;
                  }
                  c.stroke();
                  c.globalCompositeOperation = "source-over";
                };
                Render.bodyPositions = function(render, bodies, context) {
                  var c = context, engine = render.engine, options = render.options, body, part, i, k;
                  c.beginPath();
                  for (i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (!body.render.visible)
                      continue;
                    for (k = 0; k < body.parts.length; k++) {
                      part = body.parts[k];
                      c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
                      c.closePath();
                    }
                  }
                  if (options.wireframes) {
                    c.fillStyle = "indianred";
                  } else {
                    c.fillStyle = "rgba(0,0,0,0.5)";
                  }
                  c.fill();
                  c.beginPath();
                  for (i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (body.render.visible) {
                      c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
                      c.closePath();
                    }
                  }
                  c.fillStyle = "rgba(255,165,0,0.8)";
                  c.fill();
                };
                Render.bodyVelocity = function(render, bodies, context) {
                  var c = context;
                  c.beginPath();
                  for (var i = 0; i < bodies.length; i++) {
                    var body = bodies[i];
                    if (!body.render.visible)
                      continue;
                    var velocity = Body.getVelocity(body);
                    c.moveTo(body.position.x, body.position.y);
                    c.lineTo(body.position.x + velocity.x, body.position.y + velocity.y);
                  }
                  c.lineWidth = 3;
                  c.strokeStyle = "cornflowerblue";
                  c.stroke();
                };
                Render.bodyIds = function(render, bodies, context) {
                  var c = context, i, j;
                  for (i = 0; i < bodies.length; i++) {
                    if (!bodies[i].render.visible)
                      continue;
                    var parts = bodies[i].parts;
                    for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                      var part = parts[j];
                      c.font = "12px Arial";
                      c.fillStyle = "rgba(255,255,255,0.5)";
                      c.fillText(part.id, part.position.x + 10, part.position.y - 10);
                    }
                  }
                };
                Render.collisions = function(render, pairs, context) {
                  var c = context, options = render.options, pair, collision, corrected, bodyA, bodyB, i, j;
                  c.beginPath();
                  for (i = 0; i < pairs.length; i++) {
                    pair = pairs[i];
                    if (!pair.isActive)
                      continue;
                    collision = pair.collision;
                    for (j = 0; j < pair.activeContacts.length; j++) {
                      var contact = pair.activeContacts[j], vertex = contact.vertex;
                      c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
                    }
                  }
                  if (options.wireframes) {
                    c.fillStyle = "rgba(255,255,255,0.7)";
                  } else {
                    c.fillStyle = "orange";
                  }
                  c.fill();
                  c.beginPath();
                  for (i = 0; i < pairs.length; i++) {
                    pair = pairs[i];
                    if (!pair.isActive)
                      continue;
                    collision = pair.collision;
                    if (pair.activeContacts.length > 0) {
                      var normalPosX = pair.activeContacts[0].vertex.x, normalPosY = pair.activeContacts[0].vertex.y;
                      if (pair.activeContacts.length === 2) {
                        normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
                        normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
                      }
                      if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) {
                        c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
                      } else {
                        c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
                      }
                      c.lineTo(normalPosX, normalPosY);
                    }
                  }
                  if (options.wireframes) {
                    c.strokeStyle = "rgba(255,165,0,0.7)";
                  } else {
                    c.strokeStyle = "orange";
                  }
                  c.lineWidth = 1;
                  c.stroke();
                };
                Render.separations = function(render, pairs, context) {
                  var c = context, options = render.options, pair, collision, corrected, bodyA, bodyB, i, j;
                  c.beginPath();
                  for (i = 0; i < pairs.length; i++) {
                    pair = pairs[i];
                    if (!pair.isActive)
                      continue;
                    collision = pair.collision;
                    bodyA = collision.bodyA;
                    bodyB = collision.bodyB;
                    var k = 1;
                    if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
                    if (bodyB.isStatic) k = 0;
                    c.moveTo(bodyB.position.x, bodyB.position.y);
                    c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
                    k = 1;
                    if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
                    if (bodyA.isStatic) k = 0;
                    c.moveTo(bodyA.position.x, bodyA.position.y);
                    c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
                  }
                  if (options.wireframes) {
                    c.strokeStyle = "rgba(255,165,0,0.5)";
                  } else {
                    c.strokeStyle = "orange";
                  }
                  c.stroke();
                };
                Render.inspector = function(inspector, context) {
                  var engine = inspector.engine, selected = inspector.selected, render = inspector.render, options = render.options, bounds;
                  if (options.hasBounds) {
                    var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
                    context.scale(1 / boundsScaleX, 1 / boundsScaleY);
                    context.translate(-render.bounds.min.x, -render.bounds.min.y);
                  }
                  for (var i = 0; i < selected.length; i++) {
                    var item = selected[i].data;
                    context.translate(0.5, 0.5);
                    context.lineWidth = 1;
                    context.strokeStyle = "rgba(255,165,0,0.9)";
                    context.setLineDash([1, 2]);
                    switch (item.type) {
                      case "body":
                        bounds = item.bounds;
                        context.beginPath();
                        context.rect(
                          Math.floor(bounds.min.x - 3),
                          Math.floor(bounds.min.y - 3),
                          Math.floor(bounds.max.x - bounds.min.x + 6),
                          Math.floor(bounds.max.y - bounds.min.y + 6)
                        );
                        context.closePath();
                        context.stroke();
                        break;
                      case "constraint":
                        var point = item.pointA;
                        if (item.bodyA)
                          point = item.pointB;
                        context.beginPath();
                        context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                        context.closePath();
                        context.stroke();
                        break;
                    }
                    context.setLineDash([]);
                    context.translate(-0.5, -0.5);
                  }
                  if (inspector.selectStart !== null) {
                    context.translate(0.5, 0.5);
                    context.lineWidth = 1;
                    context.strokeStyle = "rgba(255,165,0,0.6)";
                    context.fillStyle = "rgba(255,165,0,0.1)";
                    bounds = inspector.selectBounds;
                    context.beginPath();
                    context.rect(
                      Math.floor(bounds.min.x),
                      Math.floor(bounds.min.y),
                      Math.floor(bounds.max.x - bounds.min.x),
                      Math.floor(bounds.max.y - bounds.min.y)
                    );
                    context.closePath();
                    context.stroke();
                    context.fill();
                    context.translate(-0.5, -0.5);
                  }
                  if (options.hasBounds)
                    context.setTransform(1, 0, 0, 1, 0, 0);
                };
                var _updateTiming = function(render, time) {
                  var engine = render.engine, timing = render.timing, historySize = timing.historySize, timestamp = engine.timing.timestamp;
                  timing.delta = time - timing.lastTime || Render._goodDelta;
                  timing.lastTime = time;
                  timing.timestampElapsed = timestamp - timing.lastTimestamp || 0;
                  timing.lastTimestamp = timestamp;
                  timing.deltaHistory.unshift(timing.delta);
                  timing.deltaHistory.length = Math.min(timing.deltaHistory.length, historySize);
                  timing.engineDeltaHistory.unshift(engine.timing.lastDelta);
                  timing.engineDeltaHistory.length = Math.min(timing.engineDeltaHistory.length, historySize);
                  timing.timestampElapsedHistory.unshift(timing.timestampElapsed);
                  timing.timestampElapsedHistory.length = Math.min(timing.timestampElapsedHistory.length, historySize);
                  timing.engineElapsedHistory.unshift(engine.timing.lastElapsed);
                  timing.engineElapsedHistory.length = Math.min(timing.engineElapsedHistory.length, historySize);
                  timing.elapsedHistory.unshift(timing.lastElapsed);
                  timing.elapsedHistory.length = Math.min(timing.elapsedHistory.length, historySize);
                };
                var _mean = function(values) {
                  var result = 0;
                  for (var i = 0; i < values.length; i += 1) {
                    result += values[i];
                  }
                  return result / values.length || 0;
                };
                var _createCanvas = function(width, height) {
                  var canvas = document.createElement("canvas");
                  canvas.width = width;
                  canvas.height = height;
                  canvas.oncontextmenu = function() {
                    return false;
                  };
                  canvas.onselectstart = function() {
                    return false;
                  };
                  return canvas;
                };
                var _getPixelRatio = function(canvas) {
                  var context = canvas.getContext("2d"), devicePixelRatio = window.devicePixelRatio || 1, backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
                  return devicePixelRatio / backingStorePixelRatio;
                };
                var _getTexture = function(render, imagePath) {
                  var image = render.textures[imagePath];
                  if (image)
                    return image;
                  image = render.textures[imagePath] = new Image();
                  image.src = imagePath;
                  return image;
                };
                var _applyBackground = function(render, background) {
                  var cssBackground = background;
                  if (/(jpg|gif|png)$/.test(background))
                    cssBackground = "url(" + background + ")";
                  render.canvas.style.background = cssBackground;
                  render.canvas.style.backgroundSize = "contain";
                  render.currentBackground = background;
                };
              })();
            }),
            /* 27 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Runner = {};
              module2.exports = Runner;
              var Events = __webpack_require__(5);
              var Engine = __webpack_require__(17);
              var Common = __webpack_require__(0);
              (function() {
                var _requestAnimationFrame, _cancelAnimationFrame;
                if (typeof window !== "undefined") {
                  _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
                  _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
                }
                if (!_requestAnimationFrame) {
                  var _frameTimeout;
                  _requestAnimationFrame = function(callback) {
                    _frameTimeout = setTimeout(function() {
                      callback(Common.now());
                    }, 1e3 / 60);
                  };
                  _cancelAnimationFrame = function() {
                    clearTimeout(_frameTimeout);
                  };
                }
                Runner.create = function(options) {
                  var defaults = {
                    fps: 60,
                    deltaSampleSize: 60,
                    counterTimestamp: 0,
                    frameCounter: 0,
                    deltaHistory: [],
                    timePrev: null,
                    frameRequestId: null,
                    isFixed: false,
                    enabled: true
                  };
                  var runner = Common.extend(defaults, options);
                  runner.delta = runner.delta || 1e3 / runner.fps;
                  runner.deltaMin = runner.deltaMin || 1e3 / runner.fps;
                  runner.deltaMax = runner.deltaMax || 1e3 / (runner.fps * 0.5);
                  runner.fps = 1e3 / runner.delta;
                  return runner;
                };
                Runner.run = function(runner, engine) {
                  if (typeof runner.positionIterations !== "undefined") {
                    engine = runner;
                    runner = Runner.create();
                  }
                  (function run(time) {
                    runner.frameRequestId = _requestAnimationFrame(run);
                    if (time && runner.enabled) {
                      Runner.tick(runner, engine, time);
                    }
                  })();
                  return runner;
                };
                Runner.tick = function(runner, engine, time) {
                  var timing = engine.timing, delta;
                  if (runner.isFixed) {
                    delta = runner.delta;
                  } else {
                    delta = time - runner.timePrev || runner.delta;
                    runner.timePrev = time;
                    runner.deltaHistory.push(delta);
                    runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
                    delta = Math.min.apply(null, runner.deltaHistory);
                    delta = delta < runner.deltaMin ? runner.deltaMin : delta;
                    delta = delta > runner.deltaMax ? runner.deltaMax : delta;
                    runner.delta = delta;
                  }
                  var event = {
                    timestamp: timing.timestamp
                  };
                  Events.trigger(runner, "beforeTick", event);
                  runner.frameCounter += 1;
                  if (time - runner.counterTimestamp >= 1e3) {
                    runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1e3);
                    runner.counterTimestamp = time;
                    runner.frameCounter = 0;
                  }
                  Events.trigger(runner, "tick", event);
                  Events.trigger(runner, "beforeUpdate", event);
                  Engine.update(engine, delta);
                  Events.trigger(runner, "afterUpdate", event);
                  Events.trigger(runner, "afterTick", event);
                };
                Runner.stop = function(runner) {
                  _cancelAnimationFrame(runner.frameRequestId);
                };
                Runner.start = function(runner, engine) {
                  Runner.run(runner, engine);
                };
              })();
            }),
            /* 28 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var SAT = {};
              module2.exports = SAT;
              var Collision = __webpack_require__(8);
              var Common = __webpack_require__(0);
              var deprecated = Common.deprecated;
              (function() {
                SAT.collides = function(bodyA, bodyB) {
                  return Collision.collides(bodyA, bodyB);
                };
                deprecated(SAT, "collides", "SAT.collides \u27A4 replaced by Collision.collides");
              })();
            }),
            /* 29 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var Svg = {};
              module2.exports = Svg;
              var Bounds = __webpack_require__(1);
              var Common = __webpack_require__(0);
              (function() {
                Svg.pathToVertices = function(path, sampleLength) {
                  if (typeof window !== "undefined" && !("SVGPathSeg" in window)) {
                    Common.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
                  }
                  var i, il, total, point, segment, segments, segmentsQueue, lastSegment, lastPoint, segmentIndex, points = [], lx, ly, length = 0, x = 0, y = 0;
                  sampleLength = sampleLength || 15;
                  var addPoint = function(px, py, pathSegType) {
                    var isRelative = pathSegType % 2 === 1 && pathSegType > 1;
                    if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
                      if (lastPoint && isRelative) {
                        lx = lastPoint.x;
                        ly = lastPoint.y;
                      } else {
                        lx = 0;
                        ly = 0;
                      }
                      var point2 = {
                        x: lx + px,
                        y: ly + py
                      };
                      if (isRelative || !lastPoint) {
                        lastPoint = point2;
                      }
                      points.push(point2);
                      x = lx + px;
                      y = ly + py;
                    }
                  };
                  var addSegmentPoint = function(segment2) {
                    var segType = segment2.pathSegTypeAsLetter.toUpperCase();
                    if (segType === "Z")
                      return;
                    switch (segType) {
                      case "M":
                      case "L":
                      case "T":
                      case "C":
                      case "S":
                      case "Q":
                        x = segment2.x;
                        y = segment2.y;
                        break;
                      case "H":
                        x = segment2.x;
                        break;
                      case "V":
                        y = segment2.y;
                        break;
                    }
                    addPoint(x, y, segment2.pathSegType);
                  };
                  Svg._svgPathToAbsolute(path);
                  total = path.getTotalLength();
                  segments = [];
                  for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
                    segments.push(path.pathSegList.getItem(i));
                  segmentsQueue = segments.concat();
                  while (length < total) {
                    segmentIndex = path.getPathSegAtLength(length);
                    segment = segments[segmentIndex];
                    if (segment != lastSegment) {
                      while (segmentsQueue.length && segmentsQueue[0] != segment)
                        addSegmentPoint(segmentsQueue.shift());
                      lastSegment = segment;
                    }
                    switch (segment.pathSegTypeAsLetter.toUpperCase()) {
                      case "C":
                      case "T":
                      case "S":
                      case "Q":
                      case "A":
                        point = path.getPointAtLength(length);
                        addPoint(point.x, point.y, 0);
                        break;
                    }
                    length += sampleLength;
                  }
                  for (i = 0, il = segmentsQueue.length; i < il; ++i)
                    addSegmentPoint(segmentsQueue[i]);
                  return points;
                };
                Svg._svgPathToAbsolute = function(path) {
                  var x0, y0, x1, y1, x2, y2, segs = path.pathSegList, x = 0, y = 0, len = segs.numberOfItems;
                  for (var i = 0; i < len; ++i) {
                    var seg = segs.getItem(i), segType = seg.pathSegTypeAsLetter;
                    if (/[MLHVCSQTA]/.test(segType)) {
                      if ("x" in seg) x = seg.x;
                      if ("y" in seg) y = seg.y;
                    } else {
                      if ("x1" in seg) x1 = x + seg.x1;
                      if ("x2" in seg) x2 = x + seg.x2;
                      if ("y1" in seg) y1 = y + seg.y1;
                      if ("y2" in seg) y2 = y + seg.y2;
                      if ("x" in seg) x += seg.x;
                      if ("y" in seg) y += seg.y;
                      switch (segType) {
                        case "m":
                          segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                          break;
                        case "l":
                          segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                          break;
                        case "h":
                          segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                          break;
                        case "v":
                          segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                          break;
                        case "c":
                          segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                          break;
                        case "s":
                          segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                          break;
                        case "q":
                          segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                          break;
                        case "t":
                          segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                          break;
                        case "a":
                          segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                          break;
                        case "z":
                        case "Z":
                          x = x0;
                          y = y0;
                          break;
                      }
                    }
                    if (segType == "M" || segType == "m") {
                      x0 = x;
                      y0 = y;
                    }
                  }
                };
              })();
            }),
            /* 30 */
            /***/
            (function(module2, exports2, __webpack_require__) {
              var World = {};
              module2.exports = World;
              var Composite = __webpack_require__(6);
              var Common = __webpack_require__(0);
              (function() {
                World.create = Composite.create;
                World.add = Composite.add;
                World.remove = Composite.remove;
                World.clear = Composite.clear;
                World.addComposite = Composite.addComposite;
                World.addBody = Composite.addBody;
                World.addConstraint = Composite.addConstraint;
              })();
            })
            /******/
          ])
        );
      });
    }
  });

  // src/config/Colors.ts
  var COLORS = {
    // the things in the game: each colour is used wherever its thing shows up (counter, section, cards, pegs, payouts, effects)
    theme: {
      money: "#ffd23a",
      // money icon and prices, gold balls, blast pegs, charged alchemy pegs, bomb payouts
      moneyRim: "#fff3b0",
      // money icon
      moneyRing: "#c99a00",
      // money icon
      research: "#8a5bff",
      // research points, research pegs, the Research button and section
      goo: "#6bff1f",
      // phlegm goo: counter, gooballs, goo caps, the Goo section, powers running
      gooLight: "#dcffbe",
      // the rim of a goo cap
      evil: "#ff2a3d",
      // evil: counter, section, switch, damaged pegs, the bomb
      bucket: "#b6ff2e",
      // buckets, what lands in them, the Bucket section
      bucketBetween: "#ff9d1a",
      // the buckets between the middle and the edges
      bucketOuter: "#ffd23a",
      // the outermost buckets
      pegs: "#ffffff",
      // plain pegs, the Pegs section
      balls: "#ee8aee",
      // the Balls section
      world: "#19f5ff",
      // the World section
      splitter: "#4da3ff",
      // splitter pegs
      gravity: "#2effb0",
      // gravity pegs and their reach, the downdraft
      alchemy: "#8a6a12",
      // an alchemy peg that has not charged up
      electric: "#4dd2ff",
      // the electric field and its arcs
      electricLight: "#e8fbff",
      // its core, sparks and the white inside lightning
      balance: "#ff4fd8",
      // balance field
      chaos: "#ff2bd6",
      // chaos zone and its sparks
      ghost: "#c9c2ff",
      // ghost zone
      dead: "#8f9bbf",
      // dead zone
      power: "#a9a6c8",
      // an empty power peg (a loaded one takes its power's colour)
      antigravity: "#ff8a3d",
      // anti-gravity pegs and their reach
      bouncy: "#ff66c4",
      // bouncy pegs
      wallPeg: "#6f6a9a",
      // wall pegs: big, dull, pay nothing
      blink: "#f4a7ff",
      // blinking pegs
      limiter: "#ffbe5c",
      // cannon limiter pegs on the ceiling
      laser: "#ff3b6b",
      // the laser beam and its power
      slider: "#5ce1e6",
      // slider pegs and their track
      spinner: "#ffb547",
      // spinner bars
      orbit: "#c3f73a",
      // orbit pegs and their circle
      cannon: "#ff9d1a",
      cannonBody: "#1a1038",
      explosion: "#ff9d1a",
      // the bomb going off: fire, BOOM, broken pegs
      explosionLight: "#ffd23a"
      // its bright core and fuse
    },
    // the round buttons at the bottom (research uses theme.research)
    button: {
      settings: "#f2f0ff",
      edit: "#b6ff2e",
      // and DONE in edit mode
      shop: "#ff2bd6",
      powers: "#19f5ff"
    },
    // the screens and text
    ui: {
      page: "#03020c",
      // around the game, and the dimmed outside of the board
      background: "#07051a",
      // the game, the top and bottom bars
      backgroundGlow: "#1a1252",
      // the light at the top of the board
      frame: "#8a5bff",
      // the glow around the game, the board grid and edges, bar edges, scrollbars
      overlay: "#050314",
      // the screens over the board, and the bottom bar meanwhile
      panel: "#100c2e",
      // cards, peg chips, rows, tips
      panelEdge: "#c9c4ff",
      // the top edge of the settings panel
      text: "#e8e6ff",
      strong: "#ffffff",
      // bold text and white details (buy buttons, stats, switches, flashes)
      label: "#8b86b8",
      // titles, levels, BALLS / PEGS, depth numbers
      description: "#b9b5e0",
      // card and tip descriptions
      stat: "#ff2bd6",
      // the BALLS and PEGS numbers
      locked: "#5d5a82",
      // locked cards, buttons and the Locked section
      positive: "#b6ff2e",
      // the hint line, success messages, free pegs
      error: "#ff2a3d",
      // error messages
      negative: "#ff5a6a",
      // what a lost ball had, a spot where a peg cannot go
      boardEditing: "#19f5ff",
      // the board edge in edit mode
      drain: "#ff2bd6",
      // the floor line
      autoLaunch: "#19f5ff",
      // its switch
      shadow: "#000000"
    },
    // the system screen's cards
    system: {
      accent: "#b9b4e0",
      // section titles and switches: calm, one colour for the whole screen
      danger: "#e0576a"
      // reset
    },
    // the board turned red while Evil is on
    evilMode: {
      backgroundGlow: "#9c0f22",
      background: "#3d0510",
      vignette: "#ff1432",
      bars: "#2a0409"
    },
    // a few details
    detail: {
      pegBody: "#0b0825",
      // the inside of every peg
      bombHot: "#ffd0d4"
      // the bomb's fuse blinking
    }
  };
  var BALL_GLOWS = ["#3d8bff", "#4da3ff", "#19a8ff", "#5b7bff", "#7a4dff", "#8a5bff", "#a56bff", "#b78cff"];
  function alpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }
  var kebab = (s2) => s2.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  var cssName = (group, name) => `--${kebab(group)}-${kebab(name)}`;
  var cssColors = () => Object.entries(COLORS).flatMap(([group, colors]) => Object.entries(colors).map(([name, value]) => [cssName(group, name), value]));
  function applyCssColors(root) {
    for (const [name, value] of cssColors()) root.style.setProperty(name, value);
  }

  // src/engine/Settings.ts
  var STEP = 1e3 / 90;
  var MAX_STEPS = 3;
  var DPR_TIERS = [2, 1.5, 1.25, 1];
  var DEBUG = typeof location !== "undefined" && /[?&]debug\b/.test(location.search);

  // src/config/World.ts
  var W = 360;
  var PEG_R = 9;
  var PEG_SHRINK = 0.15;
  var SHRINK_DEPTH = 1500;
  var pegRadius = (y) => PEG_R * (1 - PEG_SHRINK * Math.min(1, (Math.max(0, y) / SHRINK_DEPTH) ** 2));
  var LAUNCH_Y = 38;
  var BUCKET_X = W / 2;
  var LAUNCH_SPEED = 3;
  var SWEEP_MS = 3600;
  var SWEEP_MARGIN = 26;
  var MAX_SPEED = 22;
  var BALL_MAX_AGE = 12e4;
  var GRAVITY_SCALE = 4e-4;
  var G_STEP = GRAVITY_SCALE * STEP * (1e3 / 60);
  var randGlow = () => BALL_GLOWS[Math.random() * BALL_GLOWS.length | 0];
  var LAUNCH_SPREAD = 1;

  // src/engine/Camera.ts
  var Camera = class {
    constructor(worldH) {
      __publicField(this, "worldH");
      __publicField(this, "y");
      __publicField(this, "vel");
      __publicField(this, "scale");
      __publicField(this, "viewH");
      __publicField(this, "padTop");
      __publicField(this, "padBot");
      this.worldH = worldH;
      this.y = 0;
      this.vel = 0;
      this.scale = 1;
      this.viewH = 640;
      this.padTop = 70;
      this.padBot = 100;
    }
    // If the world fits between the HUD and the button bar it is centred and cannot be dragged.
    range() {
      const s2 = this.scale, worldH = this.worldH();
      const lo = -this.padTop / s2, hi = worldH + this.padBot / s2 - this.viewH / s2;
      if (hi >= lo) return [lo, hi];
      const free = this.viewH - this.padTop - this.padBot;
      const c = -(this.padTop + (free - worldH * s2) / 2) / s2;
      return [c, c];
    }
    clamp() {
      const [lo, hi] = this.range();
      this.y = Math.min(hi, Math.max(lo, this.y));
    }
    // momentum scrolling after a drag is let go
    coast(dt, dragging) {
      if (!dragging && Math.abs(this.vel) > 4) {
        this.y += this.vel * dt / 1e3;
        this.vel *= 0.04 ** (dt / 1e3);
        const [lo, hi] = this.range();
        if (this.y < lo || this.y > hi) this.vel = 0;
      } else if (!dragging) this.vel = 0;
      this.clamp();
    }
  };

  // src/engine/Input.ts
  var Input = class {
    constructor(canvas, camera, target) {
      __publicField(this, "canvas");
      __publicField(this, "camera");
      __publicField(this, "target");
      __publicField(this, "drag");
      __publicField(this, "hover");
      this.canvas = canvas;
      this.camera = camera;
      this.target = target;
      this.drag = null;
      this.hover = null;
      canvas.addEventListener("pointerdown", (e) => {
        canvas.setPointerCapture(e.pointerId);
        const item = target.grab(this.toWorld(e.clientX, e.clientY));
        this.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, cam0: camera.y, lastX: e.clientX, lastY: e.clientY, lastT: performance.now(), moved: false, item, touch: e.pointerType !== "mouse" };
        camera.vel = 0;
      });
      canvas.addEventListener("pointermove", (e) => this.move(e));
      canvas.addEventListener("pointerup", (e) => this.end(e, false));
      canvas.addEventListener("pointercancel", (e) => this.end(e, true));
      canvas.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") this.hover = null;
      });
      canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * camera.viewH : e.deltaY;
        camera.vel = 0;
        camera.y += px / camera.scale;
        camera.clamp();
        this.hover = this.toWorld(e.clientX, e.clientY);
      }, { passive: false });
    }
    get dragging() {
      return !!this.drag;
    }
    toWorld(cx, cy) {
      const r = this.canvas.getBoundingClientRect();
      return { x: (cx - r.left) / this.camera.scale, y: (cy - r.top) / this.camera.scale + this.camera.y };
    }
    move(e) {
      const drag = this.drag, cam = this.camera;
      if (e.pointerType === "mouse") this.hover = this.toWorld(e.clientX, e.clientY);
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
      if (!drag.moved) return;
      if (drag.item) {
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        this.target.dragTo(drag.item, this.toWorld(e.clientX, e.clientY), drag.touch);
        return;
      }
      cam.y = drag.cam0 - dy / cam.scale;
      cam.clamp();
      const now = performance.now(), dt = now - drag.lastT;
      if (dt > 0) {
        const v = (drag.lastY - e.clientY) / cam.scale / dt * 1e3;
        cam.vel = cam.vel * 0.5 + v * 0.5;
      }
      drag.lastY = e.clientY;
      drag.lastT = now;
    }
    end(e, cancelled) {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      this.drag = null;
      if (d.item && d.moved) {
        this.target.drop(d.item, this.toWorld(e.clientX, e.clientY));
        return;
      }
      if (cancelled) return;
      if (!d.moved) {
        this.camera.vel = 0;
        this.target.tap(this.toWorld(e.clientX, e.clientY));
      } else if (performance.now() - d.lastT > 90) this.camera.vel = 0;
    }
    // while an item is dragged near the top or bottom of the visible board, the board scrolls along
    update(dt) {
      const d = this.drag;
      if (!d?.item || !d.moved) return;
      const cam = this.camera, y = d.lastY - this.canvas.getBoundingClientRect().top, edge = 48;
      const dir = y < cam.padTop + edge ? -1 : y > cam.viewH - cam.padBot - edge ? 1 : 0;
      if (!dir) return;
      cam.y += dir * 420 / cam.scale * dt / 1e3;
      cam.clamp();
      this.target.dragTo(d.item, this.toWorld(d.lastX, d.lastY), d.touch);
    }
  };

  // src/util/Canvas.ts
  var TAU = Math.PI * 2;
  var FONT_BIG = "800 15px system-ui,sans-serif";
  var FONT_SMALL = "700 11px system-ui,sans-serif";
  var FONT_HUGE = "900 24px system-ui,sans-serif";
  var mixCache = {};
  function mixCol(a, b, t) {
    const k = a + b + t;
    if (mixCache[k]) return mixCache[k];
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = (s2) => Math.round((pa >> s2 & 255) * (1 - t) + (pb >> s2 & 255) * t);
    return mixCache[k] = `#${(1 << 24 | ch(16) << 16 | ch(8) << 8 | ch(0)).toString(16).slice(1)}`;
  }
  var glowCache = {};
  function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = context2d(c);
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `${color}ff`);
    gr.addColorStop(0.35, `${color}77`);
    gr.addColorStop(1, `${color}00`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return glowCache[color] = c;
  }
  function hexPath(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + Math.PI / 6, px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      if (i) g.lineTo(px, py);
      else g.moveTo(px, py);
    }
    g.closePath();
  }
  function trianglePath(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 3, px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      if (i) g.lineTo(px, py);
      else g.moveTo(px, py);
    }
    g.closePath();
  }
  function context2d(c) {
    const g = c.getContext("2d");
    if (!g) throw new Error("2D canvas not available");
    return g;
  }

  // src/util/MathUtil.ts
  var rand = (a, b) => a + Math.random() * (b - a);
  var soft = (start, limit, rate, l) => limit - (limit - start) * rate ** l;

  // src/engine/Renderer.ts
  var Renderer = class {
    constructor(canvas, camera, worldW) {
      __publicField(this, "canvas");
      __publicField(this, "ctx");
      __publicField(this, "camera");
      __publicField(this, "worldW");
      __publicField(this, "dpr");
      __publicField(this, "cssW");
      __publicField(this, "tier");
      __publicField(this, "sprites");
      __publicField(this, "icons");
      __publicField(this, "partCache");
      __publicField(this, "ox");
      __publicField(this, "oy");
      this.canvas = canvas;
      this.ctx = context2d(canvas);
      this.camera = camera;
      this.worldW = worldW;
      this.dpr = 1;
      this.cssW = 360;
      this.tier = navigator.deviceMemory && navigator.deviceMemory <= 4 ? 1 : 0;
      this.sprites = {};
      this.icons = {};
      this.partCache = /* @__PURE__ */ new Map();
      this.ox = 0;
      this.oy = 0;
    }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.cssW = r.width;
      this.dpr = Math.min(window.devicePixelRatio || 1, DPR_TIERS[this.tier]);
      this.canvas.width = Math.round(r.width * this.dpr);
      this.canvas.height = Math.round(r.height * this.dpr);
      this.camera.scale = r.width / this.worldW;
      this.camera.viewH = r.height;
      this.sprites = {};
    }
    // one quality tier down (call resize() after); false when already at the lowest
    lowerQuality() {
      if (this.tier >= DPR_TIERS.length - 1) return false;
      this.tier++;
      return true;
    }
    glow(color, x, y, size, alpha2) {
      const ctx = this.ctx;
      ctx.globalAlpha = alpha2;
      ctx.drawImage(glowSprite(color), x - size / 2, y - size / 2, size, size);
      ctx.globalAlpha = 1;
    }
    // the old shadowBlur glow, faked with a wide faint stroke under the real one (shadowBlur is very slow on phones)
    glowStroke(color, width, glowW, glowA) {
      const ctx = this.ctx;
      ctx.strokeStyle = color;
      ctx.globalAlpha = glowA;
      ctx.lineWidth = glowW;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    // a: how far we are between the last two physics steps (0..1), so moving things are drawn smoothly at any refresh rate
    render(a, scene) {
      const { ctx, camera } = this, k = this.dpr * camera.scale, shake = scene.effects.shake * this.dpr;
      this.ox = shake ? rand(-shake, shake) : 0;
      this.oy = shake ? rand(-shake, shake) : 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.worldTransform(k);
      const top = camera.y - 40, bot = camera.y + camera.viewH / camera.scale + 40;
      scene.draw(a, k, top, bot);
      this.drawFlash(scene.effects);
    }
    // world units -> device pixels, scrolled by the camera and offset by the screen shake
    worldTransform(k) {
      this.ctx.setTransform(k, 0, 0, k, this.ox, this.oy - this.camera.y * k);
    }
    drawFlash(fx) {
      const f = fx.flash, ctx = this.ctx;
      if (f.a <= 0) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = f.a;
      ctx.fillStyle = f.color;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.globalAlpha = 1;
    }
    // lightning: a fresh jagged path every frame (so it flickers), a wide coloured glow under a thin white core
    drawBolts(fx) {
      const ctx = this.ctx, pts = [];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const bl of fx.bolts) {
        const dx = bl.x2 - bl.x1, dy = bl.y2 - bl.y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
        const n = Math.max(2, Math.ceil(d / 9)), amp = Math.min(6, d * 0.15), a = bl.life / bl.max;
        pts.length = 0;
        for (let i = 0; i <= n; i++) {
          const t = i / n, off = i === 0 || i === n ? 0 : rand(-amp, amp);
          pts.push(bl.x1 + dx * t + nx * off, bl.y1 + dy * t + ny * off);
        }
        for (const [col, w, alpha2] of [[bl.color, 5, 0.4 * a], [COLORS.theme.electricLight, 1.6, a]]) {
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.globalAlpha = alpha2;
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    drawEffects(fx, top, bot) {
      const ctx = this.ctx;
      ctx.globalCompositeOperation = "lighter";
      this.drawBolts(fx);
      for (const q of fx.particles) {
        if (q.y < top || q.y > bot) continue;
        this.glow(q.color, q.x, q.y, q.size, q.life / q.max);
      }
      for (const g of fx.rings) {
        const life = g.life / g.max, rr = g.r0 + (g.r1 - g.r0) * (1 - life ** 3);
        if (g.fill) this.glow(g.color, g.x, g.y, rr * 2, 0.7 * life);
        ctx.globalAlpha = life;
        ctx.strokeStyle = g.color;
        ctx.lineWidth = g.width * (0.4 + 0.6 * life);
        ctx.beginPath();
        ctx.arc(g.x, g.y, rr, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      let lastFont = "";
      for (const f of fx.floaters) {
        if (f.y < top || f.y > bot) continue;
        ctx.globalAlpha = Math.min(1, f.life / f.max * 1.6) * (f.dim ? 0.55 : 1);
        const font = f.huge ? FONT_HUGE : f.big ? FONT_BIG : FONT_SMALL;
        if (font !== lastFont) {
          ctx.font = lastFont = font;
        }
        ctx.fillStyle = f.color;
        this.richText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;
    }
    // x for centred text, moved in so the whole text stays inside the world's width (uses the current font)
    onBoard(text, x) {
      const half = this.ctx.measureText(text).width / 2 + 3;
      return Math.min(this.worldW - half, Math.max(half, x));
    }
    // a text split into its words and {name} icons (cached: the same texts come back every frame)
    textParts(text) {
      let parts = this.partCache.get(text);
      if (parts) return parts;
      parts = text.split(/\{([a-zA-Z]+)\}/).map((s2, i) => i % 2 && this.icons[s2] ? { icon: this.icons[s2] } : i % 2 ? `{${s2}}` : s2).filter((p) => p !== "");
      if (this.partCache.size > 400) this.partCache.clear();
      this.partCache.set(text, parts);
      return parts;
    }
    // centred text with {name} icons (from this.icons, at the current font's size), kept inside the world's width;
    // the text takes the current fillStyle, the icons keep their own colours
    richText(text, x, y) {
      const ctx = this.ctx;
      if (!text.includes("{")) {
        ctx.textAlign = "center";
        ctx.fillText(text, this.onBoard(text, x), y);
        return;
      }
      const parts = this.textParts(text), px = Number(/(\d+(?:\.\d+)?)px/.exec(ctx.font)?.[1] ?? 12), size = px * 1.05, gap = px * 0.1;
      const widths = parts.map((p) => typeof p === "string" ? ctx.measureText(p).width : size + 2 * gap);
      const total = widths.reduce((a, w) => a + w, 0);
      let left = Math.min(this.worldW - 3 - total, Math.max(3, x - total / 2));
      ctx.textAlign = "left";
      parts.forEach((p, i) => {
        if (typeof p === "string") ctx.fillText(p, left, y);
        else ctx.drawImage(p.icon, left + gap, y - px * 0.86, size, size);
        left += widths[i];
      });
      ctx.textAlign = "center";
    }
    // the ?debug readout, in a bar just above the buttons
    drawDebug(text) {
      const ctx = this.ctx, y = this.camera.viewH - this.camera.padBot;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.fillStyle = alpha(COLORS.ui.shadow, 0.7);
      ctx.fillRect(0, y - 18, this.cssW, 18);
      ctx.fillStyle = COLORS.ui.strong;
      ctx.font = "600 11px system-ui,sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(text, 6, y - 5);
    }
  };

  // src/engine/Effects.ts
  var Effects = class {
    constructor() {
      __publicField(this, "particles");
      __publicField(this, "floaters");
      __publicField(this, "rings");
      __publicField(this, "bolts");
      __publicField(this, "shake");
      __publicField(this, "flash");
      this.particles = [];
      this.floaters = [];
      this.rings = [];
      this.bolts = [];
      this.shake = 0;
      this.flash = { color: COLORS.ui.strong, a: 0 };
    }
    // speed in px/s, angle range in radians (default all around; canvas y points down, so pi..2pi is upwards)
    // always = may go past the normal particle cap (big moments only)
    burst(x, y, color, n, { speed = [40, 130], angle = [0, 6.283], size = 10, life = 450, always = false } = {}) {
      for (let i = 0; i < n && this.particles.length < (always ? 400 : 250); i++) {
        const a = rand(angle[0], angle[1]), s2 = rand(speed[0], speed[1]);
        this.particles.push({ x, y, vx: Math.cos(a) * s2, vy: Math.sin(a) * s2, life, max: life, color, size });
      }
    }
    // small numbers are skipped when 30 are already showing; always = shown anyway (big rewards)
    // dim = drawn fainter (rewards a ball collected, not paid out yet)
    float(x, y, text, color, { big = false, huge = false, dim = false, life = 800, always = false } = {}) {
      if (!always && this.floaters.length >= 30) return;
      this.floaters.push({ x, y, text, color, big, huge, dim, life, max: life });
    }
    // a ring growing from r0 to r1; fill = also a soft glowing disc inside it
    ring(x, y, r0, r1, color, { life = 500, width = 4, fill = false } = {}) {
      this.rings.push({ x, y, r0, r1, color, life, max: life, width, fill });
    }
    bolt(x1, y1, x2, y2, color, life = 320) {
      this.bolts.push({ x1, y1, x2, y2, color, life, max: life });
    }
    screen(color, alpha2, shake) {
      this.flash = { color, a: Math.max(this.flash.a, alpha2) };
      this.shake = Math.max(this.shake, shake);
    }
    tick(dt) {
      this.shake = Math.max(0, this.shake - dt * 0.025);
      this.flash.a = Math.max(0, this.flash.a - dt / 450);
      for (let i = this.rings.length - 1; i >= 0; i--) if ((this.rings[i].life -= dt) <= 0) this.rings.splice(i, 1);
      for (let i = this.bolts.length - 1; i >= 0; i--) if ((this.bolts[i].life -= dt) <= 0) this.bolts.splice(i, 1);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const q = this.particles[i];
        q.life -= dt;
        q.x += q.vx * dt / 1e3;
        q.y += q.vy * dt / 1e3;
        q.vy += 300 * dt / 1e3;
        if (q.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floaters.length - 1; i >= 0; i--) {
        const f = this.floaters[i];
        f.life -= dt;
        f.y -= 28 * dt / 1e3;
        if (f.life <= 0) this.floaters.splice(i, 1);
      }
    }
  };

  // src/engine/Physics.ts
  var import_matter_js = __toESM(require_matter(), 1);
  var Physics = class {
    constructor(hooks, { width, gravityScale }) {
      __publicField(this, "engine");
      __publicField(this, "world");
      __publicField(this, "walls");
      __publicField(this, "gravityScale");
      const { Engine, Bodies, Composite } = import_matter_js.default;
      this.engine = Engine.create();
      this.engine.gravity.y = 1;
      this.engine.gravity.scale = this.gravityScale = gravityScale;
      this.world = this.engine.world;
      const o = { isStatic: true, restitution: 0.5, friction: 0, label: "wall", collisionFilter: { category: 4, mask: 4294967295, group: 0 } };
      this.walls = [
        Bodies.rectangle(-30, 5e5, 60, 1e6, o),
        // left (very tall: the board has no maximum height)
        Bodies.rectangle(width + 30, 5e5, 60, 1e6, o),
        // right
        Bodies.rectangle(width / 2, -30, width + 200, 60, { ...o, label: "ceiling" })
      ];
      Composite.add(this.world, this.walls);
      this.installDetector(hooks);
      this.installContactRules(hooks);
    }
    // Matter's detector sweeps over every body on every step, which gets slow with hundreds of static bodies.
    // Only movers ever collide (movers ignore each other, the rest is static), so check just the movers against nearby static bodies and the walls.
    installDetector({ movers, staticNear }) {
      const Detector = import_matter_js.default.Detector, Collision = import_matter_js.default.Collision;
      if (!(Detector && Collision?.collides)) return;
      const walls = this.walls;
      Detector.collisions = (detector) => {
        const out = [], pairs = detector.pairs;
        const test = (A, B) => {
          const a = A.bounds, b = B.bounds;
          if (b.min.x > a.max.x || b.max.x < a.min.x || b.min.y > a.max.y || b.max.y < a.min.y) return;
          if (!Detector.canCollide(A.collisionFilter, B.collisionFilter)) return;
          const c = Collision.collides(A, B, pairs);
          if (c) out.push(c);
        };
        for (const m of movers) {
          const A = m.body, a = A.bounds;
          for (const w of walls) test(A, w);
          for (const s2 of staticNear(a.min.x, a.min.y, a.max.x, a.max.y)) test(A, s2.body);
        }
        return out;
      };
    }
    installContactRules({ onPairs }) {
      const Pairs = import_matter_js.default.Pairs, update = Pairs.update;
      Pairs.update = (pairs, collisions, timestamp) => {
        update(pairs, collisions, timestamp);
        onPairs(pairs.list);
      };
    }
    onCollisionStart(fn) {
      import_matter_js.default.Events.on(this.engine, "collisionStart", (ev) => fn(ev.pairs));
    }
    // new bodies are B once the game has attached its own fields. sides: 0 a circle of radius r, else a polygon with its
    // points r from the centre (a hexagon has a point at the top, like hexPath(); a triangle is turned to have one too, like trianglePath())
    addPeg(x, y, r, sides) {
      const { Bodies, Body, Composite } = import_matter_js.default;
      const po = { isStatic: true, restitution: 0.5, friction: 0, label: "peg" };
      const body = sides ? Bodies.polygon(x, y, sides, r, po) : Bodies.circle(x, y, r, po);
      if (sides === 3) Body.rotate(body, -Math.PI / 6);
      Composite.add(this.world, body);
      return body;
    }
    // Balls never collide with each other: category 2 is not in their mask (1 = pegs, 4 = walls).
    addBall(x, y, r, vx, vy, bounce) {
      const body = import_matter_js.default.Bodies.circle(x, y, r, {
        restitution: bounce,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        density: 2e-3,
        collisionFilter: { category: 2, mask: 5 },
        label: "ball"
      });
      import_matter_js.default.Body.setVelocity(body, { x: vx, y: vy });
      import_matter_js.default.Composite.add(this.world, body);
      return body;
    }
    // a bar (a rotating peg): len long, thick across
    addBar(x, y, len, thick) {
      const body = import_matter_js.default.Bodies.rectangle(x, y, len, thick, { isStatic: true, restitution: 0.5, friction: 0, label: "peg", chamfer: { radius: thick / 2 } });
      import_matter_js.default.Composite.add(this.world, body);
      return body;
    }
    remove(body) {
      import_matter_js.default.Composite.remove(this.world, body);
    }
    // moving: true for a peg that keeps moving (its speed is set from the step, so it bats balls); false to just put it somewhere,
    // standing still (Matter would otherwise keep the speed it had: a static body's speed is where it is minus where it was)
    movePeg(body, x, y, moving = false) {
      import_matter_js.default.Body.setPosition(body, { x, y }, moving);
      if (!moving) {
        const prev = body.positionPrev;
        prev.x = x;
        prev.y = y;
      }
    }
    turnPeg(body, angle, moving = false) {
      import_matter_js.default.Body.setAngle(body, angle, moving);
      if (!moving) body.anglePrev = angle;
    }
    resizePeg(body, factor) {
      import_matter_js.default.Body.scale(body, factor, factor);
    }
    // a peg that is not solid touches nothing, but stays in the world (cheaper than removing and adding it back)
    setPegSolid(body, on) {
      body.collisionFilter.mask = on ? 4294967295 : 0;
    }
    // velocities in px per 1/60 s, the units setVelocity takes (body.velocity is per 1/90 s physics step)
    velocity(body) {
      return import_matter_js.default.Body.getVelocity(body);
    }
    setVelocity(body, x, y) {
      import_matter_js.default.Body.setVelocity(body, { x, y });
    }
    // extra gravity on one body for the next update (mult: times normal gravity)
    addGravity(body, mult) {
      body.force.y += body.mass * this.engine.gravity.y * this.gravityScale * mult;
    }
    update(dt) {
      import_matter_js.default.Engine.update(this.engine, dt);
    }
  };

  // src/upgrades/Types.ts
  var defineIn = (list) => (id, u) => {
    list.push({ id, ...u });
  };

  // src/util/Format.ts
  var SUF = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  function fmt(n) {
    if (!Number.isFinite(n)) return "\u221E";
    if (n < 1e3) return n >= 100 || Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1);
    const e = Math.floor(Math.log10(n) / 3);
    if (e >= SUF.length) return n.toExponential(2);
    const v = n / 1e3 ** e;
    return (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0)) + SUF[e];
  }
  var secs = (ms) => `${(ms / 1e3).toFixed(ms < 1e3 ? 2 : 1)}s`;
  var evFmt = (n) => n < 100 ? n.toFixed(2) : fmt(n);

  // src/upgrades/MoneyUpgrades.ts
  var MONEY_MAX = 5;
  var CAP_STEP = 5;
  var MONEY_UPGRADES = [];
  var upgrade = defineIn(MONEY_UPGRADES);
  var bucketValue = (l) => 1 + l;
  upgrade("bucket_value", {
    section: "bucket",
    tab: "money",
    name: "Bucket Value",
    max: 10 * MONEY_MAX,
    costs: { money: { base: 5, growth: 1.3 } },
    desc: "Buckets pay more.",
    stat: (l) => `{money}${fmt(bucketValue(l))} per catch`
  });
  var START_SLOTS = 3;
  upgrade("peg_slots", {
    section: "pegs",
    tab: "money",
    name: "Peg Slots",
    max: 0,
    required: [{ id: "bucket_value", level: 2 }],
    costs: { money: { base: 5, growth: 1.2 } },
    desc: "Room for more pegs.",
    stat: (l) => `${START_SLOTS + l} slots`
  });
  upgrade("peg_value", {
    section: "pegs",
    tab: "money",
    name: "Peg Value",
    max: MONEY_MAX,
    required: [{ id: "peg_slots", level: 5 }],
    costs: { money: { base: 20, growth: 1.5 } },
    desc: "Pegs pay more per hit.",
    stat: (l) => `{money}${fmt(1 + l)} per hit`
  });
  upgrade("extra_ball", {
    section: "balls",
    tab: "money",
    name: "Extra Ball",
    max: MONEY_MAX,
    required: [{ id: "peg_value", level: 2 }],
    costs: { money: { base: 50, growth: 2.4 } },
    desc: "One more ball in play at once.",
    stat: (l) => `${1 + l} ball${l ? "s" : ""} at once`
  });
  upgrade("peg_power", {
    section: "pegs",
    tab: "money",
    name: "Peg Power",
    max: MONEY_MAX,
    required: [{ id: "peg_slots", level: 10 }],
    costs: { money: { base: 120, growth: 1.8 } },
    desc: "Multiplies every peg hit.",
    stat: (l) => `x${(1 + 0.5 * l).toFixed(1)}`
  });
  var bucketW = (l) => soft(160, 280, 0.89, l);
  upgrade("wide_bucket", {
    section: "bucket",
    tab: "money",
    name: "Wide Bucket",
    max: MONEY_MAX,
    required: [{ id: "bucket_value", level: 8 }],
    costs: { money: { base: 120, growth: 1.9 } },
    desc: "Wider buckets are easier to hit.",
    stat: (l) => `${Math.round(bucketW(l))} wide`
  });
  var LAB_FIRST = 1e4;
  var LAB_MIN = 50;
  var labInterval = (l) => LAB_MIN + (LAB_FIRST - LAB_MIN) / l;
  upgrade("research_lab", {
    section: "research",
    tab: "money",
    name: "Research Lab",
    max: MONEY_MAX,
    required: [
      { id: "extra_ball" },
      { id: "wide_bucket" },
      { id: "peg_power" }
    ],
    costs: { money: { base: 1e3, growth: 1.7 } },
    desc: "Unlocks Research. Makes {research} on a timer, a bit faster each level.",
    stat: (l) => l ? `1 tick every ${secs(labInterval(l))}` : "no research"
  });
  var wallMult = (l) => 1 + 0.5 * l;
  upgrade("wall_value", {
    section: "world",
    tab: "money",
    name: "Wall Value",
    max: MONEY_MAX,
    required: [{ id: "wall_bounce" }],
    costs: { money: { base: 300, growth: 1.7 } },
    desc: "Wall bounces pay more.",
    stat: (l) => `x${wallMult(l).toFixed(1)} a peg hit`
  });
  upgrade("research_batch", {
    section: "research",
    tab: "money",
    name: "Research Batch",
    max: MONEY_MAX,
    required: [{ id: "research_lab", level: 3 }],
    costs: { money: { base: 25e3, growth: 3 } },
    desc: "More {research} per lab tick.",
    stat: (l) => `{research}${1 + l} per tick`
  });
  var RP_PEG = 1;
  var rpPerHit = (l) => RP_PEG * (1 + l);
  upgrade("research_pegs_value", {
    section: "pegs",
    tab: "money",
    name: "Research Pegs Value",
    max: MONEY_MAX,
    required: [{ id: "research_pegs" }],
    costs: { money: { base: 3e3, growth: 1.9 } },
    desc: "Research pegs pay more.",
    stat: (l) => `{research}${fmt(rpPerHit(l))} per hit`
  });
  upgrade("combo_chain", {
    section: "pegs",
    tab: "money",
    name: "Combo Chain",
    max: MONEY_MAX,
    required: [{ id: "combo_theory" }],
    costs: { money: { base: 400, growth: 1.7 }, research: { base: 5, growth: 1.5 } },
    desc: "Hits in a row by the same ball pay more.",
    stat: (l) => `+${5 * l}% per hit in a row`
  });
  var ALCH_MS = 1e4;
  var ALCH_MIN = 1;
  var alchMax = (l) => 100 + 50 * l;
  upgrade("alchemy_pegs_value", {
    section: "pegs",
    tab: "money",
    name: "Alchemy Pegs Value",
    max: MONEY_MAX,
    required: [{ id: "alchemy" }],
    costs: { money: { base: 2500, growth: 1.9 }, research: { base: 8, growth: 1.5 } },
    desc: "Alchemy pegs charge to a higher value.",
    stat: (l) => `up to {money}${fmt(alchMax(l))} per hit`
  });
  var DUAL_HITS = 5;
  var DUAL_MULT = 20;
  var blastHits = (l) => DUAL_HITS + l;
  upgrade("blast_peg_hits", {
    section: "pegs",
    tab: "money",
    name: "Blast Peg Hits",
    max: MONEY_MAX,
    required: [{ id: "blast_pegs" }],
    costs: { money: { base: 2e3, growth: 2 } },
    desc: "Blast pegs last more hits, placed ones too.",
    stat: (l) => `${blastHits(l)} hits per blast peg`
  });
  var blastMult = (l) => DUAL_MULT + l;
  upgrade("blast_peg_value", {
    section: "pegs",
    tab: "money",
    name: "Blast Peg Value",
    max: MONEY_MAX,
    required: [{ id: "blast_pegs" }],
    costs: { money: { base: 1500, growth: 2 } },
    desc: "Blast pegs pay more.",
    stat: (l) => `x${blastMult(l)}`
  });
  var POWER_HITS = 10;
  var POWER_HITS_MIN = 4;
  var powerHits = (l) => Math.max(POWER_HITS_MIN, POWER_HITS - l);
  var castCost = (l) => 0.5 + 0.5 * 0.9 ** l;
  var powerPegMax = (l) => 1 + l;
  upgrade("power_peg_charge", {
    section: "pegs",
    tab: "money",
    name: "Power Peg Charge",
    max: POWER_HITS - POWER_HITS_MIN,
    uncapped: true,
    required: [{ id: "power_pegs" }],
    costs: { money: { base: 3e4, growth: 2.2 }, evil: { base: 50, growth: 1.8 } },
    desc: "Power pegs cast with fewer hits.",
    stat: (l) => `every ${powerHits(l)} hits`
  });
  upgrade("efficient_casting", {
    section: "pegs",
    tab: "money",
    name: "Efficient Casting",
    max: 0,
    required: [{ id: "power_pegs" }],
    costs: { money: { base: 2e4, growth: 1.8 }, goo: { base: 100, growth: 1.5 } },
    desc: "Power peg casts cost less, never below half.",
    stat: (l) => `${(castCost(l) * 100).toFixed(1)}% of the power's price`
  });
  upgrade("power_peg_slots", {
    section: "pegs",
    tab: "money",
    name: "Power Peg Slots",
    max: 0,
    required: [{ id: "power_pegs" }],
    costs: { money: { base: 1e5, growth: 4 }, evil: { base: 300, growth: 2.5 } },
    desc: "One more power peg on the board.",
    stat: (l) => `${powerPegMax(l)} power peg${powerPegMax(l) > 1 ? "s" : ""}`
  });
  var zoneSize = (l) => 1.15 ** l;
  var zoneTime = (l) => 1 + 0.15 * l;
  upgrade("wider_zones", {
    section: "world",
    tab: "money",
    name: "Wider Zones",
    max: MONEY_MAX,
    required: [{ id: "ghost_power" }],
    costs: { money: { base: 25e3, growth: 2 }, goo: { base: 80, growth: 1.6 } },
    desc: "Power zones cover more of the board.",
    stat: (l) => `x${zoneSize(l).toFixed(2)} size`
  });
  upgrade("longer_zones", {
    section: "world",
    tab: "money",
    name: "Longer Zones",
    max: MONEY_MAX,
    required: [{ id: "ghost_power" }],
    costs: { money: { base: 25e3, growth: 2 }, goo: { base: 80, growth: 1.6 } },
    desc: "Power zones last longer.",
    stat: (l) => `x${zoneTime(l).toFixed(2)} time`
  });
  upgrade("laser_focus", {
    section: "world",
    tab: "money",
    name: "Laser Focus",
    max: MONEY_MAX,
    required: [{ id: "laser_power" }],
    costs: { money: { base: 2e4, growth: 2.2 } },
    desc: "The laser activates more times per pulse.",
    stat: (l) => `${1 + l} per pulse`
  });
  var restitution = (l) => soft(0.5, 0.9, 0.96, l);
  upgrade("bouncy_balls", {
    section: "balls",
    tab: "money",
    name: "Bouncy Balls",
    max: 0,
    required: [{ id: "elastic_balls" }],
    costs: { money: { base: 1200, growth: 1.9 }, goo: { base: 77, growth: 1.6 } },
    desc: "Balls bounce higher. No max level, but never reaches 90%.",
    stat: (l) => `${(restitution(l) * 100).toFixed(1)}% bounce`
  });
  var ballRadius = (l) => soft(6, 14, 0.93, l);
  upgrade("fat_balls", {
    section: "balls",
    tab: "money",
    name: "Fat Balls",
    max: MONEY_MAX,
    required: [{ id: "ball_inflation" }],
    costs: { money: { base: 2e3, growth: 1.9 } },
    desc: "Bigger balls hit more pegs.",
    stat: (l) => `radius ${ballRadius(l).toFixed(1)} (max 14)`
  });
  var worldHeight = (l) => Math.round(360 + 130 * l ** 0.9);
  upgrade("deeper_world", {
    section: "world",
    tab: "money",
    name: "Deeper World",
    max: 0,
    required: [{ id: "world_size" }],
    costs: { money: { base: 2e4, growth: 1.8 }, research: { base: 100, growth: 1.5 } },
    desc: "A taller board. Each level adds a bit less, with no max.",
    stat: (l) => `${worldHeight(l)} tall`
  });
  var autoInterval = (l) => 2e3 * 0.85 ** (l - 1);
  upgrade("faster_dropper", {
    section: "balls",
    tab: "money",
    name: "Faster Dropper",
    max: 13,
    required: [{ id: "auto_dropper" }],
    costs: { money: { base: 1e3, growth: 1.6 }, research: { base: 10, growth: 1.5 } },
    desc: "Balls launch on their own faster.",
    stat: (l) => `1 ball every ${(autoInterval(1 + l) / 1e3).toFixed(2)}s`
  });
  var bucketCount = (l) => l >= 20 ? 7 : l >= 15 ? 6 : l >= 10 ? 5 : l >= 7 ? 4 : l >= 4 ? 3 : l >= 1 ? 2 : 1;
  var BUCKET_GAP = 12;
  var midMult = (l) => 1 + 0.5 * l;
  var edgeMult = (l) => 1 / (1 + 0.1 * l);
  upgrade("extra_buckets", {
    section: "bucket",
    tab: "money",
    required: [{ id: "more_buckets" }],
    name: "Extra Buckets",
    max: 0,
    costs: { money: { base: 3e3, growth: 1.25 } },
    desc: "Up to 7 buckets: the middle pays more, the edges less. Balls in a gap are lost.",
    stat: (l) => `${bucketCount(l)} bucket${bucketCount(l) > 1 ? "s" : ""}, middle x${midMult(l).toFixed(1)}, edges x${edgeMult(l).toFixed(2)}`
  });
  var GOLD_CHANCE = 0.05;
  var goldMult = (l) => l <= 0 ? 1 : 2 + 0.25 * (l - 1);
  upgrade("gold_ball_value", {
    section: "balls",
    tab: "money",
    required: [{ id: "gold_balls" }],
    name: "Gold Ball Value",
    max: 11,
    costs: { money: { base: 5e3, growth: 1.5 } },
    desc: "Gold balls earn even more.",
    stat: (l) => `x${goldMult(1 + l).toFixed(2)} {money}`
  });
  var GOO_MAX = 10;
  var gooChance = (l) => l <= 0 ? 0 : 0.01 + 0.04 * (1 - 0.75 ** (l - 1)) / (1 - 0.75 ** (GOO_MAX - 1));
  upgrade("more_gooballs", {
    section: "goo",
    tab: "money",
    required: [{ id: "phlegm_goo" }],
    name: "More Gooballs",
    max: GOO_MAX - 1,
    costs: { money: { base: 2e4, growth: 1.6 }, goo: { base: 100, growth: 1.6 } },
    desc: "More balls are gooballs.",
    stat: (l) => `${(gooChance(1 + l) * 100).toFixed(1)}% gooball chance`
  });
  var gooballPegs = (l) => 10 + 2 * l;
  upgrade("lasting_goo", {
    section: "goo",
    tab: "money",
    required: [{ id: "phlegm_goo" }],
    name: "Lasting Goo",
    max: 0,
    costs: { money: { base: 5e4, growth: 4 }, goo: { base: 250, growth: 1.6 } },
    desc: "Gooballs coat more pegs before they vanish.",
    stat: (l) => `${gooballPegs(l)} pegs per gooball`
  });
  var gooPerHit = (l) => 1 + l;
  upgrade("rich_phlegm", {
    section: "goo",
    tab: "money",
    name: "Rich Phlegm",
    max: 0,
    required: [{ id: "phlegm_goo" }],
    costs: { money: { base: 1e5, growth: 5 }, goo: { base: 33, growth: 2 } },
    desc: "Coated pegs make more {goo} per hit.",
    stat: (l) => `{goo}${gooPerHit(l)} per hit`
  });
  upgrade("higher_limit", {
    // uncapped: its own maximum is not raised by Upgrade Limit (otherwise every level would raise it further)
    section: "world",
    tab: "money",
    required: [{ id: "upgrade_limit" }],
    uncapped: true,
    name: "Higher Limit",
    max: 15,
    costs: { money: { base: 5e4, growth: 3.7 } },
    desc: `Capped upgrades: max level +${CAP_STEP}.`,
    stat: (l) => `money upgrades +${CAP_STEP * l} levels`
  });

  // src/upgrades/ResearchUpgrades.ts
  var RESEARCH_UPGRADES = [];
  var upgrade2 = defineIn(RESEARCH_UPGRADES);
  upgrade2("wall_bounce", {
    section: "world",
    tab: "research",
    required: [{ id: "research_lab" }],
    name: "Wall Bounce",
    max: 1,
    costs: { research: { base: 20 } },
    desc: "Balls earn {money} when they bounce off a side wall.",
    stat: () => "unlocks Wall Value"
  });
  var LIMITERS = 2;
  upgrade2("cannon_limiters", {
    section: "balls",
    tab: "research",
    required: [{ id: "phlegm_goo" }, { id: "faster_dropper", level: 8 }],
    name: "Cannon Limiters",
    max: 1,
    costs: { research: { base: 5e4 } },
    desc: "Ceiling pegs that limit how far the cannon sweeps.",
    stat: () => `${LIMITERS} free limiter pegs`
  });
  upgrade2("research_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "research_lab" }],
    name: "Research Pegs",
    max: 1,
    costs: { research: { base: 5 } },
    desc: `Pegs that pay {research}${RP_PEG} per hit.`,
    stat: () => "new peg \xB7 unlocks Research Pegs Value"
  });
  upgrade2("auto_dropper", {
    section: "balls",
    tab: "research",
    required: [{ id: "research_lab", level: 2 }],
    name: "Auto Dropper",
    max: 1,
    costs: { research: { base: 300 } },
    desc: "Balls launch on their own (switch in Settings).",
    stat: () => `1 ball every ${(autoInterval(1) / 1e3).toFixed(2)}s \xB7 unlocks Faster Dropper`
  });
  upgrade2("combo_theory", {
    section: "pegs",
    tab: "research",
    required: [{ id: "alchemy" }, { id: "peg_power", level: 5 }],
    name: "Combo Theory",
    max: 1,
    costs: { research: { base: 3e3 } },
    desc: "Hits in a row by the same ball pay more.",
    stat: () => "unlocks Combo Chain"
  });
  upgrade2("world_size", {
    section: "world",
    tab: "research",
    required: [{ id: "peg_slots", level: 15 }],
    name: "World Size",
    max: 1,
    costs: { research: { base: 1e3 } },
    desc: "A taller board, with more room for pegs.",
    stat: () => "unlocks Deeper World"
  });
  upgrade2("alchemy", {
    section: "pegs",
    tab: "research",
    required: [{ id: "research_pegs" }],
    name: "Alchemy",
    max: 1,
    costs: { research: { base: 2345 } },
    desc: "Pegs that slowly turn to gold.",
    stat: () => "new peg \xB7 unlocks Alchemy Pegs Value"
  });
  upgrade2("upgrade_limit", {
    section: "world",
    tab: "research",
    required: [{ id: "world_size" }],
    name: "Upgrade Limit",
    max: 1,
    costs: { research: { base: 5555 } },
    desc: "Raises the max level of capped upgrades.",
    stat: () => "unlocks Higher Limit"
  });
  upgrade2("elastic_balls", {
    section: "balls",
    tab: "research",
    required: [{ id: "ball_inflation" }],
    name: "Elastic Balls",
    max: 1,
    costs: { research: { base: 1800 } },
    desc: "Balls bounce higher.",
    stat: () => "unlocks Bouncy Balls"
  });
  upgrade2("ball_inflation", {
    section: "balls",
    tab: "research",
    required: [{ id: "extra_ball", level: 3 }],
    name: "Ball Inflation",
    max: 1,
    costs: { research: { base: 2400 } },
    desc: "Bigger balls.",
    stat: () => "unlocks Fat Balls"
  });
  upgrade2("splitter_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "research_pegs" }],
    name: "Splitter Pegs",
    max: 1,
    costs: { research: { base: 3600 } },
    desc: "Pegs that split a ball in two halves.",
    stat: () => "new peg"
  });
  upgrade2("wall_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "wall_bounce" }],
    name: "Wall Pegs",
    max: 1,
    costs: { research: { base: 200 } },
    desc: "Big, cheap pegs that pay nothing: for shaping paths.",
    stat: () => "new peg"
  });
  upgrade2("bouncy_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "wall_pegs" }],
    name: "Bouncy Pegs",
    max: 1,
    costs: { research: { base: 600 } },
    desc: "Pegs that balls bounce off much harder.",
    stat: () => "new peg"
  });
  upgrade2("blink_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "bouncy_pegs" }],
    name: "Blinking Pegs",
    max: 1,
    costs: { research: { base: 900 } },
    desc: "Pegs that blink in and out, paying 2x while there.",
    stat: () => "new peg"
  });
  var ARM_MIN = 15;
  var ARM_MAX = 120;
  var SLIDER_REACH = 40;
  var SLIDER_MS = 3e3;
  var ORBIT_R = 26;
  var ORBIT_MS = 3e3;
  var SPINNER_LEN = 52;
  var SPINNER_MS = 2400;
  upgrade2("slider_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "blink_pegs" }],
    name: "Slider Pegs",
    max: 1,
    costs: { research: { base: 1200 } },
    desc: "Pegs that slide back and forth (drag the handle to aim them).",
    stat: () => "new peg"
  });
  upgrade2("orbit_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "slider_pegs" }],
    name: "Orbit Pegs",
    max: 1,
    costs: { research: { base: 1600 } },
    desc: "Pegs that circle around where they are placed.",
    stat: () => "new peg"
  });
  upgrade2("spinner_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "slider_pegs" }],
    name: "Spinners",
    max: 1,
    costs: { research: { base: 2e3 } },
    desc: "Bars that spin, batting balls away.",
    stat: () => "new peg"
  });
  var GRAVPEG_R = 90;
  var BOUNCY_REST = 1.2;
  var BLINK_MS = 4e3;
  var BLINK_ON = 2e3;
  var GRAVPEG_PULL = 0.7 * G_STEP;
  upgrade2("gravity_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "splitter_pegs" }],
    name: "Gravity Pegs",
    max: 1,
    costs: { research: { base: 1060 } },
    desc: "Pegs that pull nearby balls.",
    stat: () => "new peg"
  });
  upgrade2("antigravity_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "gravity_pegs" }],
    name: "Repel Pegs",
    max: 1,
    costs: { research: { base: 1500 } },
    desc: "Pegs that push nearby balls away.",
    stat: () => "new peg"
  });
  upgrade2("blast_pegs", {
    section: "pegs",
    tab: "research",
    name: "Blast Pegs",
    max: 1,
    required: [{ id: "combo_theory" }],
    costs: { research: { base: 7e3 } },
    desc: `Pegs that pay {money} x${DUAL_MULT}, for ${DUAL_HITS} hits.`,
    stat: () => "new peg \xB7 unlocks Blast Peg Hits and Value"
  });
  upgrade2("blast_research", {
    section: "pegs",
    tab: "research",
    name: "Blast Research",
    max: 1,
    required: [{ id: "blast_pegs" }, { id: "research_pegs" }],
    costs: { research: { base: 9e3 } },
    desc: "Blast pegs also pay {research}.",
    stat: () => "like a research peg, at the blast multiplier"
  });
  upgrade2("blast_goo", {
    section: "pegs",
    tab: "research",
    name: "Blast Goo",
    max: 1,
    required: [{ id: "blast_pegs" }, { id: "phlegm_goo" }],
    costs: { research: { base: 5e3 }, goo: { base: 100 } },
    desc: "Blast pegs also pay {goo}.",
    stat: () => "1 per 10 of the blast multiplier"
  });
  upgrade2("blast_evil", {
    section: "pegs",
    tab: "research",
    name: "Blast Evil",
    max: 1,
    required: [{ id: "blast_pegs" }, { id: "evil" }],
    costs: { research: { base: 5e4 }, evil: { base: 200 } },
    desc: "Blast pegs also pay {evil}.",
    stat: () => "0.1 per 10 of the blast multiplier"
  });
  upgrade2("gold_balls", {
    section: "balls",
    tab: "research",
    required: [{ id: "research_lab" }, { id: "alchemy" }],
    name: "Gold Balls",
    max: 1,
    costs: { research: { base: 3e3 } },
    desc: `${GOLD_CHANCE * 100}% of balls are gold and earn more {money}.`,
    stat: () => `x${goldMult(1).toFixed(2)} {money} \xB7 unlocks Gold Ball Value`
  });
  upgrade2("more_buckets", {
    section: "bucket",
    tab: "research",
    required: [{ id: "wide_bucket", level: 5 }],
    name: "More Buckets",
    max: 1,
    costs: { research: { base: 2600 } },
    desc: "More buckets: the middle pays more, the edges less.",
    stat: () => "unlocks Extra Buckets"
  });
  var GOO_PEG_MS = 12e3;
  upgrade2("phlegm_goo", {
    section: "goo",
    tab: "research",
    required: [{ id: "research_batch" }],
    name: "Phlegm Goo",
    max: 1,
    costs: { research: { base: 1e4 } },
    desc: "Gooballs coat pegs; hits on coated pegs make {goo}.",
    stat: () => `${(gooChance(1) * 100).toFixed(1)}% gooballs \xB7 unlocks Goo Spit and goo upgrades`
  });
  upgrade2("ghost_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "phlegm_goo" }, { id: "goo_tank", level: 1 }],
    name: "Ghost Zone",
    max: 1,
    costs: { research: { base: 12e3 }, goo: { base: 50 } },
    desc: "Unlocks the Ghost Zone power.",
    stat: () => "new power"
  });
  upgrade2("downdraft_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "ghost_power" }, { id: "more_gooballs", level: 2 }],
    name: "Downdraft",
    max: 1,
    costs: { research: { base: 16e3 }, goo: { base: 80 } },
    desc: "Unlocks the Downdraft power.",
    stat: () => "new power"
  });
  upgrade2("dead_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "downdraft_power" }],
    name: "Dead Zone",
    max: 1,
    costs: { research: { base: 22e3 }, goo: { base: 120 } },
    desc: "Unlocks the Dead Zone power.",
    stat: () => "new power"
  });
  upgrade2("research_ball_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "ghost_power" }, { id: "research_pegs_value", level: 3 }],
    name: "Research Ball",
    max: 1,
    costs: { research: { base: 25e3 }, goo: { base: 100 } },
    desc: "Unlocks the Research Ball power.",
    stat: () => "new power"
  });
  upgrade2("chaos_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "dead_power" }, { id: "bouncy_pegs" }],
    name: "Chaos Zone",
    max: 1,
    costs: { research: { base: 3e4 }, goo: { base: 150 } },
    desc: "Unlocks the Chaos Zone power.",
    stat: () => "new power"
  });
  upgrade2("burst_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "chaos_power" }, { id: "extra_ball", level: 5 }],
    name: "Ball Burst",
    max: 1,
    costs: { research: { base: 4e4 }, goo: { base: 250 } },
    desc: "Unlocks the Ball Burst power.",
    stat: () => "new power"
  });
  upgrade2("laser_power", {
    section: "goo",
    tab: "research",
    required: [{ id: "burst_power" }, { id: "faster_dropper", level: 5 }],
    name: "Laser",
    max: 1,
    costs: { research: { base: 6e4 }, goo: { base: 300 } },
    desc: "Unlocks the Laser power.",
    stat: () => "new power"
  });
  upgrade2("power_pegs", {
    section: "pegs",
    tab: "research",
    required: [{ id: "evil" }],
    name: "Power Pegs",
    max: 1,
    costs: { research: { base: 2e4 }, evil: { base: 200 } },
    desc: "Pegs that cast a loaded power around themselves.",
    stat: () => "new peg \xB7 unlocks power peg upgrades"
  });
  var EVIL_COST = 1e6;
  var EVIL_GOO = 500;
  var EVIL_BASE = 0.01;
  var EVIL_KILL = 50;
  var EVIL_DMG = 0.05;
  upgrade2("evil", {
    section: "evil",
    tab: "research",
    required: [{ id: "phlegm_goo" }],
    name: "Evil",
    max: 1,
    costs: { research: { base: EVIL_COST }, goo: { base: EVIL_GOO } },
    desc: "While on, hits damage pegs and make {evil}. Broken pegs go down for a while; they heal while off.",
    stat: () => "switch in Settings \xB7 unlocks evil upgrades"
  });
  upgrade2("bomb_power", {
    section: "evil",
    tab: "research",
    required: [{ id: "evil" }],
    name: "Bomb",
    max: 1,
    costs: { research: { base: 12e5 }, evil: { base: 100 } },
    desc: "Unlocks the Bomb power.",
    stat: () => "new power"
  });
  upgrade2("balance_power", {
    section: "evil",
    tab: "research",
    required: [{ id: "bomb_power" }, { id: "sturdy_pegs", level: 2 }],
    name: "Balance Field",
    max: 1,
    costs: { research: { base: 15e5 }, evil: { base: 200 } },
    desc: "Unlocks the Balance Field power.",
    stat: () => "new power"
  });
  upgrade2("electric_power", {
    section: "evil",
    tab: "research",
    required: [{ id: "balance_power" }, { id: "dark_harvest", level: 2 }],
    name: "Electric Field",
    max: 1,
    costs: { research: { base: 2e6 }, evil: { base: 300 } },
    desc: "Unlocks the Electric Field power.",
    stat: () => "new power"
  });

  // src/upgrades/GooEvilUpgrades.ts
  var GOO_EVIL_UPGRADES = [];
  var upgrade3 = defineIn(GOO_EVIL_UPGRADES);
  var GOO_BASE_CAP = 100;
  var GOO_CAP_GROWTH = 1.35;
  var gooCap = (l) => {
    const step = l > 4 ? 100 : 10;
    return Math.round(GOO_BASE_CAP * GOO_CAP_GROWTH ** l / step) * step;
  };
  upgrade3("goo_tank", {
    section: "goo",
    required: [{ id: "phlegm_goo" }],
    name: "Goo Tank",
    tab: "money",
    max: 0,
    costs: { goo: { fn: (l) => gooCap(l) / 2 } },
    desc: `Holds ${Math.round((GOO_CAP_GROWTH - 1) * 100)}% more {goo}. Costs half a tank.`,
    stat: (l) => `holds up to {goo}${gooCap(l)}`
  });
  var evilDmg = (l) => EVIL_DMG * (0.1 + 0.9 * 0.9778 ** l);
  upgrade3("sturdy_pegs", {
    section: "evil",
    required: [{ id: "evil" }],
    name: "Sturdy Pegs",
    tab: "money",
    max: 0,
    costs: { evil: { base: 25, growth: 1.6 } },
    desc: "Pegs take less Evil damage, never below 10%.",
    stat: (l) => `${(evilDmg(l) * 100).toFixed(2)}% damage per hit (${Math.round(evilDmg(l) / EVIL_DMG * 100)}% of base)`
  });
  var evilRegen = (l) => 0.02 * (1 + 0.6 * l);
  upgrade3("fast_healing", {
    // uncapped: Upgrade Limit only raises the upgrades paid in money
    section: "evil",
    required: [{ id: "evil" }],
    name: "Fast Healing",
    tab: "money",
    max: 10,
    uncapped: true,
    costs: { evil: { base: 25, growth: 1.6 } },
    desc: "Pegs heal faster while Evil is off.",
    stat: (l) => `${(evilRegen(l) * 100).toFixed(1)}% healed per second`
  });
  var PEG_DOWN_MS = 6e4;
  var REBUILD_MIN = 15e3;
  var rebuildMs = (l) => Math.max(REBUILD_MIN, PEG_DOWN_MS * 0.9 ** l);
  upgrade3("quick_rebuild", {
    // paid in money; uncapped: it stops where the downtime reaches its floor
    section: "evil",
    required: [{ id: "evil" }],
    name: "Quick Rebuild",
    tab: "money",
    max: 14,
    uncapped: true,
    costs: { money: { base: 3e4, growth: 1.7 } },
    desc: "Broken pegs come back sooner.",
    stat: (l) => `back after ${secs(rebuildMs(l))}`
  });
  var evilYield = (l) => 1 + 0.25 * l;
  upgrade3("dark_harvest", {
    section: "evil",
    required: [{ id: "evil" }],
    name: "Dark Harvest",
    tab: "money",
    max: 10,
    uncapped: true,
    costs: { evil: { base: 50, growth: 1.7 } },
    desc: "More {evil} from hits and broken pegs.",
    stat: (l) => `x${evilYield(l).toFixed(2)} {evil}`
  });

  // src/game/Buckets.ts
  var Buckets = class {
    constructor(progress) {
      __publicField(this, "progress");
      __publicField(this, "key");
      __publicField(this, "cache");
      __publicField(this, "flash");
      this.progress = progress;
      this.key = "";
      this.cache = [];
      this.flash = [0, 0, 0, 0, 0, 0, 0];
    }
    layout() {
      const p = this.progress, key = `${p.L("extra_buckets")},${p.L("wide_bucket")}`;
      if (key !== this.key) {
        this.key = key;
        this.cache = this.build();
      }
      return this.cache;
    }
    build() {
      const p = this.progress, l = p.L("extra_buckets"), n = bucketCount(l), w = bucketW(p.L("wide_bucket")) / n, pitch = w + BUCKET_GAP;
      const span = w * n + BUCKET_GAP * (n - 1), x0 = BUCKET_X - span / 2;
      const cm = (n - 1) / 2, mid = midMult(l), edge = edgeMult(l), out = [];
      const inner = n % 2 === 0 ? 0.5 : 0;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(i - cm);
        const t = cm > inner ? (d - inner) / (cm - inner) : 0;
        out.push({ cx: x0 + w / 2 + pitch * i, w, t, mult: n === 1 ? 1 : mid ** (1 - t) * edge ** t });
      }
      return out;
    }
    indexAt(bs, x) {
      for (let i = 0; i < bs.length; i++) if (Math.abs(x - bs[i].cx) < bs[i].w / 2 - 2) return i;
      return -1;
    }
    tick(dt) {
      for (let i = 0; i < this.flash.length; i++) this.flash[i] = Math.max(0, this.flash[i] - dt / 260);
    }
  };

  // src/config/Currencies.ts
  var RES_COL = { money: COLORS.ui.strong, research: COLORS.theme.research, goo: COLORS.theme.goo, evil: COLORS.theme.evil };
  var CUR_FIELD = { money: "money", research: "rp", goo: "goo", evil: "evil" };
  var CURRENCIES = Object.keys(CUR_FIELD);
  var sym = (c) => `{${c}}`;
  var costText = (c) => entries(c).map(([cur, a]) => `${sym(cur)}${fmt(a)}`).join(" + ");
  var entries = (o) => Object.entries(o);
  var isCurrency = (c) => c in CUR_FIELD;

  // src/upgrades/PegKinds.ts
  var PEG_KINDS = {
    basic: { name: "Peg", color: COLORS.theme.pegs, costs: { money: 10 }, desc: "Pays {money} per hit." },
    research: { name: "Research", color: COLORS.theme.research, costs: { money: 150 }, unlock: "research_pegs", desc: "Pays {research} per hit." },
    splitter: { name: "Splitter", color: COLORS.theme.splitter, costs: { money: 400 }, unlock: "splitter_pegs", desc: "Splits a ball in two halves." },
    gravity: { name: "Gravity", color: COLORS.theme.gravity, costs: { money: 600 }, unlock: "gravity_pegs", desc: "Pulls nearby balls." },
    alchemy: { name: "Alchemy", color: COLORS.theme.alchemy, costs: { money: 500 }, unlock: "alchemy", desc: `Charges from {money}${ALCH_MIN} to {money}${alchMax(0)} in ${ALCH_MS / 1e3}s; a hit pays it out.` },
    dual: { name: "Blast", color: COLORS.theme.money, costs: { money: 1e3 }, unlock: "blast_pegs", desc: `Pays {money} x${DUAL_MULT}+, used up after ${DUAL_HITS}+ hits.` },
    antigravity: { name: "Repel", color: COLORS.theme.antigravity, costs: { money: 600 }, unlock: "antigravity_pegs", desc: "Pushes nearby balls away." },
    bouncy: { name: "Bouncy", color: COLORS.theme.bouncy, costs: { money: 400 }, unlock: "bouncy_pegs", desc: "Balls bounce off it much harder." },
    wall: { name: "Wall", color: COLORS.theme.wallPeg, costs: { money: 5 }, unlock: "wall_pegs", desc: "Big and cheap; pays nothing. For shaping paths." },
    blink: { name: "Blink", color: COLORS.theme.blink, costs: { money: 300 }, unlock: "blink_pegs", desc: `Blinks in and out; pays 2x a plain peg.` },
    limiter: { name: "Limiter", color: COLORS.theme.limiter, costs: {}, unlock: "cannon_limiters", desc: `Sits on the ceiling: the cannon turns back at it. Free, no slot, up to ${LIMITERS}.` },
    slider: { name: "Slider", color: COLORS.theme.slider, costs: { money: 500 }, unlock: "slider_pegs", desc: "Slides back and forth; drag its handle (edit mode) to aim it." },
    orbit: { name: "Orbit", color: COLORS.theme.orbit, costs: { money: 600 }, unlock: "orbit_pegs", desc: "Circles around where it is placed." },
    spinner: { name: "Spinner", color: COLORS.theme.spinner, costs: { money: 800 }, unlock: "spinner_pegs", desc: "A spinning bar that bats balls away." },
    power: { name: "Power", color: COLORS.theme.power, costs: { money: 2e3, evil: 100 }, unlock: "power_pegs", desc: `Load a power into it (tap it while placing one); every ${POWER_HITS} hits it casts it around itself.` }
  };
  var PEG_TYPES = Object.keys(PEG_KINDS);
  for (const t of PEG_TYPES) for (const c in PEG_KINDS[t].costs) if (!isCurrency(c)) console.error(`Peg type "${t}" costs an unknown currency "${c}"`);

  // src/upgrades/Sections.ts
  var SECTIONS = [
    { section: "bucket", name: "Bucket", color: COLORS.theme.bucket },
    { section: "pegs", name: "Pegs", color: COLORS.theme.pegs },
    { section: "balls", name: "Balls", color: COLORS.theme.balls },
    { section: "research", name: "Research", color: COLORS.theme.research },
    { section: "world", name: "World", color: COLORS.theme.world },
    { section: "goo", name: "Goo", color: COLORS.theme.goo },
    { section: "evil", name: "Evil", color: COLORS.theme.evil }
  ];
  var SECTION_COLOR = Object.fromEntries(SECTIONS.map((s2) => [s2.section, s2.color]));
  var LOCKED_SECTION = { name: "Locked", color: COLORS.ui.locked };

  // src/upgrades/Registry.ts
  var UPGRADES = [...MONEY_UPGRADES, ...RESEARCH_UPGRADES, ...GOO_EVIL_UPGRADES];
  var UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));
  function upgradeProblems(list) {
    const out = [], seen = /* @__PURE__ */ new Set(), byId2 = Object.fromEntries(list.map((u) => [u.id, u]));
    for (const u of list) {
      if (seen.has(u.id)) out.push(`Upgrade "${u.id}" is defined twice`);
      seen.add(u.id);
      for (const r of u.required || []) if (!byId2[r.id]) out.push(`Upgrade "${u.id}" requires "${r.id}", which does not exist`);
      if (u.tab !== "money" && u.tab !== "research") out.push(`Upgrade "${u.id}" has no valid tab (got "${u.tab}")`);
      if (!SECTIONS.some((s2) => s2.section === u.section)) out.push(`Upgrade "${u.id}" has no valid section (got "${u.section}")`);
      const curs = Object.keys(u.costs || {});
      if (!curs.length) out.push(`Upgrade "${u.id}" has no costs`);
      for (const c of curs) if (!isCurrency(c)) out.push(`Upgrade "${u.id}" costs an unknown currency "${c}"`);
    }
    return out;
  }
  for (const problem of upgradeProblems(UPGRADES)) console.error(problem);

  // src/upgrades/Powers.ts
  var POWER_BY_ID = {};
  var power = (id, pw) => {
    POWER_BY_ID[id] = { id, ...pw };
  };
  var s = (ms) => `${ms / 1e3}s`;
  var SPIT_MS = 400;
  var SPIT_CD = 3e4;
  power("goo_spit", {
    required: [{ id: "phlegm_goo" }],
    name: "Goo Spit",
    ms: SPIT_MS,
    cd: SPIT_CD,
    color: COLORS.theme.goo,
    zone: { shape: "circle", r: 90 },
    costs: { money: 1e3 },
    desc: "Coats every peg inside with goo at once.",
    stat: () => "instant"
  });
  var GHOST_MS = 1e4;
  var GHOST_CD = 3e4;
  power("ghost_zone", {
    required: [{ id: "ghost_power" }],
    name: "Ghost Zone",
    ms: GHOST_MS,
    cd: GHOST_CD,
    color: COLORS.theme.ghost,
    zone: { shape: "circle", r: 80 },
    costs: { goo: 200 },
    desc: "Balls inside pass through pegs, still hitting them.",
    stat: () => `${s(GHOST_MS)} zone`
  });
  var GRAV_MS = 1e4;
  var GRAV_CD = 3e4;
  var GRAV_MULT = 5;
  power("downdraft", {
    required: [{ id: "downdraft_power" }],
    name: "Downdraft",
    ms: GRAV_MS,
    cd: GRAV_CD,
    color: COLORS.theme.gravity,
    zone: { shape: "band", h: 90 },
    costs: { goo: 250 },
    desc: `Balls inside fall ${GRAV_MULT}x faster.`,
    stat: () => `${s(GRAV_MS)} band`
  });
  var DEAD_MS = 1e4;
  var DEAD_CD = 3e4;
  var DEAD_REST = 0.02;
  power("dead_zone", {
    required: [{ id: "dead_power" }],
    name: "Dead Zone",
    ms: DEAD_MS,
    cd: DEAD_CD,
    color: COLORS.theme.dead,
    zone: { shape: "circle", r: 80 },
    costs: { goo: 300 },
    desc: "Balls inside lose almost all bounce.",
    stat: () => `${s(DEAD_MS)} zone`
  });
  var CHAOS_MS = 1e4;
  var CHAOS_CD = 3e4;
  power("chaos_zone", {
    required: [{ id: "chaos_power" }],
    name: "Chaos Zone",
    ms: CHAOS_MS,
    cd: CHAOS_CD,
    color: COLORS.theme.chaos,
    zone: { shape: "circle", r: 80 },
    costs: { goo: 333 },
    desc: "Bounces inside go off in random directions.",
    stat: () => `${s(CHAOS_MS)} zone`
  });
  var BURST_MS = 8e3;
  var BURST_CD = 3e4;
  power("ball_burst", {
    required: [{ id: "burst_power" }],
    name: "Ball Burst",
    ms: BURST_MS,
    cd: BURST_CD,
    color: COLORS.theme.goo,
    costs: { goo: 700 },
    desc: "10x as many balls in play.",
    stat: () => `x10 ball limit for ${s(BURST_MS)}`
  });
  var LASER_MS = 5e3;
  var LASER_CD = 4e4;
  var LASER_PULSE = 250;
  var LASER_DMG = 0.25;
  power("laser", {
    required: [{ id: "laser_power" }],
    name: "Laser",
    ms: LASER_MS,
    cd: LASER_CD,
    color: COLORS.theme.laser,
    costs: { goo: 300 },
    desc: "The cannon fires a beam straight down instead of balls: it activates the first peg it hits.",
    stat: () => `${s(LASER_MS)}, ${1e3 / LASER_PULSE} pulses a second`
  });
  var RBALL_MS = 500;
  var RBALL_CD = 3e4;
  var RBALL_MULT = 5;
  power("research_ball", {
    required: [{ id: "research_ball_power" }],
    name: "Research Ball",
    ms: RBALL_MS,
    cd: RBALL_CD,
    color: COLORS.theme.research,
    costs: { goo: 150 },
    desc: "Fires a big ball: every peg it hits pays {research} instead of {money}.",
    stat: () => `x${RBALL_MULT} a research peg hit`
  });
  var BOMB_FUSE = 1e3;
  var BOMB_CD = 2e4;
  power("bomb", {
    required: [{ id: "bomb_power" }],
    danger: true,
    name: "Bomb",
    ms: BOMB_FUSE,
    cd: BOMB_CD,
    color: COLORS.theme.evil,
    zone: { shape: "circle", r: 70 },
    costs: { evil: 40, goo: 150 },
    desc: "Pegs inside break and pay {evil}.",
    stat: () => `${s(BOMB_FUSE)} fuse`
  });
  var RELAX_MS = 5e3;
  var RELAX_CD = 3e4;
  var RELAX_MOVE = 1.2;
  power("balance_field", {
    required: [{ id: "balance_power" }],
    danger: true,
    name: "Balance Field",
    ms: RELAX_MS,
    cd: RELAX_CD,
    color: COLORS.theme.balance,
    zone: { shape: "circle", r: 110 },
    costs: { evil: 30, goo: 120 },
    desc: "Pegs inside spread apart and keep their new places.",
    stat: () => `${s(RELAX_MS)} zone`
  });
  var ZAP_MS = 8e3;
  var ZAP_CD = 3e4;
  var ZAP_R = 60;
  var ZAP_BRANCH = 2;
  var ZAP_MAX = 15;
  var ZAP_DELAY = 70;
  var ZAP_DMG = 0.0375;
  var ZAP_PEG_CD = 300;
  power("electric_field", {
    required: [{ id: "electric_power" }],
    name: "Electric Field",
    ms: ZAP_MS,
    cd: ZAP_CD,
    color: COLORS.theme.electric,
    zone: { shape: "circle", r: 90 },
    costs: { evil: 25, goo: 100 },
    desc: "Hits inside throw arcs to nearby pegs; arcs damage them.",
    stat: () => `${s(ZAP_MS)} zone, up to ${ZAP_MAX} pegs per arc`
  });
  var POWERS = Object.values(POWER_BY_ID);
  for (const pw of POWERS) {
    for (const r of pw.required || []) if (!UPGRADE_BY_ID[r.id]) console.error(`Power "${pw.id}" requires "${r.id}", which does not exist`);
    for (const c in pw.costs) if (!isCurrency(c)) console.error(`Power "${pw.id}" costs an unknown currency "${c}"`);
  }

  // src/game/Types.ts
  var isMarker = (p) => p.type === "limiter";
  var isMover = (p) => p.type === "slider" || p.type === "spinner" || p.type === "orbit";
  var sliderHandle = (p) => ({ x: p.ax + Math.cos(p.dir) * p.reach, y: p.ay + Math.sin(p.dir) * p.reach });
  var isDown = (p) => p.downT > 0;

  // src/game/PegBoard.ts
  var shapeR = (type, r) => type === "research" ? r + 1 : type === "power" ? r * 1.5 : type === "wall" ? r * 2 : type === "spinner" ? r / PEG_R * SPINNER_LEN / 2 : r;
  var SIDES = { research: 6, power: 3 };
  var CELL = 32;
  var cellKey = (cx, cy) => cy * 64 + cx + 8;
  var PegBoard = class {
    constructor(physics, progress) {
      __publicField(this, "physics");
      __publicField(this, "progress");
      __publicField(this, "list");
      __publicField(this, "placed");
      __publicField(this, "gravity");
      __publicField(this, "blink");
      __publicField(this, "limiters");
      __publicField(this, "movers");
      __publicField(this, "grid");
      this.physics = physics;
      this.progress = progress;
      this.list = [];
      this.placed = {};
      this.gravity = [];
      this.blink = [];
      this.limiters = [];
      this.movers = [];
      this.grid = null;
    }
    // paid: { currency: amount } paid to place it (refunded when picked up); from a save: downT (ms it stays down),
    // socket (a power peg's power), arm (a slider's direction and reach)
    add(x, y, type = "basic", left = 0, dmg = 0, paid = {}, { downT = 0, socket = "", arm } = {}) {
      const r = pegRadius(y), R = shapeR(type, r);
      const body = type === "spinner" ? this.physics.addBar(x, y, 2 * R, 6 * r / PEG_R) : this.physics.addPeg(x, y, R, SIDES[type] ?? 0);
      const peg = {
        x,
        y,
        r,
        type,
        body,
        flash: 0,
        color: PEG_KINDS[type].color,
        gooT: 0,
        left,
        dmg,
        downT,
        downMs: downT,
        unpaid: false,
        paid,
        charge: 0,
        socket,
        castHits: 0,
        castWait: false,
        castCd: 0,
        castCdMs: 0,
        off: false,
        ax: x,
        ay: y,
        dir: arm?.[0] ?? 0,
        reach: arm?.[1] ?? (type === "orbit" ? ORBIT_R : SLIDER_REACH),
        fx: 0,
        fy: 0
      };
      if (socket) peg.color = POWER_BY_ID[socket]?.color ?? peg.color;
      body.peg = peg;
      if (downT > 0) this.physics.setPegSolid(body, false);
      this.list.push(peg);
      this.placed[type] = this.placedOf(type) + 1;
      if (type === "gravity" || type === "antigravity") this.gravity.push(peg);
      if (type === "blink") this.blink.push(peg);
      if (type === "limiter") {
        this.limiters.push(peg);
        this.physics.setPegSolid(body, false);
      }
      if (isMover(peg)) this.movers.push(peg);
      this.grid = null;
      return peg;
    }
    remove(peg) {
      const i = this.list.indexOf(peg);
      if (i < 0) return;
      this.physics.remove(peg.body);
      this.list.splice(i, 1);
      this.placed[peg.type] = this.placedOf(peg.type) - 1;
      for (const l of [this.gravity, this.blink, this.limiters, this.movers]) {
        const i2 = l.indexOf(peg);
        if (i2 >= 0) l.splice(i2, 1);
      }
      this.grid = null;
    }
    placedOf(t) {
      return this.placed[t] ?? 0;
    }
    used() {
      return this.list.length - this.placedOf("limiter");
    }
    // pegs taking a slot (limiters take none)
    at(x, y) {
      return this.list.find((p) => Math.hypot(x - p.x, y - p.y) < shapeR(p.type, p.r) + 8);
    }
    // the peg under a tap, if any
    // put a peg somewhere (edit mode): a moving peg's spot is where it moves around
    move(peg, x, y) {
      peg.x = peg.ax = x;
      peg.y = peg.ay = y;
      this.physics.movePeg(peg.body, x, y);
      this.grid = null;
    }
    near(x0, y0, x1, y1, out) {
      if (!this.grid) {
        this.grid = /* @__PURE__ */ new Map();
        for (const p of this.list) {
          if (isMover(p)) continue;
          const k = cellKey(Math.floor(p.x / CELL), Math.floor(p.y / CELL));
          const a = this.grid.get(k);
          if (a) a.push(p);
          else this.grid.set(k, [p]);
        }
      }
      out.length = 0;
      const m = 2 * PEG_R + 2;
      const cx0 = Math.floor((x0 - m) / CELL), cx1 = Math.floor((x1 + m) / CELL);
      const cy0 = Math.floor((y0 - m) / CELL), cy1 = Math.floor((y1 + m) / CELL);
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const a = this.grid.get(cellKey(cx, cy));
        if (a) for (const p of a) out.push(p);
      }
      for (const p of this.movers) {
        const R = shapeR(p.type, p.r);
        if (p.x + R >= x0 && p.x - R <= x1 && p.y + R >= y0 && p.y - R <= y1) out.push(p);
      }
      return out;
    }
    /* Moving pegs, each on its own beat (from where it was placed): sliders back and forth along their track, orbit pegs around
       their spot, spinners turning. smooth: from where they were the step before (so they bat balls); false: jump there (after edit mode). */
    moveMovers(simT, smooth) {
      for (const p of this.movers) {
        const beat = simT + p.ax * 7 + p.ay * 13;
        if (p.type === "spinner") {
          this.physics.turnPeg(p.body, beat * TAU / SPINNER_MS, smooth);
          continue;
        }
        const a = beat * TAU / (p.type === "orbit" ? ORBIT_MS : SLIDER_MS);
        const [x, y] = p.type === "orbit" ? [p.ax + p.reach * Math.cos(a), p.ay + p.reach * Math.sin(a)] : [p.ax + Math.cos(p.dir) * p.reach * Math.sin(a), p.ay + Math.sin(p.dir) * p.reach * Math.sin(a)];
        p.x = x;
        p.y = y;
        this.physics.movePeg(p.body, x, y, smooth);
      }
    }
    // edit mode: every moving peg back on its spot, standing still (a spinner flat)
    restMovers() {
      for (const p of this.movers) {
        p.x = p.ax;
        p.y = p.ay;
        this.physics.movePeg(p.body, p.x, p.y);
        if (p.type === "spinner") this.physics.turnPeg(p.body, 0);
      }
    }
    /* One step of balancing among `list` (down pegs too: their spot stays taken): every pair whose edges are closer than gap
       pushes apart (harder the closer they are), and the circle's edge pushes back like a peg would, so they spread inside it.
       ease (0..1) scales the movement down as the effect ends. links collects the pushing pairs (for drawing). */
    relaxStep(list, gap, ease, c, links) {
      links.length = 0;
      for (const p of list) {
        p.fx = 0;
        p.fy = 0;
      }
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        for (let j = i + 1; j < list.length; j++) {
          const q = list[j];
          const d0 = p.r + q.r + gap;
          let dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
          if (d >= d0) continue;
          if (d < 0.01) {
            dx = rand(-1, 1);
            dy = rand(-1, 1);
            d = Math.hypot(dx, dy) || 1;
          }
          const push = 1 - d / d0, ux = dx / d * push, uy = dy / d * push;
          p.fx -= ux;
          p.fy -= uy;
          q.fx += ux;
          q.fy += uy;
          if (links.length < 1200) links.push(p, q);
        }
      }
      for (const p of list) {
        const half = p.r + gap / 2, ex = c.x - p.x, ey = c.y - p.y, e = Math.hypot(ex, ey) || 1;
        const w = Math.max(0, 1 - (c.r - e) / half);
        p.fx += ex / e * w;
        p.fy += ey / e * w;
        const f = Math.hypot(p.fx, p.fy);
        if (f < 1e-4) continue;
        const m = Math.min(RELAX_MOVE, f * (2 * p.r + gap) * 0.08) * ease;
        p.x = Math.min(W, Math.max(0, p.x + p.fx / f * m));
        p.y = Math.min(c.yMax, Math.max(0, p.y + p.fy / f * m));
        this.physics.movePeg(p.body, p.x, p.y);
      }
      this.grid = null;
    }
    // after moving, a peg takes the size that belongs to its new depth
    resettleOne(p) {
      const r = pegRadius(p.y);
      if (Math.abs(r - p.r) < 0.02) return;
      this.physics.resizePeg(p.body, shapeR(p.type, r) / shapeR(p.type, p.r));
      p.r = r;
      this.grid = null;
    }
    // flashes fade, goo wears off, damage heals (heal = damage healed per second; 0 while evil is on), alchemy pegs charge;
    // a down peg only fades its flash (its downtime is counted by PegDowntime)
    tick(dt, heal) {
      for (const pg of this.list) {
        if (pg.flash > 0) pg.flash = Math.max(0, pg.flash - dt / 220);
        if (isDown(pg)) continue;
        if (pg.type === "alchemy" && pg.charge < 1) {
          pg.charge = Math.min(1, pg.charge + dt / ALCH_MS);
          pg.color = mixCol(COLORS.theme.alchemy, COLORS.theme.money, Math.round(pg.charge * 10) / 10);
        }
        if (pg.gooT > 0) pg.gooT = Math.max(0, pg.gooT - dt);
        if (heal > 0 && pg.dmg > 0) pg.dmg = Math.max(0, pg.dmg - heal * dt / 1e3);
      }
    }
  };

  // src/game/Progress.ts
  var Progress = class {
    constructor() {
      __publicField(this, "money");
      __publicField(this, "rp");
      __publicField(this, "goo");
      __publicField(this, "evil");
      __publicField(this, "levels");
      this.money = 0;
      this.rp = 0;
      this.goo = 0;
      this.evil = 0;
      this.levels = {};
      for (const u of UPGRADES) this.levels[u.id] = 0;
    }
    L(id) {
      return this.levels[id] | 0;
    }
    slots() {
      return START_SLOTS + this.L("peg_slots");
    }
    unlocked(type) {
      const k = PEG_KINDS[type];
      return !k.unlock || this.L(k.unlock) > 0;
    }
    gain(v) {
      this.money += v;
    }
    gooCap() {
      return gooCap(this.L("goo_tank"));
    }
    addGoo(n) {
      this.goo = Math.min(this.gooCap(), this.goo + n);
    }
    // { currency: amount } for buying level l + 1; a currency is only charged from its minLevel on
    price(u, l = this.L(u.id)) {
      const out = {};
      for (const [cur, c] of entries(u.costs)) {
        const from = c.minLevel || 0;
        if (l < from) continue;
        const amount = "fn" in c ? c.fn(l) : Math.ceil(c.base * (c.growth ?? 1) ** (l - from));
        if (amount > 0) out[cur] = amount;
      }
      return out;
    }
    // costs = { currency: amount }
    has(costs) {
      return entries(costs).every(([cur, a]) => this[CUR_FIELD[cur]] >= a);
    }
    spend(costs, sign = 1) {
      for (const [cur, a] of entries(costs)) this[CUR_FIELD[cur]] -= sign * a;
    }
    refund(costs) {
      this.spend(costs, -1);
    }
    canAfford(u) {
      return this.has(this.price(u));
    }
    pay(u) {
      this.spend(this.price(u));
    }
    // buyable once every required upgrade has its level (anything already owned stays unlocked)
    missing(u) {
      return (u.required || []).filter((r) => this.L(r.id) < (r.level || 1));
    }
    isUnlocked(u) {
      return this.L(u.id) > 0 || !this.missing(u).length;
    }
    // names only the missing requirements that are discovered themselves (a still-locked one would just be another '???')
    lockReason(u) {
      const known = this.missing(u).filter((r) => this.isUnlocked(UPGRADE_BY_ID[r.id]));
      return known.length ? `Requires: ${known.map((r) => UPGRADE_BY_ID[r.id].name + ((r.level || 1) > 1 ? ` Lv ${r.level}` : "")).join(", ")}` : "";
    }
    // money upgrades with a max level get +CAP_STEP per Upgrade Limit level (research + Higher Limit), except the uncapped ones
    maxOf(u) {
      return u.max > 0 && u.tab === "money" && !u.uncapped ? u.max + CAP_STEP * this.L("higher_limit") : u.max;
    }
    isMaxed(u) {
      const m = this.maxOf(u);
      return m > 0 && this.L(u.id) >= m;
    }
  };

  // src/game/systems/BallSystem.ts
  var shown = (lines) => lines.filter((l) => !!l);
  var BallSystem = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    maxBalls() {
      return (1 + this.game.L("extra_ball")) * (this.game.temps.running("ball_burst") ? 10 : 1);
    }
    load() {
      return this.game.balls.reduce((a, b) => a + b.w, 0);
    }
    // half-size balls count 0.5
    goldMul(b) {
      return b.gold ? goldMult(1 + this.game.L("gold_ball_value")) : 1;
    }
    /* The cannon hangs from the ceiling and sweeps left and right all the time. It fires straight down
       from wherever it is. Returns false when every ball slot is taken. */
    launch() {
      const g = this.game;
      if (g.editing || g.temps.running("laser") || this.load() + 1 > this.maxBalls()) return false;
      const half = LAUNCH_SPREAD * Math.PI / 180 / 2;
      const th = rand(-half, half);
      const isGoo = Math.random() < (g.L("phlegm_goo") ? gooChance(1 + g.L("more_gooballs")) : 0);
      const isGold = !isGoo && g.L("gold_balls") > 0 && Math.random() < GOLD_CHANCE;
      this.make(g.launchX, LAUNCH_Y, ballRadius(g.L("fat_balls")), LAUNCH_SPEED * Math.sin(th), LAUNCH_SPEED * Math.cos(th), { goo: isGoo, gold: isGold });
      g.recoil = 1;
      g.uiDirty = true;
      return true;
    }
    // the Research Ball power: a big ball outside the ball limit (w 0) that never splits
    researchBall() {
      const g = this.game;
      this.make(g.launchX, LAUNCH_Y, ballRadius(g.L("fat_balls")) * 1.8, 0, LAUNCH_SPEED, { research: true, w: 0, split: true, glow: COLORS.theme.research });
      g.recoil = 1;
      g.effects.burst(g.launchX, LAUNCH_Y + 6, COLORS.theme.research, 14, { speed: [60, 160], angle: [0.3, 2.84] });
    }
    // a ball body plus its game state
    make(x, y, r, vx, vy, props) {
      const g = this.game, body = g.physics.addBall(x, y, r, vx, vy, restitution(g.L("bouncy_balls")));
      const ball = Object.assign({
        body,
        r,
        px: x,
        py: y,
        hits: 0,
        age: 0,
        still: 0,
        tick: 0,
        trail: [],
        lastPeg: null,
        lastT: 0,
        lastWall: 0,
        lastWallT: 0,
        goo: false,
        gold: false,
        gooHits: 0,
        expired: false,
        w: 1,
        split: false,
        glow: randGlow(),
        ghost: false,
        inPeg: false,
        chaos: false,
        research: false,
        stash: { money: 0, rp: 0, goo: 0, evil: 0 }
        // the haul: paid out in a bucket, lost any other way
      }, props);
      body.ball = ball;
      g.balls.push(ball);
      return ball;
    }
    drop(ball) {
      const g = this.game;
      g.physics.remove(ball.body);
      g.balls.splice(g.balls.indexOf(ball), 1);
    }
    /* A full-size ball that hits a splitter peg becomes two half-size balls (deferred until the physics step is over). */
    split(ball, peg) {
      const g = this.game;
      if (g.balls.indexOf(ball) < 0) return;
      const p = ball.body.position, v = g.physics.velocity(ball.body), r = ball.r / 2;
      const base = Math.atan2(v.y, v.x), sp = Math.max(Math.hypot(v.x, v.y), 3);
      this.drop(ball);
      for (const sg of [-1, 1]) {
        const a = base + sg * 0.5;
        this.make(p.x, p.y, r, sp * Math.cos(a), sp * Math.sin(a), {
          hits: ball.hits,
          age: ball.age,
          lastPeg: peg,
          lastT: g.simT,
          goo: ball.goo,
          gold: ball.gold,
          gooHits: ball.gooHits,
          w: 0.5,
          split: true,
          glow: ball.glow,
          ghost: ball.ghost,
          stash: Object.fromEntries(entries(ball.stash).map(([cur, v2]) => [cur, v2 / 2]))
          // each half carries half the haul
        });
      }
      g.effects.burst(peg.x, peg.y, peg.color, 8);
      g.uiDirty = true;
    }
    // the ball made it: its haul is paid out as is, plus the bucket's own catch value (bucket and gold multipliers apply to that)
    catch(ball, bk, idx) {
      const g = this.game, s2 = ball.stash, p = g.progress, fx = g.effects, x = ball.body.position.x, y = g.rimY();
      const money = ball.research ? s2.money : s2.money + bucketValue(g.L("bucket_value")) * bk.mult * this.goldMul(ball);
      p.gain(money);
      p.rp += s2.rp;
      p.addGoo(s2.goo);
      p.evil += s2.evil;
      g.buckets.flash[idx] = 1;
      fx.burst(x, y + 4, COLORS.theme.bucket, 10);
      const lines = shown([
        money && [`+{money}${fmt(money)}`, COLORS.theme.bucket],
        s2.rp && [`+{research}${fmt(s2.rp)}`, COLORS.theme.research],
        s2.goo && [`+{goo}${fmt(s2.goo)}`, COLORS.theme.goo],
        s2.evil && [`+{evil}${evFmt(s2.evil)}`, COLORS.theme.evil]
      ]);
      lines.forEach(([text, col], i) => {
        fx.float(x, y - 8 - 17 * i, text, col, { big: true, life: 1e3, always: true });
      });
      this.drop(ball);
    }
    // the ball left play any other way: its haul is gone (a faint red note shows what was lost)
    lose(ball) {
      const g = this.game, s2 = ball.stash, p = ball.body.position;
      const lost = [s2.money && `{money}${fmt(s2.money)}`, s2.rp && `{research}${fmt(s2.rp)}`, s2.goo && `{goo}${fmt(s2.goo)}`, s2.evil && `{evil}${evFmt(s2.evil)}`].filter(Boolean);
      if (lost.length) g.effects.float(p.x, Math.min(p.y, g.worldH - 12), `\u2212${lost.join(" \xB7 ")}`, COLORS.ui.negative, { life: 1e3 });
      this.drop(ball);
    }
    // speed limit, trails, and every way a ball leaves play: caught, fallen out, too old, stuck, or a burnt-out gooball
    update(dt) {
      const g = this.game, ph = g.physics, bs = g.buckets.layout();
      for (let i = g.balls.length - 1; i >= 0; i--) {
        const b = g.balls[i], p = b.body.position, v = ph.velocity(b.body);
        const sp = Math.hypot(v.x, v.y);
        if (sp > MAX_SPEED) ph.setVelocity(b.body, v.x / sp * MAX_SPEED, v.y / sp * MAX_SPEED);
        b.age += dt;
        b.still = sp < 0.225 ? b.still + dt : 0;
        if (b.ghost && !b.inPeg && !g.zones.at("ghost_zone", p.x, p.y)) b.ghost = false;
        if ((++b.tick & 1) === 0) {
          b.trail.push(p.x, p.y);
          if (b.trail.length > 14) b.trail.splice(0, 2);
        }
        const bi = v.y > 0 && b.age > 250 && p.y >= g.catchY() ? g.buckets.indexAt(bs, p.x) : -1;
        if (bi >= 0) this.catch(b, bs[bi], bi);
        else if (p.y > g.worldH + 40 || b.age > BALL_MAX_AGE || b.still > 1500 || b.expired) {
          if (b.expired) g.effects.burst(p.x, p.y, COLORS.theme.goo, 12);
          this.lose(b);
        }
      }
    }
  };

  // src/game/Zones.ts
  function areaOf(z, x, y, scale = 1) {
    return z.shape === "circle" ? { shape: "circle", x, y, r: z.r * scale, w: 0, h: 0 } : { shape: "band", x: W / 2, y, r: 0, w: W, h: z.h * scale };
  }
  function inZone(a, x, y, pad = 0) {
    return a.shape === "circle" ? Math.hypot(x - a.x, y - a.y) <= a.r + pad : Math.abs(x - a.x) <= a.w / 2 + pad && Math.abs(y - a.y) <= a.h / 2 + pad;
  }
  function zoneAt(zones, power2, x, y) {
    for (const z of zones) if (z.power === power2 && inZone(z, x, y)) return z;
    return void 0;
  }

  // src/game/systems/Bomb.ts
  var Bomb = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    // a power peg's own bomb leaves it standing; every peg it breaks pays Evil (EVIL_KILL), like any break
    explode(z) {
      const g = this.game, { x, y, r } = z, fx = g.effects;
      let broken = 0;
      for (const pg of g.pegs.near(x - r, y - r, x + r, y + r, [])) {
        if (pg === z.src || isDown(pg) || !inZone(z, pg.x, pg.y, pg.r)) continue;
        if (g.downtime.damage(pg, 1, null)) broken++;
      }
      fx.ring(x, y, 4, r, COLORS.theme.explosionLight, { life: 380, width: 7, fill: true });
      fx.ring(x, y, 4, r * 1.35, COLORS.theme.evil, { life: 650, width: 4 });
      fx.burst(x, y, COLORS.theme.evil, 40, { speed: [90, 330], size: 15, life: 750, always: true });
      fx.burst(x, y, COLORS.theme.explosion, 30, { speed: [60, 260], size: 12, life: 620, always: true });
      fx.burst(x, y, COLORS.theme.explosionLight, 16, { speed: [30, 150], size: 17, life: 420, always: true });
      fx.float(x, y - 8, "BOOM!", COLORS.theme.explosion, { huge: true, life: 1100, always: true });
      if (broken) fx.float(x, y - 52, `${broken} peg${broken > 1 ? "s" : ""} broken`, COLORS.theme.explosion, { life: 1500, always: true });
      fx.screen(COLORS.theme.evil, 0.4, 9);
      g.uiDirty = true;
    }
  };

  // src/game/systems/Economy.ts
  var Economy = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    buy(u) {
      const g = this.game, p = g.progress;
      if (!p.isUnlocked(u) || p.isMaxed(u) || !p.canAfford(u)) return false;
      p.pay(u);
      p.levels[u.id]++;
      if (u.id === "world_size" || u.id === "deeper_world") g.growWorld();
      if (u.id === "blast_peg_hits") {
        for (const pg of g.pegs.list) if (pg.type === "dual") pg.left++;
      }
      return true;
    }
    // can be used now: unlocked, not running or recharging, and every cost can be paid
    ready(pw) {
      const p = this.game.progress;
      return p.isUnlocked(pw) && !this.timer(pw.id) && p.has(pw.costs);
    }
    // a power without a zone acts at once (one with a zone is placed on the board: ZoneSystem)
    usePower(pw) {
      const g = this.game;
      if (pw.zone || !this.ready(pw)) return false;
      g.progress.spend(pw.costs);
      g.temps.start(pw.id);
      if (pw.id === "research_ball") g.ballSystem.researchBall();
      g.uiDirty = true;
      return true;
    }
    // a power's state: { active, s } running / recharging; null when ready
    timer(id) {
      return this.game.temps.timer(id);
    }
  };

  // src/game/systems/EditMode.ts
  var EditMode = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    // Entering clears the board of balls and freezes everything: App stops calling step(), so timers, cooldowns,
    // zones, downtimes and passive research points wait too. A power waiting to be placed is cancelled.
    enter() {
      const g = this.game, p = g.progress;
      for (const b of [...g.balls]) g.ballSystem.drop(b);
      p.goo = Math.min(p.goo, p.gooCap());
      g.zones.cancel();
      g.electric.arcs.length = 0;
      g.pendingSplit.length = 0;
      const fx = g.effects;
      fx.particles.length = fx.floaters.length = fx.rings.length = fx.bolts.length = 0;
      fx.shake = 0;
      fx.flash.a = 0;
      for (const pg of g.pegs.list) pg.flash = 0;
      g.pegs.restMovers();
      g.editing = true;
      g.uiDirty = true;
    }
    exit() {
      this.game.editing = false;
      this.game.moversJump = true;
      this.game.uiDirty = true;
    }
    // why a peg of this type cannot be placed right now (null when it can)
    cantPlace(type) {
      const g = this.game, p = g.progress, k = PEG_KINDS[type];
      if (!p.unlocked(type)) return `Unlock ${k.name} pegs in Research first`;
      if (type === "limiter") return g.pegs.placedOf("limiter") >= LIMITERS ? `Only ${LIMITERS} limiters` : null;
      if (g.pegs.used() >= p.slots()) return "Slots full: buy Peg Slots in the Shop";
      if (type === "power" && g.pegs.placedOf("power") >= powerPegMax(g.L("power_peg_slots"))) return "Power peg limit: buy Power Peg Slots in the Shop";
      if (!p.has(k.costs)) return `Need ${costText(k.costs)} for ${type === "basic" ? "a peg" : `a ${k.name.toLowerCase()} peg`}`;
      return null;
    }
    // places a peg and pays for it; returns why it could not, or null
    placePeg(type, x, y) {
      const why = this.cantPlace(type);
      if (why) return why;
      const g = this.game, p = g.progress, s2 = this.placeSpot(x, y, type);
      const left = type === "dual" ? blastHits(g.L("blast_peg_hits")) : 0;
      const c = { ...PEG_KINDS[type].costs };
      p.spend(c);
      const peg = g.pegs.add(s2.x, s2.y, type, left, 0, c);
      g.effects.burst(peg.x, peg.y, peg.color, 8, { speed: [30, 90] });
      g.uiDirty = true;
      return null;
    }
    // what picking a peg up gives back: its price; a blast peg that was already hit only the unused share
    refundOf(peg) {
      const full = blastHits(this.game.L("blast_peg_hits")), used = peg.type === "dual" && peg.left < full, back = {};
      for (const [cur, a] of entries(peg.paid)) {
        const b = used ? Math.floor(a * peg.left / full) : a;
        if (b > 0) back[cur] = b;
      }
      return back;
    }
    // A down peg can't be picked up (that would skip its downtime for a refund): BoardControls checks first.
    pickUp(peg) {
      const g = this.game, back = this.refundOf(peg);
      g.progress.refund(back);
      g.pegs.remove(peg);
      g.uiDirty = true;
      return costText(back);
    }
    // layouts: clearing or loading waits until no peg is down
    anyDown() {
      return this.game.pegs.list.some(isDown);
    }
    // picks up every peg (each refunded); returns why it could not, or null
    clearAll() {
      if (this.anyDown()) return "Wait until broken pegs are back";
      for (const pg of [...this.game.pegs.list]) this.pickUp(pg);
      return null;
    }
    // what placing these pegs costs in total
    layoutCost(pegs) {
      const out = {};
      for (const lp of pegs) for (const [cur, a] of entries(PEG_KINDS[lp.type].costs)) out[cur] = (out[cur] ?? 0) + a;
      return out;
    }
    // why a layout can't be loaded now (null: it can): all of it must be unlocked, fit the slots and be paid for, counting the refund of the board
    cantLoad(pegs) {
      const g = this.game, p = g.progress;
      if (this.anyDown()) return "Wait until broken pegs are back";
      const locked = pegs.find((lp) => !p.unlocked(lp.type));
      if (locked) return `${PEG_KINDS[locked.type].name} pegs are not unlocked yet`;
      const slots = pegs.filter((lp) => lp.type !== "limiter").length;
      if (slots > p.slots()) return `Needs ${slots} peg slots (you have ${p.slots()})`;
      if (pegs.length - slots > LIMITERS) return `Only ${LIMITERS} limiters`;
      if (pegs.filter((lp) => lp.type === "power").length > powerPegMax(g.L("power_peg_slots"))) return "Too many power pegs: buy Power Peg Slots";
      const have = {};
      for (const [cur] of entries(this.layoutCost(pegs))) have[cur] = p[CUR_FIELD[cur]];
      for (const pg of g.pegs.list) for (const [cur, a] of entries(this.refundOf(pg))) if (cur in have) have[cur] = (have[cur] ?? 0) + a;
      const cost = this.layoutCost(pegs);
      return entries(cost).every(([cur, a]) => (have[cur] ?? 0) >= a) ? null : `Need ${costText(cost)} (the board's refund counts)`;
    }
    // swaps the board for a layout: everything picked up (refunded), then the layout placed and paid for; returns why not, or null
    loadLayout(pegs) {
      const why = this.cantLoad(pegs);
      if (why) return why;
      const g = this.game, p = g.progress;
      this.clearAll();
      for (const lp of pegs) {
        const s2 = this.placeSpot(lp.x, lp.y, lp.type), c = { ...PEG_KINDS[lp.type].costs };
        p.spend(c);
        g.pegs.add(s2.x, s2.y, lp.type, lp.type === "dual" ? blastHits(g.L("blast_peg_hits")) : 0, 0, c, { arm: lp.arm });
      }
      g.moversJump = true;
      g.uiDirty = true;
      return null;
    }
    // dragging: the peg follows the pointer, and takes the size that belongs to its depth when it is let go
    // a slider's handle: dragging it aims the slider and sets how far it goes
    aimSlider(peg, x, y) {
      const dx = x - peg.ax, dy = y - peg.ay;
      if (Math.hypot(dx, dy) < 4) return;
      peg.dir = Math.atan2(dy, dx);
      peg.reach = Math.min(ARM_MAX, Math.max(ARM_MIN, Math.hypot(dx, dy)));
    }
    dragPeg(peg, x, y) {
      const s2 = this.placeSpot(x, y, peg.type);
      this.game.pegs.move(peg, s2.x, s2.y);
    }
    dropPeg(peg) {
      this.game.pegs.resettleOne(peg);
    }
    // Pegs can go anywhere on the board, the centre at most on the walls, ceiling or floor line (half the peg sticking out),
    // so a tap in the dimmed area outside the board lands on the nearest border. A cannon limiter always sits on the ceiling line.
    placeSpot(x, y, type) {
      return { x: Math.min(W, Math.max(0, x)), y: type === "limiter" ? 0 : Math.min(this.game.worldH, Math.max(0, y)) };
    }
  };

  // src/game/systems/ElectricField.ts
  var ElectricField = class {
    constructor(game) {
      __publicField(this, "game");
      __publicField(this, "arcs");
      __publicField(this, "lastArc");
      this.game = game;
      this.arcs = [];
      this.lastArc = /* @__PURE__ */ new WeakMap();
    }
    // a real hit (not an arc): inside a field, the peg starts an arc (not again within ZAP_PEG_CD)
    onHit(ball, peg) {
      const g = this.game, z = g.zones.at("electric_field", peg.x, peg.y);
      if (!z || g.simT - (this.lastArc.get(peg) ?? -1e9) < ZAP_PEG_CD) return;
      this.lastArc.set(peg, g.simT);
      this.discharge(ball, peg, z.src);
    }
    /* The arc spreads outward in waves: every tagged peg passes it on to its nearest untagged pegs within ZAP_R
       (at most ZAP_BRANCH each, ZAP_MAX in total). Each wave lands ZAP_DELAY ms after the one before. */
    discharge(ball, start, src) {
      const g = this.game, fx = g.effects, seen = /* @__PURE__ */ new Set([start]), near = [];
      let wave = [start], depth = 0, tagged = 0;
      while (wave.length && tagged < ZAP_MAX) {
        depth++;
        const next = [];
        for (const from of wave) {
          const cands = g.pegs.near(from.x - ZAP_R, from.y - ZAP_R, from.x + ZAP_R, from.y + ZAP_R, near).filter((q) => !seen.has(q) && !isDown(q) && !q.off && !isMarker(q) && Math.hypot(q.x - from.x, q.y - from.y) <= ZAP_R).sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y));
          for (const q of cands.slice(0, ZAP_BRANCH)) {
            if (tagged >= ZAP_MAX) break;
            seen.add(q);
            next.push(q);
            tagged++;
            this.arcs.push({ from, to: q, at: g.simT + depth * ZAP_DELAY, ball, src });
          }
        }
        wave = next;
      }
      fx.ring(start.x, start.y, 4, ZAP_R, COLORS.theme.electric, { life: 420, width: 3, fill: true });
      fx.burst(start.x, start.y, COLORS.theme.electricLight, 12, { speed: [80, 220], size: 9, always: true });
      if (tagged) fx.float(start.x, start.y - 22, `ZAP x${tagged}`, COLORS.theme.electric, { big: true, life: 900, always: true });
    }
    // arc jumps that are due land now: lightning, sparks, a hit as if the ball had hit the peg, and damage
    update() {
      const g = this.game;
      for (let i = this.arcs.length - 1; i >= 0; i--) {
        const a = this.arcs[i];
        if (a.at > g.simT) continue;
        this.arcs.splice(i, 1);
        if (isDown(a.to) || !g.pegs.list.includes(a.to)) continue;
        g.effects.bolt(a.from.x, a.from.y, a.to.x, a.to.y, COLORS.theme.electric);
        g.effects.burst(a.to.x, a.to.y, COLORS.theme.electric, 6, { speed: [60, 180], size: 8 });
        g.hits.hitPeg(a.ball, a.to, true);
        if (a.to !== a.src) g.downtime.damage(a.to, ZAP_DMG, a.ball);
      }
    }
  };

  // src/game/systems/FieldEffects.ts
  var FieldEffects = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    // Balance fields: the pegs that were inside when one started push apart until a ball fits between any two,
    // and the circle's edge keeps them inside (ZoneSystem sets that up, and settles them when it ends)
    relax() {
      const g = this.game;
      for (const z of g.zones.zones) if (z.relax) g.pegs.relaxStep(z.relax.members, z.relax.gap, Math.min(1, z.t / 1500), { x: z.x, y: z.y, r: z.r, yMax: g.worldH }, z.relax.links);
    }
    // Blinking pegs: there for BLINK_ON of every BLINK_MS (each on its own beat, from where it is); one coming back waits until no ball is over it
    blink() {
      const g = this.game;
      for (const pg of g.pegs.blink) {
        if (isDown(pg)) continue;
        const off = (g.simT + pg.x * 7 + pg.y * 13) % BLINK_MS >= BLINK_ON;
        if (off === pg.off || !off && g.downtime.ballOver(pg)) continue;
        pg.off = off;
        g.physics.setPegSolid(pg.body, !off);
      }
    }
    // Downdraft: balls inside a band fall GRAV_MULT times as fast
    downdraft() {
      const g = this.game;
      if (!g.zones.zones.length) return;
      for (const b of g.balls) if (g.zones.at("downdraft", b.body.position.x, b.body.position.y)) g.physics.addGravity(b.body, GRAV_MULT - 1);
    }
    // Gravity pegs: every ball within reach is pulled gently towards the peg's centre; the closer the ball, the stronger the pull.
    // Anti-gravity (repel) pegs push the same way out.
    gravityPegs() {
      const g = this.game, ph = g.physics;
      for (const pg of g.pegs.gravity) {
        if (isDown(pg)) continue;
        const sign = pg.type === "antigravity" ? -1 : 1;
        for (const b of g.balls) {
          const p = b.body.position;
          const dx = pg.x - p.x, dy = pg.y - p.y, d = Math.hypot(dx, dy);
          if (d >= GRAVPEG_R || d < 1) continue;
          const f = sign * GRAVPEG_PULL * (1 - d / GRAVPEG_R), v = ph.velocity(b.body);
          ph.setVelocity(b.body, v.x + dx / d * f, v.y + dy / d * f);
        }
      }
    }
    // Chaos Zone: whatever the physics just decided for a ball that bounced inside one, throw it in a random direction at a random speed
    chaos() {
      const g = this.game, ph = g.physics;
      for (const b of g.balls) {
        if (!b.chaos) continue;
        b.chaos = false;
        const v = ph.velocity(b.body), sp = Math.hypot(v.x, v.y);
        const s2 = Math.min(MAX_SPEED, Math.max(2.5, sp * rand(0.7, 1.4)));
        const a = rand(0, 6.2832);
        ph.setVelocity(b.body, s2 * Math.cos(a), s2 * Math.sin(a));
        g.effects.burst(b.body.position.x, b.body.position.y, COLORS.theme.chaos, 3);
      }
    }
  };

  // src/game/pegs/BasicPeg.ts
  function payMoney(ctx, ball, peg, base, col, full) {
    const v = base * (1 + 0.5 * ctx.L("peg_power")) * (1 + 0.05 * ctx.L("combo_chain") * ball.hits) * ctx.goldMul(ball);
    ball.hits++;
    ctx.earn(ball, "money", v);
    ctx.fx.burst(peg.x, peg.y, col, full ? 10 : 5);
    ctx.fx.float(peg.x, peg.y - 12, `+{money}${fmt(v)}`, col, { big: full });
  }
  var BasicPeg = class {
    constructor() {
      __publicField(this, "takesGoo", true);
    }
    onHit(ctx, ball, peg) {
      payMoney(ctx, ball, peg, 1 + ctx.L("peg_value"), peg.color, false);
    }
  };

  // src/game/pegs/AlchemyPeg.ts
  var AlchemyPeg = class {
    constructor() {
      __publicField(this, "takesGoo", true);
    }
    onHit(ctx, ball, peg) {
      const full = peg.charge >= 1;
      const base = Math.round(ALCH_MIN + (alchMax(ctx.L("alchemy_pegs_value")) - ALCH_MIN) * peg.charge);
      peg.charge = 0;
      peg.color = COLORS.theme.alchemy;
      payMoney(ctx, ball, peg, base, full ? COLORS.theme.money : mixCol(COLORS.theme.alchemy, COLORS.theme.money, 0.6), full);
    }
  };

  // src/game/pegs/BlastPeg.ts
  var BlastPeg = class {
    constructor() {
      __publicField(this, "takesGoo", false);
    }
    onHit(ctx, ball, peg) {
      const m = blastMult(ctx.L("blast_peg_value"));
      const v = m * (1 + ctx.L("peg_value")) * (1 + 0.5 * ctx.L("peg_power")) * (1 + 0.05 * ctx.L("combo_chain") * ball.hits) * ctx.goldMul(ball);
      ball.hits++;
      ctx.earn(ball, "money", v);
      ctx.fx.burst(peg.x, peg.y, COLORS.theme.money, 10);
      ctx.fx.float(peg.x, peg.y - 12, `+{money}${fmt(v)}`, COLORS.theme.money, { big: true, life: 900, always: true });
      if (ctx.L("blast_research")) ctx.earn(ball, "rp", rpPerHit(ctx.L("research_pegs_value")) * m);
      if (ctx.L("blast_goo")) ctx.earn(ball, "goo", gooPerHit(ctx.L("rich_phlegm")) * m / 10);
      if (ctx.L("blast_evil")) ctx.earn(ball, "evil", EVIL_BASE * m * evilYield(ctx.L("dark_harvest")));
      if (--peg.left <= 0) ctx.downPeg(peg);
    }
  };

  // src/game/pegs/BlinkPeg.ts
  var BlinkPeg = class {
    constructor() {
      __publicField(this, "takesGoo", true);
    }
    onHit(ctx, ball, peg) {
      payMoney(ctx, ball, peg, 2 * (1 + ctx.L("peg_value")), peg.color, false);
    }
  };

  // src/game/pegs/PowerPeg.ts
  var PowerPeg = class {
    constructor() {
      __publicField(this, "takesGoo", true);
    }
    onHit(ctx, ball, peg) {
      payMoney(ctx, ball, peg, 1 + ctx.L("peg_value"), peg.color, false);
      ctx.powerHit(peg);
    }
  };

  // src/game/pegs/ResearchPeg.ts
  var ResearchPeg = class {
    constructor() {
      __publicField(this, "takesGoo", true);
    }
    onHit(ctx, ball, peg) {
      ball.hits++;
      const rp = rpPerHit(ctx.L("research_pegs_value"));
      ctx.earn(ball, "rp", rp);
      ctx.fx.burst(peg.x, peg.y, peg.color, 6);
      ctx.fx.float(peg.x, peg.y - 12, `+{research}${fmt(rp)}`, peg.color);
    }
  };

  // src/game/pegs/SplitterPeg.ts
  var SplitterPeg = class extends BasicPeg {
    onHit(ctx, ball, peg) {
      if (ball.w === 1 && !ball.split) {
        ball.split = true;
        ctx.queueSplit(ball, peg);
      }
      super.onHit(ctx, ball, peg);
    }
  };

  // src/game/pegs/WallPeg.ts
  var WallPeg = class {
    constructor() {
      __publicField(this, "takesGoo", false);
    }
    onHit() {
    }
  };

  // src/game/pegs/PegBehaviors.ts
  var PEG_BEHAVIORS = {
    basic: new BasicPeg(),
    research: new ResearchPeg(),
    splitter: new SplitterPeg(),
    gravity: new BasicPeg(),
    // its pull is a field effect (FieldEffects), its hit a basic one
    alchemy: new AlchemyPeg(),
    dual: new BlastPeg(),
    power: new PowerPeg(),
    antigravity: new BasicPeg(),
    // its push is a field effect, like the gravity peg's pull
    bouncy: new BasicPeg(),
    // its bounce is a contact rule (HitResolver)
    wall: new WallPeg(),
    blink: new BlinkPeg(),
    limiter: new WallPeg(),
    slider: new BasicPeg(),
    // the moving pegs pay like plain ones; their movement is in PegBoard
    spinner: new BasicPeg(),
    orbit: new BasicPeg()
    // never hit: it is not solid (PegBoard)
  };

  // src/game/systems/HitResolver.ts
  var HitResolver = class {
    constructor(game) {
      __publicField(this, "game");
      __publicField(this, "fx");
      this.game = game;
      const fx = game.effects;
      this.fx = { burst: (...a) => fx.burst(...a), float: (x, y, text, color, o = {}) => fx.float(x, y, text, color, { ...o, dim: true }) };
    }
    L(id) {
      return this.game.L(id);
    }
    goldMul(ball) {
      return this.game.ballSystem.goldMul(ball);
    }
    // everything a ball earns goes into its haul (ball.stash); the player only gets it when the ball lands in a bucket
    earn(ball, cur, v) {
      ball.stash[cur] += v;
    }
    queueSplit(ball, peg) {
      this.game.pendingSplit.push({ ball, peg });
    }
    downPeg(peg) {
      this.game.downtime.breakDown(peg);
    }
    powerHit(peg) {
      this.game.zones.powerHit(peg);
    }
    // Game rules for contacts, applied each step right after Matter sets up its contact pairs and before it resolves them:
    // a ghost ball's contact with a peg becomes a sensor (no push, but the hit is still reported), and a Dead Zone takes the bounce out of contacts inside it.
    contactRules(pairs) {
      const g = this.game;
      for (const b of g.balls) b.inPeg = false;
      for (const pr of pairs) {
        const ball = pr.bodyA.ball || pr.bodyB.ball;
        if (!pr.isActive || !ball) continue;
        const peg = pr.bodyA.peg || pr.bodyB.peg, p = ball.body.position;
        if (peg) ball.inPeg = true;
        pr.isSensor = !!peg && ball.ghost;
        if (peg?.type === "bouncy") pr.restitution = BOUNCY_REST;
        if (g.zones.at("dead_zone", p.x, p.y)) pr.restitution = DEAD_REST;
      }
    }
    onContacts(pairs) {
      const g = this.game;
      for (const pr of pairs) {
        let b = pr.bodyA, o = pr.bodyB;
        if (!b.ball) {
          b = pr.bodyB;
          o = pr.bodyA;
        }
        if (!b.ball) continue;
        const p = b.position;
        if (!pr.isSensor && g.zones.at("chaos_zone", p.x, p.y)) b.ball.chaos = true;
        if (o.peg && this.hitPeg(b.ball, o.peg)) g.electric.onHit(b.ball, o.peg);
        else if (o.label === "wall") this.hitWall(b.ball, o.id);
      }
    }
    // Wall Bounce: a side wall pays like a plain peg hit (times Wall Value); the same wall again within 200 ms does not count
    hitWall(ball, wall) {
      const g = this.game;
      if (!this.L("wall_bounce") || ball.lastWall === wall && g.simT - ball.lastWallT < 200) return;
      ball.lastWall = wall;
      ball.lastWallT = g.simT;
      const v = (1 + this.L("peg_value")) * (1 + 0.5 * this.L("peg_power")) * (1 + 0.05 * this.L("combo_chain") * ball.hits) * this.goldMul(ball) * wallMult(this.L("wall_value"));
      ball.hits++;
      this.earn(ball, "money", v);
      const p = ball.body.position;
      this.fx.float(p.x, p.y - 12, `+{money}${fmt(v)}`, COLORS.theme.world);
    }
    // a ball hits a peg and the peg pays out; arc = tagged by an electric arc (no anti-farming check)
    // returns false when the hit does not count
    hitPeg(ball, peg, arc = false) {
      const g = this.game, fx = this.fx;
      if (isDown(peg)) return false;
      if (!arc) {
        if (ball.lastPeg === peg && g.simT - ball.lastT < 200) return false;
        ball.lastPeg = peg;
        ball.lastT = g.simT;
      }
      peg.flash = 1;
      if (ball.goo && ++ball.gooHits >= gooballPegs(this.L("lasting_goo"))) ball.expired = true;
      if (g.evilOn) {
        const ey = evilYield(this.L("dark_harvest"));
        const ev = (EVIL_BASE + (1 - EVIL_BASE) * peg.dmg) * ey;
        this.earn(ball, "evil", ev);
        if (ev >= 0.25) fx.float(peg.x - 10, peg.y - 22, `+{evil}${evFmt(ev)}`, COLORS.theme.evil);
        g.downtime.damage(peg, evilDmg(this.L("sturdy_pegs")), ball);
      }
      const behavior = PEG_BEHAVIORS[peg.type];
      if (behavior.takesGoo) {
        if (ball.goo) peg.gooT = GOO_PEG_MS;
        else if (peg.gooT > 0) {
          const goo = gooPerHit(this.L("rich_phlegm"));
          this.earn(ball, "goo", goo);
          fx.float(peg.x + 10, peg.y - 22, `+{goo}${fmt(goo)}`, COLORS.theme.goo);
        }
      }
      if (ball.research) this.payResearch(ball, peg);
      else behavior.onHit(this, ball, peg);
      return true;
    }
    payResearch(ball, peg) {
      const rp = rpPerHit(this.L("research_pegs_value")) * RBALL_MULT;
      this.earn(ball, "rp", rp);
      this.fx.float(peg.x, peg.y - 12, `+{research}${fmt(rp)}`, COLORS.theme.research);
      if (peg.type === "power") this.powerHit(peg);
    }
  };

  // src/game/systems/Laser.ts
  var Laser = class {
    constructor(game) {
      __publicField(this, "game");
      __publicField(this, "pulseT");
      __publicField(this, "beam");
      this.game = game;
      this.pulseT = 0;
      this.beam = {
        body: { position: { x: 0, y: 0 } },
        r: 0,
        px: 0,
        py: 0,
        hits: 0,
        age: 0,
        still: 0,
        tick: 0,
        trail: [],
        lastPeg: null,
        lastT: 0,
        lastWall: 0,
        lastWallT: 0,
        goo: false,
        gold: false,
        gooHits: 0,
        expired: false,
        w: 0,
        split: true,
        glow: COLORS.theme.laser,
        ghost: false,
        inPeg: false,
        chaos: false,
        research: false,
        stash: { money: 0, rp: 0, goo: 0, evil: 0 }
      };
    }
    get on() {
      return this.game.temps.running("laser");
    }
    // the first peg straight under the cannon (up, solid, not a limiter)
    target() {
      const x = this.game.launchX;
      let best = null;
      for (const p of this.game.pegs.list) {
        if (isDown(p) || p.off || isMarker(p) || p.y < LAUNCH_Y || Math.abs(p.x - x) > shapeR(p.type, p.r)) continue;
        if (!best || p.y < best.y) best = p;
      }
      return best;
    }
    tick(dt) {
      if (!this.on) {
        this.pulseT = 0;
        return;
      }
      this.pulseT += dt;
      if (this.pulseT < LASER_PULSE) return;
      this.pulseT -= LASER_PULSE;
      const g = this.game, evil = g.L("evil") > 0;
      for (let i = 0, n = 1 + g.L("laser_focus"); i < n; i++) {
        const peg = this.target();
        if (!peg) break;
        this.beam.hits = 0;
        g.hits.hitPeg(this.beam, peg, true);
        g.effects.burst(peg.x, peg.y - peg.r, COLORS.theme.laser, 4, { speed: [40, 140], size: 7 });
        if (evil) g.downtime.damage(peg, LASER_DMG, this.beam);
      }
      const s2 = this.beam.stash, p = g.progress;
      p.gain(s2.money);
      p.rp += s2.rp;
      p.addGoo(s2.goo);
      p.evil += s2.evil;
      s2.money = s2.rp = s2.goo = s2.evil = 0;
      g.uiDirty = true;
    }
  };

  // src/game/PegColor.ts
  var pegCol = (p) => p.dmg > 0.02 ? mixCol(p.color, COLORS.theme.evil, Math.round(p.dmg * 10) / 10) : p.color;

  // src/game/systems/PegDowntime.ts
  var CLEAR_MS = 100;
  var PegDowntime = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    downtime() {
      return rebuildMs(this.game.L("quick_rebuild"));
    }
    // adds damage (0..1 scale); a peg it breaks pays Evil (EVIL_KILL) into the ball's haul, or straight to the player when
    // there is no ball (the Bomb, the laser). Returns true when this broke the peg.
    damage(peg, n, ball) {
      if (isDown(peg) || isMarker(peg)) return false;
      peg.dmg = Math.min(1, peg.dmg + n);
      if (peg.dmg < 1) return false;
      this.breakDown(peg);
      const g = this.game, ek = EVIL_KILL * evilYield(g.L("dark_harvest"));
      if (ball) g.hits.earn(ball, "evil", ek);
      else g.progress.evil += ek;
      g.effects.burst(peg.x, peg.y, COLORS.theme.evil, 24);
      g.effects.float(peg.x, peg.y - 34, `+{evil}${evFmt(ek)}`, COLORS.theme.evil, { big: true, life: 1100, always: true });
      return true;
    }
    breakDown(peg) {
      if (isDown(peg) || isMarker(peg)) return;
      peg.dmg = 1;
      peg.downT = peg.downMs = this.downtime();
      peg.unpaid = false;
      peg.gooT = 0;
      if (peg.type === "alchemy") {
        peg.charge = 0;
        peg.color = COLORS.theme.alchemy;
      }
      peg.castHits = 0;
      peg.castWait = false;
      this.game.physics.setPegSolid(peg.body, false);
      this.game.effects.burst(peg.x, peg.y, pegCol(peg), 12, { speed: [50, 160] });
      this.game.uiDirty = true;
    }
    tick(dt) {
      for (const pg of this.game.pegs.list) {
        if (!isDown(pg)) continue;
        pg.downT -= dt;
        if (pg.downT <= 0) this.tryReturn(pg);
      }
    }
    // its time is up: pay and come back, or wait (can't pay: half a downtime; a ball over the spot: a moment)
    tryReturn(pg) {
      const g = this.game, p = g.progress, price = PEG_KINDS[pg.type].costs;
      if (!p.has(price)) {
        pg.unpaid = true;
        pg.downT = pg.downMs = this.downtime() / 2;
        return;
      }
      if (this.ballOver(pg)) {
        pg.downT = CLEAR_MS;
        return;
      }
      p.spend(price);
      pg.paid = { ...price };
      pg.unpaid = false;
      pg.downT = 0;
      pg.dmg = 0;
      pg.flash = 1;
      pg.off = false;
      if (pg.type === "dual") pg.left = blastHits(g.L("blast_peg_hits"));
      g.physics.setPegSolid(pg.body, true);
      g.effects.ring(pg.x, pg.y, pg.r, pg.r + 14, pegCol(pg), { life: 420, width: 3 });
      g.uiDirty = true;
    }
    ballOver(pg) {
      return this.game.balls.some((b) => Math.hypot(b.body.position.x - pg.x, b.body.position.y - pg.y) < b.r + pg.r + 1);
    }
  };

  // src/game/systems/ResearchLab.ts
  var ResearchLab = class {
    constructor(game) {
      __publicField(this, "game");
      this.game = game;
    }
    // every labInterval it gives 1 RP + Research Batch; several ticks in one step when the interval is shorter than a step
    tick(dt) {
      const g = this.game, l = g.L("research_lab");
      if (!l) return;
      const iv = labInterval(l);
      g.labT += dt;
      if (g.labT < iv) return;
      const n = Math.floor(g.labT / iv);
      g.labT -= n * iv;
      g.progress.rp += n * (1 + g.L("research_batch"));
    }
  };

  // src/game/systems/ZoneSystem.ts
  var CAST_SCALE = 0.6;
  var CAST_MS = 3e3;
  var ZoneSystem = class {
    constructor(game) {
      __publicField(this, "game");
      __publicField(this, "zones");
      __publicField(this, "targeting");
      __publicField(this, "preview");
      __publicField(this, "outside");
      __publicField(this, "nextId");
      this.game = game;
      this.zones = [];
      this.targeting = null;
      this.preview = null;
      this.outside = false;
      this.nextId = 1;
    }
    at(power2, x, y) {
      return this.zones.length ? zoneAt(this.zones, power2, x, y) : void 0;
    }
    // the area the targeted power would cover at x, y
    previewArea(x, y) {
      return this.targeting?.zone ? areaOf(this.targeting.zone, x, y, this.sizeMul()) : null;
    }
    sizeMul() {
      return zoneSize(this.game.L("wider_zones"));
    }
    timeMul() {
      return zoneTime(this.game.L("longer_zones"));
    }
    target(pw) {
      if (!pw.zone || !this.game.economy.ready(pw)) return false;
      this.targeting = pw;
      this.preview = null;
      this.game.uiDirty = true;
      return true;
    }
    cancel() {
      if (!this.targeting) return;
      this.targeting = null;
      this.preview = null;
      this.outside = false;
      this.game.uiDirty = true;
    }
    // pressing (and dragging) while targeting: the zone shows there; onBoard false: off the board (letting go there cancels)
    aim(w, onBoard = true) {
      if (this.targeting) {
        this.preview = { x: w.x, y: w.y };
        this.outside = !onBoard;
      }
    }
    // letting go: placed where it shows (on a power peg: loaded into it instead; off the board: cancelled); returns a message for the player, or null
    release() {
      const pw = this.targeting, at = this.preview;
      if (!pw || !at) return null;
      if (this.outside) {
        this.cancel();
        return null;
      }
      const peg = this.game.pegs.at(at.x, at.y);
      return peg?.type === "power" ? this.socket(peg, pw) : this.place(pw, at);
    }
    // a tap: pressed and let go in one spot
    tap(w, onBoard = true) {
      this.aim(w, onBoard);
      return this.release();
    }
    // the player places the power: pay, start its cooldown, and the zone appears
    place(pw, at) {
      const g = this.game, p = g.progress;
      if (!p.has(pw.costs)) return `Need ${costText(pw.costs)} for ${pw.name}`;
      p.spend(pw.costs);
      const ms = pw.ms * this.timeMul();
      g.temps.start(pw.id, ms);
      this.add(pw, at.x, at.y, this.sizeMul(), ms, null);
      this.targeting = null;
      this.preview = null;
      g.uiDirty = true;
      return null;
    }
    // loads the power into a power peg for its full price (the power's cooldown starts as if it was placed)
    socket(peg, pw) {
      const g = this.game, p = g.progress;
      if (!p.has(pw.costs)) return `Need ${costText(pw.costs)} to load ${pw.name}`;
      p.spend(pw.costs);
      g.temps.start(pw.id);
      peg.socket = pw.id;
      peg.color = pw.color;
      peg.castHits = 0;
      peg.castWait = false;
      g.effects.ring(peg.x, peg.y, peg.r, peg.r + 22, pw.color, { life: 500, width: 3 });
      g.effects.float(peg.x, peg.y - 22, `${pw.name} loaded`, pw.color, { big: true, life: 1200, always: true });
      this.targeting = null;
      this.preview = null;
      g.uiDirty = true;
      return null;
    }
    hitsPerCast() {
      return powerHits(this.game.L("power_peg_charge"));
    }
    // a hit on a loaded power peg: one towards its next cast (none while it rests after a cast)
    powerHit(peg) {
      if (!peg.socket || peg.castCd > 0) return;
      peg.castHits = Math.min(this.hitsPerCast(), peg.castHits + 1);
      if (peg.castHits >= this.hitsPerCast()) this.cast(peg);
    }
    // a charged power peg casts a smaller, shorter zone around itself for its share of the power's price; can't pay: it waits
    cast(peg) {
      const g = this.game, p = g.progress, pw = POWER_BY_ID[peg.socket];
      if (!pw || isDown(peg)) return;
      const share = castCost(g.L("efficient_casting")), price = {};
      for (const [cur, a] of entries(pw.costs)) price[cur] = Math.ceil(a * share);
      if (!p.has(price)) {
        peg.castWait = true;
        return;
      }
      p.spend(price);
      peg.castHits = 0;
      peg.castWait = false;
      peg.castCd = peg.castCdMs = g.downtime.downtime();
      this.add(pw, peg.x, peg.y, CAST_SCALE * this.sizeMul(), CAST_MS * this.timeMul(), peg);
      g.uiDirty = true;
    }
    add(pw, x, y, scale, ms, src) {
      if (!pw.zone) return null;
      const z = { ...areaOf(pw.zone, x, y, scale), id: this.nextId++, power: pw.id, t: ms, ms, src, relax: null };
      this.zones.push(z);
      if (pw.id === "balance_field") this.startRelax(z);
      if (pw.id === "goo_spit") this.spit(z);
      const fx = this.game.effects, r = z.shape === "circle" ? z.r : z.h / 2;
      fx.ring(x, y, 6, r, pw.color, { life: 420, width: 3 });
      return z;
    }
    // goo spit: every peg inside that takes goo is coated at once
    spit(z) {
      const g = this.game;
      for (const p of g.pegs.list) {
        if (p === z.src || isDown(p) || !PEG_BEHAVIORS[p.type].takesGoo || !inZone(z, p.x, p.y, p.r)) continue;
        p.gooT = GOO_PEG_MS;
        g.effects.burst(p.x, p.y - 4, COLORS.theme.goo, 5, { speed: [30, 90] });
      }
    }
    // balance field: the pegs inside when it starts are the ones it moves; they spread until a ball just fits between them
    startRelax(z) {
      const members = this.game.pegs.list.filter((p) => p !== z.src && !isMarker(p) && !isMover(p) && inZone(z, p.x, p.y));
      z.relax = { gap: 2 * ballRadius(this.game.L("fat_balls")), members, links: [] };
    }
    tick(dt) {
      if (this.game.pegs.placedOf("power")) for (const pg of this.game.pegs.list) {
        if (pg.castCd > 0) pg.castCd = Math.max(0, pg.castCd - dt);
        if (pg.castWait) this.cast(pg);
      }
      for (let i = this.zones.length - 1; i >= 0; i--) {
        const z = this.zones[i];
        z.t -= dt;
        if (z.t > 0) continue;
        this.zones.splice(i, 1);
        this.end(z);
      }
    }
    end(z) {
      const g = this.game;
      if (z.power === "bomb") g.bomb.explode(z);
      if (z.relax) {
        for (const p of z.relax.members) g.pegs.resettleOne(p);
        g.uiDirty = true;
      }
    }
  };

  // src/game/TempEffects.ts
  var tmr = (s2) => s2.t > 0 ? { active: true, s: Math.ceil(s2.t / 1e3) } : s2.cd > 0 ? { active: false, s: Math.ceil(s2.cd / 1e3) } : null;
  var TempEffects = class {
    constructor() {
      __publicField(this, "s");
      this.s = {};
      for (const pw of POWERS) this.s[pw.id] = { t: 0, cd: 0 };
    }
    running(id) {
      return this.s[id].t > 0;
    }
    start(id, ms = POWER_BY_ID[id].ms) {
      this.s[id].t = ms;
    }
    timer(id) {
      return this.s[id] ? tmr(this.s[id]) : null;
    }
    // { active, s } while running or cooling down
    tick(dt) {
      for (const id in this.s) {
        const s2 = this.s[id];
        if (s2.t > 0) {
          s2.t -= dt;
          if (s2.t <= 0) {
            s2.t = 0;
            s2.cd = POWER_BY_ID[id].cd;
          }
        } else if (s2.cd > 0) s2.cd = Math.max(0, s2.cd - dt);
      }
    }
    toSave() {
      return Object.fromEntries(Object.keys(this.s).map((id) => [id, [this.s[id].t, this.s[id].cd]]));
    }
    // no balls or zones survive a reload, so an effect that was still running is not resumed: its time left plus the full cooldown is owed instead
    load(timers) {
      for (const id in this.s) {
        const t = timers[id];
        if (!Array.isArray(t)) continue;
        const run = Number.isFinite(t[0]) ? Math.max(0, t[0]) : 0, left = Number.isFinite(t[1]) ? Math.max(0, t[1]) : 0;
        this.s[id].cd = Math.min(run > 0 ? run + POWER_BY_ID[id].cd : left, 6e5);
      }
    }
  };

  // src/game/Game.ts
  var Game = class {
    constructor() {
      __publicField(this, "progress");
      __publicField(this, "temps");
      __publicField(this, "effects");
      __publicField(this, "balls");
      __publicField(this, "physics");
      __publicField(this, "pegs");
      __publicField(this, "buckets");
      __publicField(this, "worldH");
      __publicField(this, "evilOn");
      __publicField(this, "autoOn");
      __publicField(this, "simT");
      __publicField(this, "labT");
      __publicField(this, "autoT");
      __publicField(this, "recoil");
      __publicField(this, "launchX");
      __publicField(this, "sweepPhase");
      __publicField(this, "moversJump");
      __publicField(this, "prevLaunchX");
      __publicField(this, "pendingSplit");
      __publicField(this, "uiDirty");
      __publicField(this, "editing");
      __publicField(this, "edit");
      __publicField(this, "ballSystem");
      __publicField(this, "hits");
      __publicField(this, "economy");
      __publicField(this, "bomb");
      __publicField(this, "electric");
      __publicField(this, "zones");
      __publicField(this, "laser");
      __publicField(this, "fields");
      __publicField(this, "lab");
      __publicField(this, "downtime");
      this.progress = new Progress();
      this.temps = new TempEffects();
      this.effects = new Effects();
      this.balls = [];
      const near = [];
      this.physics = new Physics({
        movers: this.balls,
        staticNear: (x0, y0, x1, y1) => this.pegs.near(x0, y0, x1, y1, near),
        onPairs: (pairs) => this.hits.contactRules(pairs)
      }, { width: W, gravityScale: GRAVITY_SCALE });
      this.pegs = new PegBoard(this.physics, this.progress);
      this.buckets = new Buckets(this.progress);
      this.physics.onCollisionStart((pairs) => this.hits.onContacts(pairs));
      this.worldH = worldHeight(0);
      this.evilOn = false;
      this.autoOn = true;
      this.simT = 0;
      this.labT = 0;
      this.autoT = 0;
      this.recoil = 0;
      this.launchX = W / 2;
      this.sweepPhase = 0;
      this.moversJump = true;
      this.prevLaunchX = this.launchX;
      this.pendingSplit = [];
      this.uiDirty = false;
      this.editing = false;
      this.edit = new EditMode(this);
      this.ballSystem = new BallSystem(this);
      this.hits = new HitResolver(this);
      this.economy = new Economy(this);
      this.bomb = new Bomb(this);
      this.electric = new ElectricField(this);
      this.zones = new ZoneSystem(this);
      this.laser = new Laser(this);
      this.fields = new FieldEffects(this);
      this.lab = new ResearchLab(this);
      this.downtime = new PegDowntime(this);
    }
    L(id) {
      return this.progress.L(id);
    }
    // the launcher stays near the top; the bucket is anchored to the floor, because the world grows downward
    // the stretch of ceiling the cannon sweeps: a limiter left of the middle bounds the left, one right of it the right
    sweepRange() {
      let a = SWEEP_MARGIN, b = W - SWEEP_MARGIN;
      for (const l of this.pegs.limiters) {
        if (l.x < W / 2) a = Math.max(a, l.x);
        else b = Math.min(b, l.x);
      }
      return [a, Math.max(a + 10, b)];
    }
    rimY() {
      return this.worldH - 36;
    }
    catchY() {
      return this.worldH - 30;
    }
    // The world grows downward: the launcher and every peg stay where they are, the floor and bucket move down.
    growWorld() {
      this.worldH = worldHeight(this.L("deeper_world"));
    }
    step(dt) {
      this.simT += dt;
      this.lab.tick(dt);
      this.prevLaunchX = this.launchX;
      const [a, b] = this.sweepRange(), half = (b - a) / 2;
      this.sweepPhase += dt * Math.PI * 2 / SWEEP_MS * (W / 2 - SWEEP_MARGIN) / Math.max(half, 5);
      this.launchX = a + half + half * Math.sin(this.sweepPhase);
      this.recoil = Math.max(0, this.recoil - dt / 220);
      this.temps.tick(dt);
      this.zones.tick(dt);
      this.fields.relax();
      for (const b2 of this.balls) if (this.zones.at("ghost_zone", b2.body.position.x, b2.body.position.y)) b2.ghost = true;
      const al = this.L("auto_dropper") && 1 + this.L("faster_dropper");
      if (al > 0 && this.autoOn) {
        this.autoT = Math.min(this.autoT + dt, autoInterval(al));
        if (this.autoT >= autoInterval(al) && this.ballSystem.launch()) this.autoT = 0;
      }
      for (const b2 of this.balls) {
        b2.px = b2.body.position.x;
        b2.py = b2.body.position.y;
      }
      this.fields.gravityPegs();
      this.fields.blink();
      this.pegs.moveMovers(this.simT, !this.moversJump);
      this.moversJump = false;
      this.fields.downdraft();
      this.physics.update(dt);
      this.fields.chaos();
      this.ballSystem.update(dt);
      this.electric.update();
      this.laser.tick(dt);
      while (this.pendingSplit.length) {
        const s2 = this.pendingSplit.pop();
        this.ballSystem.split(s2.ball, s2.peg);
      }
      this.buckets.tick(dt);
      this.downtime.tick(dt);
      this.pegs.tick(dt, this.evilOn ? 0 : evilRegen(this.L("fast_healing")));
      this.effects.tick(dt);
    }
  };

  // src/config/CurrencyIcons.ts
  var cssInk = (name) => `var(${cssName("theme", name)})`;
  var colorInk = (name) => COLORS.theme[name];
  var SHAPES = {
    money: (ink) => `<circle cx="12" cy="12" r="9.5" style="fill:${ink("money")};stroke:${ink("moneyRim")};stroke-width:1.6"/><circle cx="12" cy="12" r="5.6" style="fill:none;stroke:${ink("moneyRing")};stroke-width:1.8"/>`,
    research: (ink) => `<polygon points="12,2 21,7 21,17 12,22 3,17 3,7" style="fill:${ink("research")};fill-opacity:.25;stroke:${ink("research")};stroke-width:2.2;stroke-linejoin:round"/>`,
    goo: (ink) => `<path d="M12 2.5C12 2.5 5.5 10 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z" style="fill:${ink("goo")};fill-opacity:.3;stroke:${ink("goo")};stroke-width:2.2;stroke-linejoin:round"/>`,
    evil: (ink) => `<polygon points="12,2.5 14.4,9.3 21.5,9.4 15.8,13.7 17.9,20.6 12,16.5 6.1,20.6 8.2,13.7 2.5,9.4 9.6,9.3" style="fill:${ink("evil")};fill-opacity:.3;stroke:${ink("evil")};stroke-width:2;stroke-linejoin:round"/>`
  };
  function currencySvg(c, ink, size) {
    const dims = size ? ` width="${size}" height="${size}"` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${dims}>${SHAPES[c](ink)}</svg>`;
  }

  // src/render/CurrencyImages.ts
  var SIZE = 64;
  function currencyImages() {
    const out = {};
    for (const c of CURRENCIES) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = SIZE;
      const img = new Image();
      img.onload = () => context2d(canvas).drawImage(img, 0, 0, SIZE, SIZE);
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currencySvg(c, colorInk, SIZE))}`;
      out[c] = canvas;
    }
    return out;
  }

  // src/render/Layer.ts
  var Layer = class {
    constructor(r, game) {
      __publicField(this, "r");
      __publicField(this, "game");
      this.r = r;
      this.game = game;
    }
    get ctx() {
      return this.r.ctx;
    }
  };

  // src/render/BallLayer.ts
  var BallLayer = class extends Layer {
    drawBalls(a, top, bot) {
      const ctx = this.ctx, balls = this.game.balls;
      const pos = (b) => {
        const p = b.body.position;
        return [b.px + (p.x - b.px) * a, b.py + (p.y - b.py) * a];
      };
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const b of balls) {
        const [x, y] = pos(b);
        if (y < top || y > bot) continue;
        const col = b.research ? COLORS.theme.research : b.goo ? COLORS.theme.goo : b.gold ? COLORS.theme.money : b.glow;
        const t = b.trail;
        if (t.length >= 4) {
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = b.r * 1.1;
          ctx.beginPath();
          ctx.moveTo(t[0], t[1]);
          for (let i = 2; i < t.length; i += 2) ctx.lineTo(t[i], t[i + 1]);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        this.r.glow(col, x, y, b.r * 5, 0.9);
      }
      ctx.globalCompositeOperation = "source-over";
      for (const b of balls) {
        const [x, y] = pos(b);
        if (y < top || y > bot) continue;
        ctx.globalAlpha = b.ghost ? 0.5 : 1;
        ctx.fillStyle = b.research ? COLORS.theme.research : b.goo ? COLORS.theme.goo : b.gold ? COLORS.theme.money : COLORS.ui.strong;
        ctx.beginPath();
        ctx.arc(x, y, b.r * 0.78, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  };

  // src/render/BoardLayer.ts
  var BoardLayer = class extends Layer {
    // grid, depth markers, the dimmed outside, walls, ceiling and drain line
    drawBoard(top, bot) {
      const ctx = this.ctx, worldH = this.game.worldH;
      const visTop = Math.max(0, top), visBot = Math.min(worldH, bot);
      ctx.lineWidth = 1 / this.r.camera.scale;
      ctx.strokeStyle = alpha(COLORS.ui.frame, 0.1);
      ctx.beginPath();
      for (let x = 40; x < W; x += 40) {
        ctx.moveTo(x, visTop);
        ctx.lineTo(x, visBot);
      }
      for (let y = 40; y < worldH; y += 40) {
        if (y < top || y > bot) continue;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
      ctx.font = "600 9px system-ui,sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = alpha(COLORS.ui.label, 0.55);
      for (let y = 200; y < worldH; y += 200) {
        if (y < top || y > bot) continue;
        ctx.strokeStyle = alpha(COLORS.ui.frame, 0.22);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.fillText(String(y), 6, y - 4);
      }
      ctx.fillStyle = alpha(COLORS.ui.page, 0.65);
      ctx.fillRect(-10, worldH, W + 20, 4e3);
      ctx.fillRect(-10, -4e3, W + 20, 4e3);
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(0, visTop);
      ctx.lineTo(0, visBot);
      ctx.moveTo(W, visTop);
      ctx.lineTo(W, visBot);
      if (top < 0) {
        ctx.moveTo(0, 0);
        ctx.lineTo(W, 0);
      }
      this.r.glowStroke(this.game.editing ? COLORS.ui.boardEditing : COLORS.ui.frame, 2.5, 9, 0.22);
      if (bot > worldH) {
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(0, worldH);
        ctx.lineTo(W, worldH);
        this.r.glowStroke(COLORS.ui.drain, 2.5, 9, 0.22);
        ctx.setLineDash([]);
      }
    }
    drawBucket() {
      const ctx = this.ctx, game = this.game, bs = game.buckets.layout(), n = bs.length;
      const rim = game.rimY(), bot = game.worldH - 8, base = bucketValue(game.L("bucket_value"));
      for (let i = 0; i < n; i++) {
        const b = bs[i], fl = game.buckets.flash[i];
        const col = n === 1 ? COLORS.theme.bucket : b.t < 0.01 ? COLORS.theme.bucketOuter : b.t > 0.99 ? COLORS.theme.bucket : COLORS.theme.bucketBetween;
        const sl = Math.min(8, b.w * 0.15);
        const x0 = b.cx - b.w / 2, x1 = b.cx + b.w / 2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, rim);
        ctx.lineTo(x0 + sl, bot);
        ctx.lineTo(x1 - sl, bot);
        ctx.lineTo(x1, rim);
        ctx.closePath();
        ctx.globalAlpha = 0.08 + 0.3 * fl;
        ctx.fillStyle = col;
        ctx.fill();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0, rim);
        ctx.lineTo(x0 + sl, bot);
        ctx.lineTo(x1 - sl, bot);
        ctx.lineTo(x1, rim);
        this.r.glowStroke(col, n > 1 ? 2.5 : 3, 9 + 6 * fl, 0.2 + 0.3 * fl);
        ctx.restore();
        ctx.textAlign = "center";
        ctx.font = `800 ${Math.max(8, Math.min(12, b.w / 3.6))}px system-ui,sans-serif`;
        ctx.fillStyle = col;
        this.r.richText(`{money}${fmt(base * b.mult)}`, b.cx, rim + 17);
      }
    }
    drawLauncher(x, visBot) {
      const ctx = this.ctx, y = LAUNCH_Y, recoil = this.game.recoil;
      ctx.save();
      ctx.strokeStyle = alpha(COLORS.theme.cannon, 0.25);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.moveTo(x, y + 2);
      ctx.lineTo(x, Math.max(y + 2, visBot));
      ctx.stroke();
      ctx.restore();
      ctx.globalCompositeOperation = "lighter";
      this.r.glow(COLORS.theme.cannon, x, y - 6, 70, 0.45);
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.translate(x, 0);
      ctx.fillStyle = COLORS.theme.cannonBody;
      ctx.strokeStyle = COLORS.theme.cannon;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.rect(-6.5, 10 - recoil * 7, 13, 24);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = COLORS.theme.cannonBody;
      ctx.strokeStyle = COLORS.theme.cannon;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.rect(x - 15, 0, 30, 14);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, 7, 3.5, 0, TAU);
      ctx.fillStyle = COLORS.theme.cannon;
      ctx.fill();
    }
  };

  // src/render/PegLayer.ts
  var PEG_GLOW = 12;
  function shapePath(g, type, x, y, r, grow = 0) {
    const R = shapeR(type, r) + grow;
    if (type === "research") hexPath(g, x, y, R);
    else if (type === "power") trianglePath(g, x, y, R);
    else {
      g.beginPath();
      g.arc(x, y, R, 0, TAU);
    }
  }
  var PegLayer = class extends Layer {
    pegPath(p, grow = 0) {
      shapePath(this.ctx, p.type, p.x, p.y, p.r, grow);
    }
    // Each peg look (type, colour, damage, radius) is drawn once into a sprite at device pixels: glow, body, outline.
    // Drawing hundreds of cached images is far cheaper than hundreds of glows plus path fills and strokes every frame.
    pegSprite(p, col, k) {
      const r = Math.round(p.r * 4) / 4, dmg = p.dmg > 0.02 ? Math.round(p.dmg * 10) / 10 : 0;
      const key = `${p.type + col + dmg},${r},${k}`;
      let s2 = this.r.sprites[key];
      if (s2) return s2;
      const R = shapeR(p.type, r) + PEG_GLOW, size = Math.ceil(2 * R * k) + 2, c = size / 2 / k;
      s2 = document.createElement("canvas");
      s2.width = s2.height = size;
      const g = context2d(s2);
      g.scale(k, k);
      const gr = g.createRadialGradient(c, c, 0, c, c, R);
      gr.addColorStop(0, `${col}59`);
      gr.addColorStop(0.35, `${col}29`);
      gr.addColorStop(1, `${col}00`);
      g.fillStyle = gr;
      g.fillRect(0, 0, 2 * c, 2 * c);
      shapePath(g, p.type, c, c, r);
      g.fillStyle = COLORS.detail.pegBody;
      g.fill();
      if (dmg) {
        g.fillStyle = alpha(COLORS.theme.evil, dmg * 0.5);
        g.fill();
      }
      g.strokeStyle = col;
      g.lineWidth = 2.5;
      g.stroke();
      if (p.type === "splitter") {
        g.beginPath();
        g.moveTo(c, c - 5);
        g.lineTo(c, c + 5);
        g.lineWidth = 2;
        g.lineCap = "round";
        g.stroke();
      }
      if (p.type === "alchemy") {
        g.beginPath();
        g.arc(c, c, r * 0.55, 0, TAU);
        g.lineWidth = 1.4;
        g.stroke();
      }
      if (p.type === "power") {
        g.beginPath();
        g.arc(c, c + r * 0.2, r * 0.32, 0, TAU);
        g.fillStyle = col;
        g.fill();
      }
      if (p.type === "antigravity") {
        g.beginPath();
        g.arc(c, c, r * 0.5, 0, TAU);
        g.lineWidth = 1.6;
        g.stroke();
        g.beginPath();
        g.arc(c, c, r * 0.18, 0, TAU);
        g.lineWidth = 1.2;
        g.stroke();
      }
      if (p.type === "bouncy") {
        g.beginPath();
        g.arc(c, c, r * 0.5, 0, TAU);
        g.lineWidth = 2.6;
        g.stroke();
      }
      if (p.type === "slider") {
        g.beginPath();
        g.moveTo(c - r * 0.5, c);
        g.lineTo(c + r * 0.5, c);
        g.lineWidth = 1.8;
        g.lineCap = "round";
        g.stroke();
      }
      if (p.type === "orbit") {
        g.beginPath();
        g.arc(c + r * 0.45, c, 1.8, 0, TAU);
        g.fillStyle = col;
        g.fill();
      }
      if (p.type === "blink") {
        g.setLineDash([2, 2]);
        g.beginPath();
        g.arc(c, c, r * 0.55, 0, TAU);
        g.lineWidth = 1.4;
        g.stroke();
        g.setLineDash([]);
      }
      if (p.type === "gravity") {
        g.beginPath();
        g.arc(c, c, r * 0.5, 0, TAU);
        g.lineWidth = 1.6;
        g.stroke();
        g.beginPath();
        g.arc(c, c, 1.6, 0, TAU);
        g.fillStyle = col;
        g.fill();
      }
      return this.r.sprites[key] = s2;
    }
    // a goo-covered peg wears a wavy green cap on its top side, like icing on a cake; it slowly slides off as the goo wears out
    drawGooCap(p) {
      const ctx = this.ctx, simT = this.game.simT;
      const R = p.r + 1.5, cover = Math.min(1, p.gooT / 2500);
      const edge = p.y - R * 1.25 + R * 1.45 * cover;
      const wave = (x) => Math.sin(x * 0.62 + simT / 260 + p.x) * 1.6 + Math.sin(x * 1.5 - simT / 380 + p.y) * 0.9;
      ctx.save();
      this.pegPath(p, 1.3);
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(p.x - R - 1, p.y - R - 3);
      ctx.lineTo(p.x + R + 1, p.y - R - 3);
      for (let dx = R + 1; dx >= -R - 1; dx -= 1) ctx.lineTo(p.x + dx, edge + wave(p.x + dx));
      ctx.closePath();
      ctx.fillStyle = alpha(COLORS.theme.goo, 0.9);
      ctx.fill();
      ctx.strokeStyle = alpha(COLORS.theme.gooLight, 0.75);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = alpha(COLORS.ui.strong, 0.55);
      ctx.beginPath();
      ctx.ellipse(p.x - R * 0.35, p.y - R * 0.55, 2.4, 1.3, -0.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    // gravity and repel pegs: a faint field showing how far they reach (drawn under the pegs)
    drawGravityFields(top, bot) {
      const ctx = this.ctx, pegs = this.game.pegs.gravity;
      const visible = (p) => p.y >= top - GRAVPEG_R && p.y <= bot + GRAVPEG_R;
      ctx.globalCompositeOperation = "lighter";
      for (const p of pegs) if (visible(p)) this.r.glow(p.color, p.x, p.y, GRAVPEG_R * 2, 0.16);
      ctx.globalCompositeOperation = "source-over";
      ctx.setLineDash([3, 6]);
      for (const p of pegs) {
        if (!visible(p)) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, GRAVPEG_R, 0, TAU);
        ctx.strokeStyle = alpha(p.color, 0.22);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    // one cached sprite per peg (glow + body); the bigger flash glow, goo caps and blast counters only where needed
    drawPegs(k, top, bot) {
      const ctx = this.ctx, camY = this.r.camera.y, pegs = this.game.pegs.list;
      this.drawRelaxLinks();
      if (this.game.editing) this.drawMoverPaths();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (const p of pegs) {
        if (p.y < top || p.y > bot || isMarker(p) || p.type === "spinner") continue;
        const s2 = this.pegSprite(p, pegCol(p), k);
        ctx.globalAlpha = isDown(p) ? 0.25 : p.off ? 0.18 : 1;
        ctx.drawImage(s2, Math.round(p.x * k - s2.width / 2 + this.r.ox), Math.round((p.y - camY) * k - s2.width / 2 + this.r.oy));
      }
      ctx.globalAlpha = 1;
      this.r.worldTransform(k);
      ctx.globalCompositeOperation = "lighter";
      for (const p of pegs) {
        if (p.y < top || p.y > bot || isDown(p) || p.off) continue;
        if (p.flash > 0) this.r.glow(pegCol(p), p.x, p.y, 46 + 22 * p.flash, 0.65 * p.flash);
        if (p.gooT > 0) this.r.glow(COLORS.theme.goo, p.x, p.y - 4, 30, 0.35);
        if (p.charge >= 1) this.r.glow(COLORS.theme.money, p.x, p.y, 36, 0.3 + 0.15 * Math.sin(this.game.simT / 180 + p.x));
      }
      ctx.globalCompositeOperation = "source-over";
      for (const p of pegs) {
        if (p.y < top || p.y > bot) continue;
        if (isMarker(p)) {
          this.drawLimiter(p.x, p.color);
          continue;
        }
        if (p.type === "spinner") this.drawSpinner(p);
        if (isDown(p)) {
          this.drawDown(p);
          continue;
        }
        if (p.socket) this.drawCharge(p);
        if (p.type === "dual") {
          ctx.fillStyle = COLORS.theme.money;
          ctx.font = "800 10px system-ui,sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(p.left), p.x, p.y + 0.5);
          ctx.textBaseline = "alphabetic";
        }
        if (p.gooT > 0) this.drawGooCap(p);
        if (p.flash > 0) {
          this.pegPath(p);
          ctx.fillStyle = alpha(COLORS.ui.strong, p.flash * 0.85);
          ctx.fill();
        }
      }
    }
    // a loaded power peg: a ring that fills with hits towards its next cast; resting after a cast: a faint ring filling up
    // until it counts again; charged but unpaid: the missing currency blinks
    drawCharge(p) {
      const ctx = this.ctx, n = this.game.zones.hitsPerCast(), R = shapeR(p.type, p.r) + 4, rest = p.castCd > 0;
      const done = rest ? 1 - p.castCd / p.castCdMs : p.castHits / n;
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, -Math.PI / 2, -Math.PI / 2 + TAU * done);
      ctx.strokeStyle = alpha(p.color, rest ? 0.3 : 0.85);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      if (p.castWait) this.blinkMissing(POWER_BY_ID[p.socket]?.costs ?? {}, p.x, p.y - R - 4);
    }
    // the icon of the first currency that can't be paid, blinking
    blinkMissing(costs, x, y) {
      const p0 = this.game.progress, miss = entries(costs).find(([c, a]) => !p0.has({ [c]: a }));
      if (!miss || Math.sin(this.game.simT / 220) < -0.3) return;
      this.ctx.font = "700 12px system-ui,sans-serif";
      this.r.richText(`{${miss[0]}}`, x, y);
    }
    // a down peg: an arc that fills up until it comes back; past its time, the icon of what it is waiting for (blinking)
    drawDown(p) {
      const ctx = this.ctx, col = pegCol(p);
      if (p.unpaid) this.blinkMissing(PEG_KINDS[p.type].costs, p.x, p.y + 5);
      const done = p.downMs > 0 ? 1 - p.downT / p.downMs : 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 3, -Math.PI / 2, -Math.PI / 2 + TAU * done);
      ctx.strokeStyle = alpha(col, 0.7);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    // balance fields: a glowing line between every pair of pegs that are pushing each other apart (under the pegs)
    drawRelaxLinks() {
      const ctx = this.ctx;
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = COLORS.theme.balance;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (const z of this.game.zones.zones) {
        const L = z.relax?.links;
        if (!L?.length) continue;
        ctx.globalAlpha = 0.5 * Math.min(1, z.t / 1500);
        ctx.beginPath();
        for (let i = 0; i < L.length; i += 2) {
          ctx.moveTo(L[i].x, L[i].y);
          ctx.lineTo(L[i + 1].x, L[i + 1].y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    // edit mode, mouse: over a peg, what a click does to it (red ×: picked up; a broken one: when it is back);
    // elsewhere a dashed outline of the selected peg type, red when it cannot be placed
    drawPlacement(view) {
      const ctx = this.ctx, game = this.game, type = view.editType;
      if (!game.editing || !view.hover || view.dragging) return;
      const over = game.pegs.at(view.hover.x, view.hover.y);
      if (over) {
        this.drawRemove(over);
        return;
      }
      const s2 = game.edit.placeSpot(view.hover.x, view.hover.y, type), hr = pegRadius(s2.y), ok = !game.edit.cantPlace(type);
      shapePath(ctx, type, s2.x, s2.y, hr);
      ctx.strokeStyle = ok ? PEG_KINDS[type].color : alpha(COLORS.ui.negative, 0.85);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      if ((type === "gravity" || type === "antigravity") && ok) {
        ctx.beginPath();
        ctx.arc(s2.x, s2.y, GRAVPEG_R, 0, TAU);
        ctx.strokeStyle = alpha(PEG_KINDS[type].color, 0.35);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // a spinner: a rounded bar at its body's angle (faint while down)
    drawSpinner(p) {
      const ctx = this.ctx, R = shapeR(p.type, p.r), t = 3 * p.r / PEG_R;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.body.angle);
      ctx.globalAlpha = isDown(p) ? 0.25 : 1;
      ctx.beginPath();
      ctx.roundRect(-R, -t, 2 * R, 2 * t, t);
      ctx.fillStyle = COLORS.detail.pegBody;
      ctx.fill();
      this.r.glowStroke(pegCol(p), 2, 8, 0.3);
      ctx.restore();
    }
    // edit mode: where moving pegs will go: a slider's track with its handle, an orbit's circle, a spinner's sweep
    drawMoverPaths() {
      const ctx = this.ctx;
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1.2;
      for (const p of this.game.pegs.movers) {
        ctx.strokeStyle = alpha(p.color, 0.55);
        ctx.beginPath();
        if (p.type === "slider") {
          const h = sliderHandle(p);
          ctx.moveTo(2 * p.ax - h.x, 2 * p.ay - h.y);
          ctx.lineTo(h.x, h.y);
        } else ctx.arc(p.ax, p.ay, p.type === "orbit" ? p.reach : shapeR(p.type, p.r), 0, TAU);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      for (const p of this.game.pegs.movers) {
        if (p.type !== "slider") continue;
        const h = sliderHandle(p);
        ctx.beginPath();
        ctx.arc(h.x, h.y, 6, 0, TAU);
        ctx.fillStyle = alpha(p.color, 0.35);
        ctx.fill();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    // a cannon limiter: a short bar hanging from the ceiling with a cap
    drawLimiter(x, col) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 16);
      this.r.glowStroke(col, 3, 9, 0.25);
      ctx.beginPath();
      ctx.arc(x, 16, 4, 0, TAU);
      ctx.fillStyle = col;
      ctx.fill();
    }
    drawRemove(p) {
      const ctx = this.ctx;
      this.pegPath(p, 4);
      ctx.strokeStyle = alpha(COLORS.ui.negative, 0.9);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "700 11px system-ui,sans-serif";
      ctx.fillStyle = COLORS.ui.negative;
      ctx.textAlign = "center";
      if (isDown(p)) {
        ctx.fillText(`back in ${Math.ceil(p.downT / 1e3)}s`, p.x, p.y - p.r - 10);
        return;
      }
      const s2 = 3.5, y = p.y - p.r - 12;
      ctx.beginPath();
      ctx.moveTo(p.x - s2, y - s2);
      ctx.lineTo(p.x + s2, y + s2);
      ctx.moveTo(p.x + s2, y - s2);
      ctx.lineTo(p.x - s2, y + s2);
      ctx.strokeStyle = COLORS.ui.negative;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    // touch drag helper: a thin line from the finger up to the peg it is moving
    drawLift(view) {
      const l = view.lift, ctx = this.ctx;
      if (!l) return;
      ctx.beginPath();
      ctx.moveTo(l.finger.x, l.finger.y);
      ctx.lineTo(l.peg.x, l.peg.y + l.peg.r + 2);
      ctx.strokeStyle = alpha(COLORS.ui.strong, 0.45);
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(l.finger.x, l.finger.y, 3, 0, TAU);
      ctx.fillStyle = alpha(COLORS.ui.strong, 0.45);
      ctx.fill();
    }
    // a peg picture for the edit palette (the board's own peg sprite, scaled into a small canvas)
    pegIcon(type, canvas) {
      const s2 = this.pegSprite({ type, r: PEG_R, dmg: 0 }, PEG_KINDS[type].color, 2), g = context2d(canvas);
      const pad = canvas.width * 0.3;
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.drawImage(s2, -pad, -pad, canvas.width + 2 * pad, canvas.height + 2 * pad);
      const c = canvas.width / 2, fade = g.createRadialGradient(c, c, c * 0.6, c, c, c);
      fade.addColorStop(0, COLORS.ui.shadow);
      fade.addColorStop(1, alpha(COLORS.ui.shadow, 0));
      g.globalCompositeOperation = "destination-in";
      g.fillStyle = fade;
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.globalCompositeOperation = "source-over";
    }
  };

  // src/render/ZoneLayer.ts
  var ZoneLayer = class extends Layer {
    drawZones(top, bot, view) {
      const zs = this.game.zones, simT = this.game.simT;
      for (const z of zs.zones) {
        if (!this.visible(z, top, bot)) continue;
        const bomb = z.power === "bomb", pulse = bomb ? 0.5 + 0.5 * Math.sin(simT / (40 + 120 * z.t / z.ms)) : 0;
        this.drawArea(z, bomb && pulse > 0.8 ? COLORS.detail.bombHot : POWER_BY_ID[z.power].color, z.t / z.ms, 0.1 + 0.2 * pulse, false);
      }
      this.drawLaser();
      const at = zs.targeting && (zs.preview ?? view.hover), area = at && zs.previewArea(at.x, at.y);
      if (area) this.drawArea(area, zs.outside ? COLORS.ui.negative : zs.targeting.color, 1, zs.outside ? 0 : 0.08, true);
    }
    // the laser: a flickering beam from the cannon down to the first peg it meets (or the floor)
    drawLaser() {
      const g = this.game;
      if (!g.laser.on) return;
      const ctx = this.ctx, x = g.launchX, hit = g.laser.target(), y = hit ? hit.y - hit.r : g.worldH, w = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x, LAUNCH_Y);
      ctx.lineTo(x, y);
      ctx.globalCompositeOperation = "lighter";
      this.r.glowStroke(COLORS.theme.laser, 2 + w, 12, 0.3);
      ctx.strokeStyle = COLORS.ui.strong;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      if (hit) this.r.glow(COLORS.theme.laser, x, y, 26, 0.8);
    }
    visible(a, top, bot) {
      const h = a.shape === "circle" ? a.r : a.h / 2;
      return a.y + h >= top && a.y - h <= bot;
    }
    // left: share of its time left (a shrinking arc on a circle, a shrinking bar above a band); preview: dashed, no timer
    drawArea(a, col, left, fill, preview) {
      const ctx = this.ctx, circle = a.shape === "circle";
      ctx.beginPath();
      if (circle) ctx.arc(a.x, a.y, a.r, 0, TAU);
      else ctx.rect(a.x - a.w / 2, a.y - a.h / 2, a.w, a.h);
      ctx.fillStyle = alpha(col, fill);
      ctx.fill();
      if (preview) {
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        return;
      }
      ctx.globalCompositeOperation = "lighter";
      this.r.glowStroke(alpha(col, 0.8), 2, 9, 0.18);
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      if (circle) ctx.arc(a.x, a.y, a.r + 5, -Math.PI / 2, -Math.PI / 2 + TAU * left);
      else {
        ctx.moveTo(a.x - a.w / 2, a.y - a.h / 2 - 5);
        ctx.lineTo(a.x - a.w / 2 + a.w * left, a.y - a.h / 2 - 5);
      }
      ctx.strokeStyle = alpha(col, 0.6);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  // src/render/GameRenderer.ts
  var IDLE_VIEW = { hover: null, dragging: false, editType: "basic", lift: null };
  var GameRenderer = class {
    constructor(r, game) {
      __publicField(this, "r");
      __publicField(this, "game");
      __publicField(this, "view");
      __publicField(this, "board");
      __publicField(this, "pegs");
      __publicField(this, "balls");
      __publicField(this, "zones");
      this.r = r;
      this.game = game;
      this.view = IDLE_VIEW;
      this.board = new BoardLayer(r, game);
      this.pegs = new PegLayer(r, game);
      this.balls = new BallLayer(r, game);
      this.zones = new ZoneLayer(r, game);
    }
    get effects() {
      return this.game.effects;
    }
    // everything on the board, back to front (the Renderer has cleared the canvas and set the camera)
    draw(a, k, top, bot) {
      const game = this.game;
      this.board.drawBoard(top, bot);
      this.board.drawBucket();
      this.pegs.drawGravityFields(top, bot);
      this.pegs.drawPegs(k, top, bot);
      this.pegs.drawPlacement(this.view);
      this.pegs.drawLift(this.view);
      if (!game.editing) this.zones.drawZones(top, bot, this.view);
      this.balls.drawBalls(a, top, bot);
      this.r.drawEffects(game.effects, top, bot);
      if (!game.editing) this.board.drawLauncher(game.prevLaunchX + (game.launchX - game.prevLaunchX) * a, Math.min(game.worldH, bot));
    }
    // a peg picture for the edit palette
    pegIcon(type, canvas) {
      this.pegs.pegIcon(type, canvas);
    }
  };

  // src/save/SaveFormat.ts
  var SAVE_KEY = "neonpegs.save.v2";
  var SAVE_VERSION = 13;
  var SAVE_CODE = { research: "r", dual: "d", splitter: "s", gravity: "g", alchemy: "a", power: "p", antigravity: "n", bouncy: "o", wall: "w", blink: "k", limiter: "l", slider: "v", spinner: "t", orbit: "q", basic: "b" };
  var SAVE_TYPE = Object.fromEntries(Object.entries(SAVE_CODE).map(([type, code]) => [code, type]));
  var num = (v) => typeof v === "number" && Number.isFinite(v) ? v : void 0;
  function parseSave(text) {
    try {
      const d = JSON.parse(text);
      const ok = d && typeof d === "object" && Number.isFinite(d.v) && d.levels && typeof d.levels === "object" && Array.isArray(d.pegs);
      return ok ? d : null;
    } catch {
      return null;
    }
  }

  // src/save/Migrations.ts
  var RENAMED = {
    ball: "peg_value",
    bucket: "bucket_value",
    peg: "peg_slots",
    balls: "extra_ball",
    power: "peg_power",
    wide: "wide_bucket",
    research: "research_lab",
    rpeg_value: "research_pegs_value",
    combo: "combo_chain",
    bounce: "bouncy_balls",
    fat: "fat_balls",
    deeper: "deeper_world",
    dropper: "faster_dropper",
    bucketrow: "extra_buckets",
    goldvalue: "gold_ball_value",
    gooball: "more_gooballs",
    goolife: "lasting_goo",
    goopay: "rich_phlegm",
    capx: "higher_limit",
    rpeg: "research_pegs",
    depth: "world_size",
    cap: "upgrade_limit",
    auto: "auto_dropper",
    rcombo: "combo_theory",
    rgold: "alchemy",
    rbounce: "elastic_balls",
    rfat: "ball_inflation",
    splitpeg: "splitter_pegs",
    gravpeg: "gravity_pegs",
    goldball: "gold_balls",
    buckets: "more_buckets",
    goo: "phlegm_goo",
    goocap: "goo_tank",
    dual: "blast_pegs",
    burst: "ball_burst",
    evilhard: "sturdy_pegs",
    evilregen: "fast_healing",
    evilyield: "dark_harvest",
    relax: "balance_field",
    repulsion_field: "balance_field"
  };
  var isPreEditMode = (d) => (d.v | 0) < 3;
  function applyRenames(d) {
    for (const o of [d.levels, d.timers]) if (o) {
      for (const old in RENAMED) if (o[old] !== void 0 && o[RENAMED[old]] === void 0) o[RENAMED[old]] = o[old];
    }
  }
  function migrateEditMode(d, p) {
    const lv = d.levels || {};
    const owned = { basic: lv.peg_slots | 0, research: lv.research_pegs | 0, splitter: lv.splitter_pegs | 0, gravity: lv.gravity_pegs | 0 };
    const placed = { basic: 0, research: 0, splitter: 0, gravity: 0, alchemy: 0, dual: 0, power: 0, antigravity: 0, bouncy: 0, wall: 0, blink: 0, limiter: 0, slider: 0, spinner: 0, orbit: 0 };
    for (const pt of Array.isArray(d.pegs) ? d.pegs : []) if (Array.isArray(pt) && pt[2] !== "d") placed[SAVE_TYPE[pt[2]] || "basic"]++;
    let total = 0;
    for (const t of Object.keys(owned)) {
      total += Math.max(owned[t], placed[t]);
    }
    p.levels.peg_slots = Math.max(0, total - START_SLOTS);
    for (const id of ["research_pegs", "splitter_pegs", "gravity_pegs"]) p.levels[id] = Math.min(1, p.levels[id]);
  }
  function migrateLevels(d, p) {
    const v = d.v | 0;
    if (v < 4) {
      for (const u of UPGRADES) if (u.tab === "research") p.levels[u.id] = Math.min(1, p.levels[u.id]);
    }
    if (v < 5) {
      for (const [r, m] of [["combo_theory", "combo_chain"], ["elastic_balls", "bouncy_balls"], ["ball_inflation", "fat_balls"]]) if (p.levels[m] > 0) {
        p.levels[r] = 1;
        p.levels[m]--;
      }
    }
    if (v < 7) {
      for (const [r, m] of [["combo_theory", "combo_chain"], ["elastic_balls", "bouncy_balls"], ["ball_inflation", "fat_balls"], ["world_size", "deeper_world"], ["more_buckets", "extra_buckets"], ["upgrade_limit", "higher_limit"]]) if (p.levels[r] > 0) p.levels[m]++;
    }
    const ready = Array.isArray(d.dualReady) ? d.dualReady.filter((n) => n > 0).length : 0;
    if (v < 8 && (ready || (d.pegs || []).some((pt) => Array.isArray(pt) && pt[2] === "d"))) p.levels.blast_pegs = 1;
    if (v < 13) {
      if (p.levels.phlegm_goo > 0) for (const id of ["ghost_power", "downdraft_power", "dead_power", "research_ball_power", "chaos_power", "burst_power", "laser_power"]) p.levels[id] = 1;
      if (p.levels.evil > 0) for (const id of ["bomb_power", "balance_power", "electric_power"]) p.levels[id] = 1;
    }
    if (v < 12 && p.levels.blast_pegs > 0) p.levels.blast_research = 1;
    if (v < 11) {
      const was = Math.round(360 + 191 * p.levels.deeper_world ** 0.85);
      while (worldHeight(p.levels.deeper_world) < was) p.levels.deeper_world++;
    }
  }

  // src/save/SaveCodec.ts
  function encodeSave(g) {
    const p = g.progress;
    return {
      v: SAVE_VERSION,
      money: p.money,
      rp: p.rp,
      goo: p.goo,
      evil: p.evil,
      autoOn: g.autoOn,
      labT: g.labT,
      levels: p.levels,
      timers: g.temps.toSave(),
      // temporary goo upgrades: [time left running, cooldown left] (ms)
      // [x, y (where it was placed), type, hits left (blast), damage, paid { currency: amount }, ms down, loaded power (power pegs) or 0,
      //  slider [direction, reach] or 0]
      pegs: g.pegs.list.map((pg) => {
        const arm = pg.arm ?? (pg.type === "slider" && pg.dir !== void 0 && pg.reach !== void 0 ? [Math.round(pg.dir * 100) / 100, Math.round(pg.reach)] : 0);
        return [
          Math.round((pg.ax ?? pg.x) * 10) / 10,
          Math.round((pg.ay ?? pg.y) * 10) / 10,
          SAVE_CODE[pg.type] || "b",
          pg.left || 0,
          Math.round(pg.dmg * 100) / 100,
          pg.paid,
          Math.ceil(pg.downT),
          pg.socket || 0,
          arm
        ];
      })
    };
  }
  function decodeSave(d, p, temps) {
    const out = { pegs: [] };
    const pd = (v) => {
      const n = num(v);
      return n !== void 0 ? Math.min(0.99, Math.max(0, n)) : 0;
    };
    for (const k of ["money", "rp", "goo", "evil"]) {
      const n = num(d[k]);
      if (n !== void 0) p[k] = n;
    }
    if (typeof d.autoOn === "boolean") out.autoOn = d.autoOn;
    const labT = num(d.labT);
    if (labT !== void 0) out.labT = Math.min(Math.max(0, labT), LAB_FIRST);
    applyRenames(d);
    if (d.timers) temps.load(d.timers);
    if (d.levels) {
      for (const u of UPGRADES) if (Number.isFinite(d.levels[u.id])) p.levels[u.id] = d.levels[u.id] | 0;
    }
    const old = isPreEditMode(d);
    if (old) migrateEditMode(d, p);
    migrateLevels(d, p);
    p.goo = Math.min(p.goo, p.gooCap());
    const floor = worldHeight(p.L("deeper_world")), full = blastHits(p.L("blast_peg_hits"));
    for (const pt of Array.isArray(d.pegs) ? d.pegs : []) {
      if (!Array.isArray(pt) || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) continue;
      const type = pt[2] === "d" ? "dual" : SAVE_TYPE[pt[2]] || "basic";
      const downT = (d.v | 0) >= 10 ? Math.min(PEG_DOWN_MS, Math.max(0, num(pt[6]) ?? 0)) : 0;
      let left = type === "dual" ? Math.min(full, pt[3] | 0) : 0;
      if (type === "dual" && left <= 0 && !downT) left = full;
      const paid = old ? { ...PEG_KINDS[type].costs } : loadPaid(pt[5]);
      const socket = type === "power" && typeof pt[7] === "string" && POWER_BY_ID[pt[7]]?.zone ? pt[7] : "";
      const arm = type === "slider" ? loadArm(pt[8]) : void 0;
      out.pegs.push({ x: pt[0], y: Math.min(pt[1], floor), type, left, dmg: downT ? 1 : pd(pt[4]), paid, downT, socket, ...arm && { arm } });
    }
    return out;
  }
  function loadArm(v) {
    if (!Array.isArray(v)) return void 0;
    const d = num(v[0]), r = num(v[1]);
    return d !== void 0 && r !== void 0 ? [d, Math.min(ARM_MAX, Math.max(ARM_MIN, r))] : void 0;
  }
  function loadPaid(v) {
    const n = num(v);
    if (n !== void 0) return n > 0 ? { money: n } : {};
    const out = {};
    if (v && typeof v === "object") {
      const o = v;
      for (const c of Object.keys(CUR_FIELD)) {
        const a = num(o[c]);
        if (a !== void 0 && a > 0) out[c] = a;
      }
    }
    return out;
  }

  // src/save/SaveStore.ts
  var SaveStore = class {
    constructor(game) {
      __publicField(this, "game");
      __publicField(this, "resetting");
      this.game = game;
      this.resetting = false;
    }
    autosave() {
      setInterval(() => this.save(), 5e3);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.save();
      });
      window.addEventListener("pagehide", () => this.save());
    }
    reset() {
      this.resetting = true;
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch {
      }
      location.reload();
    }
    // the current progress as text (the same JSON that is kept in localStorage), for the settings screen's export
    exportText() {
      this.save();
      try {
        return localStorage.getItem(SAVE_KEY) || "";
      } catch {
        return "";
      }
    }
    // replaces the current progress with a save from text and reloads the page; false when the text is not a valid save
    import(text) {
      const d = parseSave(text);
      if (!d) return false;
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(d));
      } catch {
        return false;
      }
      this.resetting = true;
      location.reload();
      return true;
    }
    save() {
      if (this.resetting) return;
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(encodeSave(this.game)));
      } catch {
      }
    }
    load() {
      const g = this.game;
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const s2 = decodeSave(JSON.parse(raw), g.progress, g.temps);
        if (s2.autoOn !== void 0) g.autoOn = s2.autoOn;
        if (s2.labT !== void 0) g.labT = s2.labT;
        g.growWorld();
        for (const pg of s2.pegs) g.pegs.add(pg.x, pg.y, pg.type, pg.left, pg.dmg, pg.paid, { downT: pg.downT, socket: pg.socket, arm: pg.arm });
      } catch {
      }
    }
  };

  // src/ui/BoardControls.ts
  var LIFT_PX = 50;
  var BoardControls = class {
    constructor(game, ui, store) {
      __publicField(this, "game");
      __publicField(this, "ui");
      __publicField(this, "store");
      __publicField(this, "lift");
      this.game = game;
      this.ui = ui;
      this.store = store;
      this.lift = null;
    }
    // placing a power: pressing holds it (the board doesn't scroll); in edit mode a drag that starts on a peg moves it
    grab(w) {
      const game = this.game;
      if (game.zones.targeting) {
        game.zones.aim(w, this.onBoard(w));
        return "zone";
      }
      if (!game.editing) return null;
      const h = game.pegs.list.find((p) => p.type === "slider" && Math.hypot(w.x - sliderHandle(p).x, w.y - sliderHandle(p).y) < 12);
      if (h) return { handle: h };
      const peg = game.pegs.at(w.x, w.y);
      return peg && !isDown(peg) ? peg : null;
    }
    // a touch drag with the helper on: the peg sits above the finger, so the finger doesn't hide it
    dragTo(held, w, touch) {
      if (held === "zone") {
        this.game.zones.aim(w, this.onBoard(w));
        return;
      }
      if ("handle" in held) {
        this.game.edit.aimSlider(held.handle, w.x, w.y);
        return;
      }
      const up = touch && this.ui.prefs.liftDrag ? LIFT_PX / this.ui.camera.scale : 0;
      this.lift = up ? { peg: held, finger: w } : null;
      this.game.edit.dragPeg(held, w.x, w.y - up);
    }
    drop(held, w) {
      if (held === "zone") {
        this.game.zones.aim(w, this.onBoard(w));
        this.placeZone();
        return;
      }
      if ("handle" in held) {
        this.store.save();
        return;
      }
      this.lift = null;
      this.game.edit.dropPeg(held);
      this.store.save();
    }
    // inside the board and on the part of it that shows (not under the HUD or the button bar)
    onBoard(w) {
      const c = this.ui.camera, top = c.y + c.padTop / c.scale, bot = c.y + (c.viewH - c.padBot) / c.scale;
      return w.x >= 0 && w.x <= W && w.y >= Math.max(0, top) && w.y <= Math.min(this.game.worldH, bot);
    }
    placeZone() {
      const msg = this.game.zones.release();
      if (msg) this.ui.toast(msg, 2200);
      this.ui.refresh();
    }
    tap(w) {
      const game = this.game, ui = this.ui;
      if (game.zones.targeting) {
        game.zones.aim(w, this.onBoard(w));
        this.placeZone();
        return;
      }
      if (game.editing) {
        const peg = game.pegs.at(w.x, w.y);
        if (peg && isDown(peg)) ui.toast(`Broken peg: back in ${Math.ceil(peg.downT / 1e3)}s`);
        else if (peg) {
          const back = game.edit.pickUp(peg);
          ui.toast(back ? `Peg picked up: ${back} back` : "Peg picked up");
        } else {
          const why = game.edit.placePeg(ui.edit.selected, w.x, w.y);
          if (why) ui.toast(why, 2200);
        }
        ui.refresh();
        this.store.save();
        return;
      }
      ui.launch();
    }
  };

  // src/ui/UiHelpers.ts
  function byId(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`#${id} is missing from the page`);
    return el;
  }
  function child(root, selector) {
    const el = root.querySelector(selector);
    if (!el) throw new Error(`${selector} is missing`);
    return el;
  }
  var SCREENS = { shop: "overlay", research: "research", powers: "powers", settings: "settings", system: "system", layouts: "layouts" };
  var costCol = (costs) => RES_COL[Object.keys(costs)[0]] || RES_COL.money;
  var setText = (node, s2) => {
    if (node._t !== s2) {
      node._t = s2;
      node.textContent = s2;
    }
  };
  var setHtml = (node, s2) => {
    if (node._t !== s2) {
      node._t = s2;
      node.innerHTML = s2;
    }
  };
  var CUR_ICON = Object.fromEntries(CURRENCIES.map((c) => [c, currencySvg(c, cssInk)]));
  var iconHtml = (text) => text.replace(/\{(money|research|goo|evil)\}/g, (_, c) => `<span class="ic">${CUR_ICON[c]}</span>`);
  var priceHtml = (price) => entries(price).map(([cur, a]) => `<span class="pc">${CUR_ICON[cur]}${fmt(a)}</span>`).join("") || "FREE";

  // src/ui/EditPanel.ts
  var EditPanel = class {
    constructor(game, renderer) {
      __publicField(this, "game");
      __publicField(this, "selected");
      __publicField(this, "tipType");
      __publicField(this, "strip");
      __publicField(this, "tip");
      __publicField(this, "chips");
      this.game = game;
      this.selected = "basic";
      this.tipType = null;
      this.strip = byId("palStrip");
      this.tip = byId("palTip");
      this.chips = {};
      for (const type of PEG_TYPES) this.chips[type] = this.makeChip(type, renderer);
      this.strip.addEventListener("wheel", (e) => {
        const strip = this.strip;
        if (strip.scrollWidth <= strip.clientWidth) return;
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        strip.scrollLeft += e.deltaMode === 1 ? d * 16 : e.deltaMode === 2 ? d * strip.clientWidth : d;
        e.preventDefault();
      }, { passive: false });
    }
    makeChip(type, renderer) {
      const k = PEG_KINDS[type], el = document.createElement("button");
      el.type = "button";
      el.className = "chip";
      el.style.setProperty("--k", k.color);
      el.innerHTML = '<canvas width="76" height="76"></canvas><span class="pn"></span><span class="pp"></span>';
      renderer.pegIcon(type, child(el, "canvas"));
      child(el, ".pn").textContent = k.name;
      let pointer = "mouse";
      el.addEventListener("pointerdown", (e) => {
        pointer = e.pointerType;
      });
      el.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") this.showTip(type);
      });
      el.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") this.showTip(null);
      });
      el.addEventListener("click", () => {
        if (pointer === "mouse") this.selected = type;
        else if (this.selected === type && this.tipType === type) this.showTip(null);
        else {
          this.selected = type;
          this.showTip(type);
        }
        this.refresh();
      });
      this.strip.appendChild(el);
      return { el, price: child(el, ".pp") };
    }
    // a type shows up once it is unlocked
    visible(type) {
      return this.game.progress.unlocked(type);
    }
    priceHtml(type) {
      return priceHtml(PEG_KINDS[type].costs);
    }
    showTip(type) {
      this.tipType = type;
      this.tip.hidden = !type;
      if (!type) return;
      const k = PEG_KINDS[type];
      this.tip.style.setProperty("--k", k.color);
      this.tip.innerHTML = `<b>${k.name} peg</b> \xB7 ${this.priceHtml(type)}<br>${iconHtml(k.desc)}`;
    }
    refresh() {
      const game = this.game;
      if (!this.visible(this.selected)) this.selected = "basic";
      for (const type of PEG_TYPES) {
        const c = this.chips[type], show = this.visible(type);
        if (!c) continue;
        c.el.hidden = !show;
        if (!show) continue;
        setHtml(c.price, this.priceHtml(type));
        c.el.classList.toggle("sel", type === this.selected);
        c.el.classList.toggle("cant", !!game.edit.cantPlace(type));
      }
    }
  };

  // src/save/LayoutCodec.ts
  var PREFIX = "NPL1:";
  function packLayout(l) {
    return { n: l.name, p: l.pegs.map((pg) => [Math.round(pg.x * 10) / 10, Math.round(pg.y * 10) / 10, SAVE_CODE[pg.type], ...pg.arm ? [pg.arm] : []]) };
  }
  function unpackLayout(v) {
    if (!v || typeof v !== "object") return null;
    const o = v;
    if (typeof o.n !== "string" || !Array.isArray(o.p)) return null;
    const pegs = [];
    for (const pt of o.p) {
      if (!Array.isArray(pt)) continue;
      const x = num(pt[0]), y = num(pt[1]), type = SAVE_TYPE[pt[2]];
      const arm = type === "slider" ? loadArm(pt[3]) : void 0;
      if (x !== void 0 && y !== void 0 && type) pegs.push({ x, y, type, ...arm && { arm } });
    }
    return { name: o.n.slice(0, 40), pegs };
  }
  function layoutCode(l) {
    return PREFIX + btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(packLayout(l)))));
  }
  function readLayoutCode(text) {
    const t = text.trim();
    if (!t.startsWith(PREFIX)) return null;
    try {
      return unpackLayout(JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(t.slice(PREFIX.length)), (c) => c.charCodeAt(0)))));
    } catch {
      return null;
    }
  }

  // src/save/LayoutStore.ts
  var LAYOUTS_KEY = "neonpegs.layouts";
  function loadLayouts() {
    try {
      const v = JSON.parse(localStorage.getItem(LAYOUTS_KEY) || "[]");
      return Array.isArray(v) ? v.map(unpackLayout).filter((l) => !!l) : [];
    } catch {
      return [];
    }
  }
  function saveLayouts(list) {
    try {
      localStorage.setItem(LAYOUTS_KEY, JSON.stringify(list.map(packLayout)));
    } catch {
    }
  }

  // src/ui/Cards.ts
  function makeCard(u, color) {
    const el = document.createElement("div");
    el.className = "card";
    el.style.setProperty("--card", color);
    el.innerHTML = '<div class="info"><div class="name"><span class="n"></span><span class="lvl"></span></div><div class="desc"></div><div class="stat"></div></div><button class="buy" type="button"><span class="bl"></span><span class="bc"></span></button>';
    return {
      u,
      el,
      n: child(el, ".n"),
      lvl: child(el, ".lvl"),
      desc: child(el, ".desc"),
      stat: child(el, ".stat"),
      btn: child(el, ".buy"),
      bl: child(el, ".bl"),
      bc: child(el, ".bc")
    };
  }
  function showLocked(c, reason) {
    setText(c.n, "???");
    setText(c.lvl, "");
    setText(c.desc, reason);
    setText(c.stat, "");
    setText(c.bl, "LOCKED");
    setText(c.bc, "\u{1F512}");
    c.btn.classList.add("cant");
    c.btn.classList.remove("maxed");
  }
  function plainSection(list, name, color) {
    const el = document.createElement("div");
    el.className = "section";
    el.style.setProperty("--s", color);
    el.textContent = name;
    list.appendChild(el);
  }
  function plainRow(list, label, note, color) {
    const el = document.createElement("div");
    el.className = "mode";
    el.style.setProperty("--c", color);
    const l = document.createElement("span"), n = document.createElement("span");
    l.className = "label";
    l.textContent = label;
    n.className = "note";
    n.textContent = note;
    if (note) l.append(n);
    el.append(l);
    list.appendChild(el);
    return el;
  }
  function miniButtons(row, buttons, danger = false) {
    const acts = document.createElement("div");
    row.classList.add("act");
    acts.className = "minis";
    const out = buttons.map(([text, fn]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = danger ? "mini danger" : "mini";
      b.textContent = text;
      b.addEventListener("click", fn);
      acts.append(b);
      return b;
    });
    row.append(acts);
    return out;
  }
  function makeSwitch(label) {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "switch";
    sw.setAttribute("role", "switch");
    sw.setAttribute("aria-label", label);
    return sw;
  }
  function setSwitch(sw, on) {
    sw.classList.toggle("on", on);
    sw.setAttribute("aria-checked", String(on));
  }
  function sortCards(cards, list) {
    for (const c of [...cards.filter((c2) => c2.unlocked), ...cards.filter((c2) => !c2.unlocked)]) list.appendChild(c.el);
  }

  // src/ui/LayoutsView.ts
  var LayoutsView = class {
    // onLoaded: the board changed (a layout was loaded or the board cleared)
    constructor(game, onChange) {
      __publicField(this, "game");
      __publicField(this, "onChange");
      __publicField(this, "list");
      __publicField(this, "msg");
      __publicField(this, "layouts");
      __publicField(this, "msgT");
      this.game = game;
      this.onChange = onChange;
      this.list = byId("layList");
      this.msg = byId("layMsg");
      this.layouts = loadLayouts();
    }
    setMsg(text, err = false) {
      this.msg.innerHTML = iconHtml(text);
      this.msg.classList.toggle("err", err);
      clearTimeout(this.msgT);
      this.msgT = setTimeout(() => {
        this.msg.textContent = "";
      }, 5e3);
    }
    // rebuilt each time the screen opens and after every change
    render() {
      const edit = this.game.edit, col = COLORS.system.accent, list = this.list;
      list.innerHTML = "";
      plainSection(list, "This board", col);
      miniButtons(plainRow(list, `${this.game.pegs.list.length} pegs`, "", col), [["SAVE", () => this.saveBoard()], ["CLEAR", () => this.clear()]]);
      plainSection(list, "Saved", col);
      miniButtons(plainRow(list, "Import a layout code", "", col), [["PASTE", () => this.importCode()]]);
      this.layouts.forEach((l, i) => {
        const row = plainRow(list, l.name, "", col);
        row.classList.add("stack");
        const note = document.createElement("span");
        note.className = "note";
        note.innerHTML = `${l.pegs.length} pegs \xB7 ${priceHtml(edit.layoutCost(l.pegs))}`;
        row.querySelector(".label").append(note);
        const why = edit.cantLoad(l.pegs);
        if (why) {
          const w = document.createElement("span");
          w.className = "note why";
          w.innerHTML = iconHtml(why);
          row.querySelector(".label").append(w);
        }
        const [load] = miniButtons(row, [["LOAD", () => this.load(l)], ["RENAME", () => this.rename(i)], ["EXPORT", () => this.exportCode(l)], ["DELETE", () => this.remove(i)]]);
        load.classList.toggle("dim", !!why);
      });
    }
    store() {
      saveLayouts(this.layouts);
      this.render();
    }
    saveBoard() {
      const pegs = this.game.pegs.list.map((p) => ({ x: p.ax, y: p.ay, type: p.type, ...p.type === "slider" && { arm: [p.dir, p.reach] } }));
      if (!pegs.length) {
        this.setMsg("The board is empty", true);
        return;
      }
      const name = window.prompt("Layout name:", `Layout ${this.layouts.length + 1}`);
      if (name === null) return;
      this.layouts.push({ name: name.trim().slice(0, 40) || `Layout ${this.layouts.length + 1}`, pegs });
      this.store();
      this.setMsg("Layout saved");
    }
    load(l) {
      const why = this.game.edit.loadLayout(l.pegs);
      if (why) {
        this.setMsg(why, true);
        return;
      }
      this.onChange();
      this.setMsg(`Loaded ${l.name}`);
      this.render();
    }
    clear() {
      if (!this.game.pegs.list.length) return;
      if (!confirm("Pick up every peg on the board (each is refunded)?")) return;
      const why = this.game.edit.clearAll();
      if (why) {
        this.setMsg(why, true);
        return;
      }
      this.onChange();
      this.setMsg("Board cleared");
      this.render();
    }
    rename(i) {
      const name = window.prompt("New name:", this.layouts[i].name);
      if (!name?.trim()) return;
      this.layouts[i].name = name.trim().slice(0, 40);
      this.store();
    }
    remove(i) {
      if (!confirm(`Delete ${this.layouts[i].name}?`)) return;
      this.layouts.splice(i, 1);
      this.store();
    }
    exportCode(l) {
      const code = layoutCode(l), fallback = () => window.prompt("Copy this code (Ctrl+C):", code);
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(code).then(() => this.setMsg("Layout code copied"), fallback);
      else fallback();
    }
    importCode() {
      const code = window.prompt("Paste a layout code:");
      if (!code) return;
      const l = readLayoutCode(code);
      if (!l) {
        this.setMsg("That is not a layout code", true);
        return;
      }
      this.layouts.push(l);
      this.store();
      this.setMsg(`Imported ${l.name}`);
    }
  };

  // src/ui/Prefs.ts
  var PREFS_KEY = "neonpegs.prefs";
  function loadPrefs() {
    const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
    const prefs = { closeOnPower: true, autoFullscreen: false, liftDrag: touch };
    try {
      Object.assign(prefs, JSON.parse(localStorage.getItem(PREFS_KEY) || "null") || {});
    } catch {
    }
    return prefs;
  }
  function savePrefs(prefs) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
    }
  }

  // src/ui/PowersView.ts
  var PowersView = class {
    // onUsed: a power without a zone was used; onTarget: a zone power is ready to be placed
    constructor(game, onUsed, onTarget) {
      __publicField(this, "game");
      __publicField(this, "onUsed");
      __publicField(this, "onTarget");
      __publicField(this, "list");
      __publicField(this, "cards");
      __publicField(this, "order");
      this.game = game;
      this.onUsed = onUsed;
      this.onTarget = onTarget;
      this.list = byId("powList");
      this.cards = POWERS.map((pw) => this.makeCard(pw));
    }
    makeCard(pw) {
      const ref = makeCard(pw, costCol(pw.costs));
      ref.btn.addEventListener("click", () => this.use(pw));
      if (pw.danger) ref.btn.classList.add("danger");
      else ref.btn.style.setProperty("--act", pw.color);
      this.list.appendChild(ref.el);
      return ref;
    }
    use(pw) {
      if (pw.zone) {
        if (this.game.economy.ready(pw)) this.onTarget(pw);
        return;
      }
      if (this.game.economy.usePower(pw)) this.onUsed();
    }
    // updates every card
    refresh() {
      const game = this.game, p = game.progress;
      let order = "";
      for (const c of this.cards) {
        const pw = c.u, unlocked = p.isUnlocked(pw);
        c.unlocked = unlocked;
        order += unlocked ? 1 : 0;
        c.el.classList.toggle("locked", !unlocked);
        if (!unlocked) {
          showLocked(c, p.lockReason(pw));
          continue;
        }
        setText(c.n, pw.name);
        setHtml(c.desc, iconHtml(pw.desc));
        setHtml(c.stat, iconHtml(pw.stat()));
        const tm = game.economy.timer(pw.id), ok = !tm && p.has(pw.costs);
        setText(c.bl, "");
        if (tm) setText(c.bc, `${tm.s}s`);
        else setHtml(c.bc, priceHtml(pw.costs));
        c.btn.classList.toggle("active", !!tm?.active);
        c.btn.classList.toggle("cant", !ok && !tm?.active);
      }
      if (order !== this.order) {
        this.order = order;
        sortCards(this.cards, this.list);
      }
    }
  };

  // src/ui/SettingsView.ts
  var SettingsView = class {
    // onLayouts / onSystem: that row was tapped
    constructor(modes, onLayouts, onSystem) {
      __publicField(this, "rows");
      const list = byId("settingsList");
      this.rows = modes.map((mode) => {
        const el = this.row(list, mode.label);
        el.style.setProperty("--c", mode.color);
        const sw = makeSwitch(mode.label);
        el.append(sw);
        el.addEventListener("click", () => mode.toggle());
        return { mode, el, sw };
      });
      this.nav(list, "Layouts", onLayouts).classList.add("nav");
      this.nav(list, "System", onSystem);
    }
    // a row that opens another screen: its label and a chevron
    nav(list, text, open) {
      const el = this.row(list, text), chev = document.createElement("span");
      chev.className = "chev";
      chev.textContent = "\u203A";
      el.append(chev);
      el.addEventListener("click", open);
      return el;
    }
    // a row with its label, added to list
    row(list, text) {
      const el = document.createElement("div");
      el.className = "mode";
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = text;
      el.append(label);
      list.appendChild(el);
      return el;
    }
    refresh() {
      for (const r of this.rows) {
        const show = r.mode.available(), on = show && r.mode.on();
        r.el.hidden = !show;
        setSwitch(r.sw, on);
      }
    }
  };

  // src/ui/ShopView.ts
  var ShopView = class {
    // tab: whose upgrades ('money' or 'research'); listId: the list element; onBuy: u was bought (the whole UI refreshes)
    constructor(game, tab, listId, onBuy) {
      __publicField(this, "game");
      __publicField(this, "onBuy");
      __publicField(this, "list");
      __publicField(this, "cards");
      __publicField(this, "order");
      __publicField(this, "headers");
      this.game = game;
      this.onBuy = onBuy;
      this.list = byId(listId);
      this.headers = { locked: this.header(LOCKED_SECTION) };
      for (const s2 of SECTIONS) this.headers[s2.section] = this.header(s2);
      this.cards = UPGRADES.filter((u) => u.tab === tab).map((u) => this.makeCard(u));
    }
    makeCard(u) {
      const ref = makeCard(u, SECTION_COLOR[u.section]);
      let holdT, holdI, suppress = false;
      const clearHold = () => {
        clearTimeout(holdT);
        clearInterval(holdI);
        holdT = holdI = void 0;
      };
      ref.btn.addEventListener("pointerdown", () => {
        suppress = false;
        clearHold();
        holdT = setTimeout(() => {
          suppress = true;
          if (!this.buy(u)) return;
          holdI = setInterval(() => {
            if (!this.buy(u)) clearHold();
          }, 90);
        }, 450);
      });
      for (const ev of ["pointerup", "pointercancel", "pointerleave"]) ref.btn.addEventListener(ev, clearHold);
      ref.btn.addEventListener("click", () => {
        if (suppress) {
          suppress = false;
          return;
        }
        this.buy(u);
      });
      ref.btn.addEventListener("contextmenu", (e) => e.preventDefault());
      this.list.appendChild(ref.el);
      return ref;
    }
    // a section's title in the list: small centred text in its colour
    header({ name, color }) {
      const el = document.createElement("div");
      el.className = "section";
      el.style.setProperty("--s", color);
      el.textContent = name;
      return el;
    }
    // each section's available cards under its title (in section order), then every locked card under "Locked";
    // a title with no cards under it is hidden
    arrange() {
      const groups = SECTIONS.map((s2) => [this.headers[s2.section], this.cards.filter((c) => c.unlocked && c.u.section === s2.section)]);
      groups.push([this.headers.locked, this.cards.filter((c) => !c.unlocked)]);
      for (const [header, cards] of groups) {
        header.hidden = !cards.length;
        this.list.appendChild(header);
        for (const c of cards) this.list.appendChild(c.el);
      }
    }
    buy(u) {
      if (!this.game.economy.buy(u)) return false;
      this.onBuy(u);
      return true;
    }
    // the available cards that need upgrade `id`
    unlockedBy(id) {
      return this.cards.filter((c) => c.unlocked && c.u.required?.some((r) => r.id === id));
    }
    // scrolls the first card to the middle of the list and flashes them all (call once the list is arranged)
    highlight(cards) {
      const list = this.list, el = cards[0].el;
      const top = list.scrollTop + el.getBoundingClientRect().top - list.getBoundingClientRect().top - (list.clientHeight - el.offsetHeight) / 2;
      list.scrollTo({ top, behavior: "smooth" });
      for (const c of cards) {
        c.el.classList.remove("flash");
        void c.el.offsetWidth;
        c.el.classList.add("flash");
        c.el.addEventListener("animationend", () => c.el.classList.remove("flash"), { once: true });
      }
    }
    // updates every card
    refresh() {
      const p = this.game.progress;
      let order = "";
      for (const c of this.cards) {
        const u = c.u, unlocked = p.isUnlocked(u), maxed = p.isMaxed(u), l = p.L(u.id);
        c.unlocked = unlocked;
        order += unlocked ? 1 : 0;
        c.el.classList.toggle("locked", !unlocked);
        if (!unlocked) {
          showLocked(c, p.lockReason(u));
          continue;
        }
        const once = u.max === 1;
        setText(c.n, u.name);
        setText(c.lvl, once ? l ? "OWNED" : "" : maxed ? `Lv ${l} \xB7 MAX` : `Lv ${l}`);
        setHtml(c.desc, iconHtml(u.desc));
        setHtml(c.stat, iconHtml(once ? u.stat(1) : maxed ? u.stat(l) : `${u.stat(l)}  \u2192  ${u.stat(l + 1)}`));
        const afford = !maxed && p.canAfford(u);
        setText(c.bl, maxed ? once ? "OWNED" : "MAXED" : "");
        setHtml(c.bc, maxed ? "\u2713" : priceHtml(p.price(u)));
        c.btn.classList.toggle("cant", !afford && !maxed);
        c.btn.classList.toggle("maxed", maxed);
      }
      if (order !== this.order) {
        this.order = order;
        this.arrange();
      }
    }
  };

  // src/ui/Fullscreen.ts
  var Fullscreen = class {
    // taps on this do not count (the auto fullscreen switch itself)
    // auto: whether auto fullscreen is switched on
    constructor(auto) {
      __publicField(this, "supported");
      __publicField(this, "on");
      // cached, kept up to date by the browser's events: a tap reads no DOM
      __publicField(this, "pending");
      // a request is under way (no second one meanwhile)
      __publicField(this, "skip");
      const doc = document;
      this.supported = !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
      this.on = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
      this.pending = false;
      this.skip = null;
      const sync = () => {
        this.on = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
      };
      doc.addEventListener("fullscreenchange", sync);
      doc.addEventListener("webkitfullscreenchange", sync);
      if (this.supported) doc.addEventListener("pointerup", (e) => {
        if (!this.on && !this.pending && auto() && !this.skip?.contains(e.target)) this.enter();
      }, { capture: true, passive: true });
    }
    // asks for fullscreen (from a tap or click); a refusal is silent, the next tap simply tries again
    enter() {
      const el = document.documentElement, request = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!this.supported || this.on || !request) return;
      this.pending = true;
      const done = () => {
        this.pending = false;
      };
      const p = request.call(el);
      if (p?.then) p.then(done, done);
      else done();
    }
  };

  // src/ui/SystemView.ts
  var SystemView = class {
    constructor(store, prefs) {
      __publicField(this, "store");
      __publicField(this, "prefs");
      __publicField(this, "list");
      __publicField(this, "msg");
      __publicField(this, "fileInput");
      __publicField(this, "msgT");
      __publicField(this, "fullscreen");
      this.store = store;
      this.prefs = prefs;
      this.list = byId("sysList");
      this.msg = byId("sysMsg");
      const set = (k) => () => {
        prefs[k] = !prefs[k];
        savePrefs(prefs);
        return prefs[k];
      };
      this.section("Display");
      this.fullscreen = new Fullscreen(() => prefs.autoFullscreen);
      const fsOk = this.fullscreen.supported;
      const fs = this.switchRow("Auto fullscreen", fsOk ? "" : "Not allowed by this browser", fsOk && prefs.autoFullscreen, () => {
        const on = set("autoFullscreen")();
        if (on) this.fullscreen.enter();
        return on;
      });
      fs.disabled = !fsOk;
      this.fullscreen.skip = fs;
      this.section("Controls");
      this.switchRow("Lift dragged peg", "Touch: the peg sits above your finger", prefs.liftDrag, set("liftDrag"));
      this.switchRow("Close Powers after launch", "", prefs.closeOnPower, set("closeOnPower"));
      this.section("Save data");
      this.actionRow("Export", [["FILE", () => this.exportFile()], ["COPY", () => this.exportCopy()]]);
      this.actionRow("Import", [["FILE", () => this.fileInput.click()], ["PASTE", () => this.importPaste()]]);
      this.actionRow("Reset all progress", [["RESET", () => {
        if (confirm("Erase all progress and start over?")) store.reset();
      }]], true);
      this.fileInput = document.createElement("input");
      this.fileInput.type = "file";
      this.fileInput.accept = ".json,.txt,application/json,text/plain";
      this.fileInput.addEventListener("change", () => {
        const file = this.fileInput.files?.[0];
        this.fileInput.value = "";
        if (file) file.text().then((t) => this.importText(t), () => this.setMsg("Could not read that file", true));
      });
    }
    section(name) {
      plainSection(this.list, name, COLORS.system.accent);
    }
    // a switch row (the whole row switches); toggle returns the new state
    switchRow(label, note, on, toggle) {
      const el = plainRow(this.list, label, note, COLORS.system.accent), sw = makeSwitch(label);
      setSwitch(sw, on);
      el.append(sw);
      el.addEventListener("click", () => {
        if (!sw.disabled) setSwitch(sw, toggle());
      });
      return sw;
    }
    actionRow(label, buttons, danger = false) {
      miniButtons(plainRow(this.list, label, "", COLORS.system.accent), buttons, danger);
    }
    // feedback line at the top of the system screen (the hint under the board is hidden while a screen is open)
    setMsg(text, err = false) {
      const m = this.msg;
      m.textContent = text;
      m.classList.toggle("err", err);
      clearTimeout(this.msgT);
      this.msgT = setTimeout(() => {
        m.textContent = "";
      }, 5e3);
    }
    clearMsg() {
      this.msg.textContent = "";
    }
    exportFile() {
      const text = this.store.exportText();
      if (!text) {
        this.setMsg("Nothing to export", true);
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      a.download = `neonpegs-save-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1e4);
      this.setMsg("Save file downloaded");
    }
    exportCopy() {
      const text = this.store.exportText();
      if (!text) {
        this.setMsg("Nothing to export", true);
        return;
      }
      const fallback = () => window.prompt("Copy your save (Ctrl+C):", text);
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => this.setMsg("Save copied to the clipboard"), fallback);
      else fallback();
    }
    importPaste() {
      const go = (t) => t ? this.importText(t) : this.setMsg("Nothing to import", true);
      const ask = () => go(window.prompt("Paste your save here:"));
      if (navigator.clipboard?.readText) navigator.clipboard.readText().then(go, ask);
      else ask();
    }
    // checks the text, asks before replacing the progress, then the page reloads with the new save
    importText(text) {
      const t = String(text).trim();
      if (!parseSave(t)) {
        this.setMsg("That is not a valid Neon Pegs save", true);
        return;
      }
      if (!confirm("Replace your current progress with this save?")) return;
      if (!this.store.import(t)) this.setMsg("Could not store the save", true);
    }
  };

  // src/ui/Toast.ts
  var Toast = class {
    constructor() {
      __publicField(this, "text");
      __publicField(this, "until");
      this.text = "";
      this.until = 0;
    }
    show(text, ms = 1600) {
      this.text = text;
      this.until = performance.now() + ms;
    }
    // the message while it lasts, else null
    current() {
      return performance.now() < this.until ? this.text : null;
    }
  };

  // src/ui/Ui.ts
  var SCREEN_LIST = Object.keys(SCREENS);
  var Ui = class {
    constructor(game, camera, store, renderer) {
      __publicField(this, "game");
      __publicField(this, "camera");
      __publicField(this, "store");
      __publicField(this, "d");
      __publicField(this, "prefs");
      __publicField(this, "edit");
      __publicField(this, "shop");
      __publicField(this, "research");
      __publicField(this, "powers");
      __publicField(this, "settings");
      __publicField(this, "system");
      __publicField(this, "layouts");
      __publicField(this, "toaster");
      __publicField(this, "hudH");
      __publicField(this, "screen");
      __publicField(this, "padObserver");
      this.game = game;
      this.camera = camera;
      this.store = store;
      this.d = {};
      for (const id of [
        "app",
        "hud",
        "bar",
        "hint",
        "btns",
        "settingsBtn",
        "editBtn",
        "upBtn",
        "researchBtn",
        "powersBtn",
        "doneBtn",
        ...Object.values(SCREENS),
        "money",
        "rpBox",
        "rpNum",
        "gooBox",
        "gooNum",
        "evilBox",
        "evilNum",
        "stBalls",
        "stPegs"
      ]) this.d[id] = byId(id);
      for (const [box, c] of [["moneyBox", "money"], ["rpBox", "research"], ["gooBox", "goo"], ["evilBox", "evil"]]) byId(box).insertAdjacentHTML("afterbegin", CUR_ICON[c]);
      this.prefs = loadPrefs();
      this.edit = new EditPanel(game, renderer);
      this.shop = new ShopView(game, "money", "list", () => this.refresh());
      this.research = new ShopView(game, "research", "resList", (u) => this.researched(u));
      this.powers = new PowersView(
        game,
        () => {
          if (this.prefs.closeOnPower) this.showScreen(null);
          else this.refresh();
        },
        (pw) => {
          this.showScreen(null);
          game.zones.target(pw);
          this.refresh();
        }
      );
      this.settings = new SettingsView(this.modeList(), () => this.showScreen("layouts"), () => this.showScreen("system"));
      this.system = new SystemView(store, this.prefs);
      this.layouts = new LayoutsView(game, () => {
        this.refresh();
        store.save();
      });
      this.toaster = new Toast();
      this.hudH = -1;
      this.screen = null;
      const d = this.d;
      d.upBtn.addEventListener("click", () => this.toggleScreen("shop"));
      d.researchBtn.addEventListener("click", () => this.toggleScreen("research"));
      d.settingsBtn.addEventListener("click", () => this.showScreen(this.settingsOpen || this.systemOpen || this.screen === "layouts" ? null : "settings"));
      d.powersBtn.addEventListener("click", () => {
        if (game.zones.targeting) {
          game.zones.cancel();
          this.refresh();
        } else this.toggleScreen("powers");
      });
      d.editBtn.addEventListener("click", () => this.toggleEdit());
      d.doneBtn.addEventListener("click", () => this.toggleEdit());
      if (DEBUG) this.debugResources();
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (game.editing) this.toggleEdit();
          else if (game.zones.targeting) {
            game.zones.cancel();
            this.refresh();
          } else this.showScreen(null);
        } else if ((e.key === "e" || e.key === "E") && !e.repeat) this.setEvil(!game.evilOn);
        else if (e.code === "Space" && !e.repeat && !game.editing) {
          e.preventDefault();
          this.launch();
        }
      });
      this.padObserver = window.ResizeObserver ? new ResizeObserver(() => {
        this.measurePads();
        camera.clamp();
      }) : null;
      if (this.padObserver) {
        this.padObserver.observe(d.hud);
        this.padObserver.observe(d.bar);
      }
    }
    get shopOpen() {
      return this.screen === "shop";
    }
    get researchOpen() {
      return this.screen === "research";
    }
    get powersOpen() {
      return this.screen === "powers";
    }
    get settingsOpen() {
      return this.screen === "settings";
    }
    get systemOpen() {
      return this.screen === "system";
    }
    get panelOpen() {
      return !!this.screen && !this.settingsOpen;
    }
    // a screen covers the board (the settings panel only covers half of it)
    // the switches in the settings panel
    modeList() {
      const game = this.game;
      return [{
        label: "Auto launch balls",
        color: COLORS.ui.autoLaunch,
        available: () => game.L("auto_dropper") > 0,
        on: () => game.autoOn,
        toggle: () => {
          game.autoOn = !game.autoOn;
          this.refresh();
          this.store.save();
        }
      }, {
        label: "Evil damage (E)",
        color: COLORS.theme.evil,
        available: () => game.L("evil") > 0,
        on: () => game.evilOn,
        toggle: () => this.setEvil(!game.evilOn)
      }];
    }
    // ?debug: tapping a resource counter at the top gives 10% more of it (1 when there is none; goo stays within its tank)
    debugResources() {
      const p = this.game.progress;
      for (const [box, cur] of [["moneyBox", "money"], ["rpBox", "rp"], ["gooBox", "goo"], ["evilBox", "evil"]]) {
        const el = byId(box);
        el.style.pointerEvents = "auto";
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          p[cur] = p[cur] > 0 ? p[cur] * 1.1 : 1;
          if (cur === "goo") p.goo = Math.min(p.goo, p.gooCap());
          this.toast(`debug: ${cur} x1.1`, 800);
          this.refresh();
        });
      }
    }
    // one screen at a time over the board (null closes it); the screens stop above the button bar
    showScreen(name) {
      const d = this.d;
      if (name) this.game.zones.cancel();
      this.screen = name;
      for (const sc of SCREEN_LIST) {
        const el = d[SCREENS[sc]], on = sc === name;
        el.classList.toggle("open", on);
        el.setAttribute("aria-hidden", on ? "false" : "true");
      }
      d.app.classList.toggle("ov", !!name);
      if (name) d.app.style.setProperty("--barH", `${d.bar.offsetHeight}px`);
      if (name === "system") this.system.clearMsg();
      if (name === "layouts") this.layouts.render();
      this.refresh();
    }
    toggleScreen(name) {
      this.showScreen(this.screen === name ? null : name);
    }
    // after a research: jump to the shop upgrades it unlocked, if any
    researched(u) {
      this.refresh();
      const cards = this.shop.unlockedBy(u.id);
      if (!cards.length) return;
      this.showScreen("shop");
      this.shop.highlight(cards);
    }
    launch() {
      if (this.game.ballSystem.launch()) return;
      if (this.game.temps.running("laser")) return;
      this.toast(this.game.ballSystem.maxBalls() === 1 ? "A ball is already in play" : "All balls are in play");
    }
    toast(t, ms = 1600) {
      this.toaster.show(t, ms);
    }
    // edit mode on/off: the bottom bar swaps its buttons for the peg palette, and the game stands still meanwhile
    toggleEdit() {
      const game = this.game, d = this.d;
      if (game.editing) {
        this.showScreen(null);
        game.edit.exit();
        this.edit.showTip(null);
        d.app.classList.remove("edit");
        this.store.save();
      } else {
        this.showScreen(null);
        game.edit.enter();
        d.app.classList.add("edit");
      }
      this.refresh();
    }
    setEvil(on) {
      this.game.evilOn = !!on && this.game.L("evil") > 0;
      this.d.app.classList.toggle("evil", this.game.evilOn);
      this.refresh();
    }
    // how much of the screen the HUD and the button bar cover (the camera keeps the board between them)
    measurePads() {
      const d = this.d, h = d.hud.offsetHeight;
      if (h !== this.hudH) {
        this.hudH = h;
        d.app.style.setProperty("--hudH", `${h}px`);
      }
      this.camera.padTop = h - 6;
      if (!d.app.classList.contains("ov")) this.camera.padBot = d.bar.offsetHeight;
    }
    refresh() {
      const game = this.game, p = game.progress, pegs = game.pegs, d = this.d;
      game.uiDirty = false;
      setText(d.money, fmt(Math.floor(p.money)));
      const hasRp = p.L("research_lab") > 0, hasGoo = p.L("phlegm_goo") > 0, hasEvil = p.L("evil") > 0;
      d.rpBox.classList.toggle("on", hasRp);
      if (hasRp) setText(d.rpNum, fmt(Math.floor(p.rp * 10) / 10));
      d.gooBox.classList.toggle("on", hasGoo);
      if (hasGoo) setText(d.gooNum, fmt(Math.floor(p.goo)));
      if (!hasEvil && game.evilOn) this.setEvil(false);
      d.evilBox.classList.toggle("on", hasEvil);
      if (hasEvil) setText(d.evilNum, evFmt(Math.floor(p.evil * 100) / 100));
      this.settings.refresh();
      d.settingsBtn.classList.toggle("on", this.settingsOpen || this.systemOpen || this.screen === "layouts");
      d.powersBtn.classList.toggle("locked", !hasGoo);
      d.powersBtn.classList.toggle("on", this.powersOpen || !!game.zones.targeting);
      d.researchBtn.classList.toggle("locked", !hasRp);
      d.researchBtn.classList.toggle("on", this.researchOpen);
      setText(d.stBalls, `${fmt(game.ballSystem.load())}/${game.ballSystem.maxBalls()}`);
      setText(d.stPegs, `${pegs.used()}/${p.slots()}`);
      this.shop.refresh();
      this.research.refresh();
      this.powers.refresh();
      d.upBtn.classList.toggle("on", this.shopOpen);
      let h = "", pulse = false;
      const freeSlots = p.slots() - pegs.used(), canPay = p.has(PEG_KINDS.basic.costs);
      const toast = this.toaster.current();
      const aim = game.zones.targeting;
      if (toast !== null) h = toast;
      else if (aim) {
        h = game.zones.outside ? "Let go to cancel" : "Drag, let go to place \xB7 off the board cancels";
        pulse = true;
      } else if (game.editing) h = "Tap: place \xB7 tap a peg: remove \xB7 drag: move";
      else if (pegs.list.length === 0) {
        h = canPay ? "Tap \u270E to place your first peg" : "Tap to launch when the cannon is over the bucket";
        pulse = true;
      } else if (freeSlots > 0 && canPay) {
        h = `${freeSlots} free slot${freeSlots > 1 ? "s" : ""}: tap \u270E to place pegs`;
        pulse = true;
      }
      setHtml(d.hint, iconHtml(h));
      d.hint.classList.toggle("pulse", pulse);
      if (game.editing) this.edit.refresh();
    }
  };

  // src/App.ts
  var App = class {
    constructor() {
      __publicField(this, "game");
      __publicField(this, "camera");
      __publicField(this, "store");
      __publicField(this, "renderer");
      __publicField(this, "scene");
      __publicField(this, "ui");
      __publicField(this, "input");
      __publicField(this, "last");
      __publicField(this, "acc");
      __publicField(this, "uiT");
      __publicField(this, "skipRender");
      __publicField(this, "frameAvg");
      __publicField(this, "slowT");
      __publicField(this, "dbg");
      this.game = new Game();
      this.camera = new Camera(() => this.game.worldH);
      this.store = new SaveStore(this.game);
      this.renderer = new Renderer(byId("game"), this.camera, W);
      this.renderer.icons = currencyImages();
      this.scene = new GameRenderer(this.renderer, this.game);
      this.ui = new Ui(this.game, this.camera, this.store, this.scene);
      const controls = new BoardControls(this.game, this.ui, this.store);
      const input = this.input = new Input(this.renderer.canvas, this.camera, controls);
      const edit = this.ui.edit;
      this.scene.view = {
        get hover() {
          return input.hover;
        },
        get dragging() {
          return input.dragging;
        },
        get editType() {
          return edit.selected;
        },
        get lift() {
          return controls.lift;
        }
      };
      this.store.autosave();
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("orientationchange", () => setTimeout(() => this.resize(), 150));
      this.store.load();
      this.resize();
      this.camera.y = this.camera.range()[0];
      this.ui.refresh();
      this.last = performance.now();
      this.acc = 0;
      this.uiT = 0;
      this.skipRender = false;
      this.frameAvg = 16;
      this.slowT = 0;
      this.dbg = { frames: 0, phys: 0, draw: 0, t: 0, text: "" };
      this.frame = this.frame.bind(this);
    }
    resize() {
      this.renderer.resize();
      this.ui.measurePads();
      this.camera.clamp();
    }
    start() {
      requestAnimationFrame(this.frame);
    }
    // if frames stay slow (below ~50 fps) for 1.5 seconds, lower the canvas pixel ratio one tier
    governQuality(raw) {
      if (raw >= 250) return;
      this.frameAvg += (raw - this.frameAvg) * 0.05;
      this.slowT = this.frameAvg > 20 ? this.slowT + raw : 0;
      if (this.slowT > 1500 && this.renderer.lowerQuality()) {
        this.slowT = 0;
        this.frameAvg = 16;
        this.resize();
      }
    }
    frame(t) {
      const raw = t - this.last, dt = Math.min(100, raw);
      this.last = t;
      this.governQuality(raw);
      const t0 = DEBUG ? performance.now() : 0;
      if (this.game.editing) {
        this.acc = 0;
        this.game.effects.tick(dt);
      } else {
        this.acc += dt;
        let n = 0;
        while (this.acc >= STEP && n < MAX_STEPS) {
          this.game.step(STEP);
          this.acc -= STEP;
          n++;
        }
        if (n === MAX_STEPS) this.acc = Math.min(this.acc, STEP);
      }
      const t1 = DEBUG ? performance.now() : 0;
      if (!this.ui.padObserver) this.ui.measurePads();
      this.input.update(dt);
      this.camera.coast(dt, this.input.dragging);
      this.skipRender = this.ui.panelOpen && !this.skipRender;
      if (!this.skipRender) this.renderer.render(this.acc / STEP, this.scene);
      if (DEBUG) this.debug(raw, t1 - t0, performance.now() - t1);
      this.uiT += dt;
      if (this.uiT > 100 || this.game.uiDirty) {
        this.uiT = 0;
        this.ui.refresh();
      }
      requestAnimationFrame(this.frame);
    }
    debug(raw, phys, draw) {
      const d = this.dbg, g = this.game;
      d.frames++;
      d.phys += phys;
      d.draw += draw;
      d.t += raw;
      if (d.t >= 1e3) {
        d.text = `${Math.round(d.frames * 1e3 / d.t)} fps  phys ${(d.phys / d.frames).toFixed(1)}ms  draw ${(d.draw / d.frames).toFixed(1)}ms  dpr ${this.renderer.dpr}  pegs ${g.pegs.list.length}  balls ${g.balls.length}`;
        d.frames = d.phys = d.draw = d.t = 0;
      }
      this.renderer.drawDebug(d.text);
    }
  };

  // src/main.ts
  applyCssColors(document.documentElement);
  new App().start();
})();
/*! Bundled license information:

matter-js/build/matter.js:
  (*!
   * matter-js 0.19.0 by @liabru
   * http://brm.io/matter-js/
   * License MIT
   * 
   * The MIT License (MIT)
   * 
   * Copyright (c) Liam Brummitt and contributors.
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)
*/
//# sourceMappingURL=game.js.map
