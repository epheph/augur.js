/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var fix = require("./utils").fix;

describe("trading/positions/calculate-short-sell-share-totals", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/calculate-short-sell-share-totals")(t.logs));
    });
  };
  test({
    description: "logs undefined",
    logs: undefined,
    assertions: function (output) {
      assert.deepEqual(output, {});
    }
  });
  test({
    description: "no logs",
    logs: [],
    assertions: function (output) {
      assert.deepEqual(output, {});
    }
  });
  test({
    description: "1 log, 1 market: 1 outcome 1",
    logs: [{
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("1").replace("0x", "")+
            "0000000000000000000000000000000100000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
      });
    }
  });
  test({
    description: "2 logs, 1 market: [0.1 outcome 1, 0.2 outcome 1]",
    logs: [{
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("0.1").replace("0x", "")+
            "0000000000000000000000000000000100000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }, {
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("0.2").replace("0x", "")+
            "0000000000000000000000000000000200000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.3", 10)
      });
    }
  });
  test({
    description: "2 logs, 2 markets: [123.456789 outcome 1 market 1, 987654.321 outcome 3 market 2]",
    logs: [{
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("123.456789").replace("0x", "")+
            "0000000000000000000000000000000100000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }, {
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("987654.321").replace("0x", "")+
            "0000000000000000000000000000000200000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x8000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("123.456789", 10),
        "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("987654.321", 10)
      });
    }
  });
  test({
    description: "4 logs, 2 markets: [50 outcome 1 market 1, 10 outcome 1 market 1, 3.1415 outcome 2 market 1, 123.456789 outcome 1 market 2]",
    logs: [{
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("50").replace("0x", "")+
            "0000000000000000000000000000000100000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }, {
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("10").replace("0x", "")+
            "0000000000000000000000000000000200000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }, {
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("3.1415").replace("0x", "")+
            "0000000000000000000000000000000200000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000002", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }, {
      data: "0x"+
            "1000000000000000000000000000000000000000000000000000000000000000"+
            fix("123.456789").replace("0x", "")+
            "0000000000000000000000000000000200000000000000000000000000000000"+
            "0000000000000000000000000000000000000000000000000000000000000001", // outcome
      topics: [
        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
        "0x8000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
      ]
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("60", 10),
        "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("123.456789", 10)
      });
    }
  });
});
