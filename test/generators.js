/* jshint node:true */
/* global describe, it */
"use strict";

var jsc = require("../lib/jsverify.js");
var _ = require("underscore");

describe("primitive generators", function () {
  describe("integer", function () {
    it("generates integers", function () {
      jsc.assert(jsc.forall(jsc.integer(), function (i) {
        return Math.round(i) === i;
      }));
    });
  });

  describe("nat", function () {
    it("generates non-negative integers", function () {
      jsc.assert(jsc.forall(jsc.nat(), function (n) {
        return Math.round(n) === n && n >= 0;
      }));
    });
  });

  describe("number", function () {
    it("generates numbers", function () {
      jsc.assert(jsc.forall(jsc.number(), function (x) {
        return typeof x === "number";
      }));
    });

    it("doesn't generate Infinity", function () {
      jsc.assert(jsc.forall(jsc.number(), function (x) {
        return x !== Infinity;
      }));
    });

    it("doesn't generate NaN", function () {
      jsc.assert(jsc.forall(jsc.number(), function (x) {
        return !isNaN(x);
      }));
    });
  });

  describe("bool", function () {
    it("generates either true or false", function () {
      jsc.assert(jsc.forall(jsc.bool(), function (b) {
        return b === true || b === false;
      }));
    });
  });

  describe("string", function () {
    it("generates string", function () {
      jsc.assert(jsc.forall(jsc.string(), function (x) {
        return typeof x === "string";
      }));
    });
  });

  describe("array", function () {
    it("generates array", function () {
      jsc.assert(jsc.forall(jsc.array(), function (arr) {
        return _.isArray(arr);
      }));
    });
  });

  describe("nonshrink array", function () {
    it("generates array", function () {
      jsc.assert(jsc.forall(jsc.nonshrink(jsc.array()), function (arr) {
        return _.isArray(arr);
      }));
    });
  });

  describe("value", function () {
    it("generates json stringify parse invariant", function () {
      jsc.assert(jsc.forall(jsc.value(), function (x) {
        return _.isEqual(x, JSON.parse(JSON.stringify(x)));
      }));
    });
  });

  describe("fun", function () {
    it("generates functions", function () {
      jsc.assert(jsc.forall(jsc.fn(), function (f) {
        return typeof f === "function";
      }));
    });

    it("generates well-behaved functions", function () {
      jsc.assert(jsc.forall(jsc.fn(), jsc.value(), function (f, x) {
        return f(x) === f(x);
      }));

      jsc.assert(jsc.forall(jsc.fn(), function (f) {
        for (var i = 0; i < 10; i++) {
          if (f(i) !== f(i)) {
            return false;
          }
        }

        return true;
      }));
    });
  });

  describe("oneof", function () {
    it("picks one from argument array", function () {
      var nonemptyarray = jsc.suchthat(jsc.array(), function (l) {
        return l.length !== 0;
      });

      jsc.assert(jsc.forall(nonemptyarray, function (arr) {
        return jsc.forall(jsc.oneof(arr), function (e) {
          return _.contains(arr, e);
        });
      }));
    });
  });
});
