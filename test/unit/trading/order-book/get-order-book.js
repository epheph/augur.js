/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache().noCallThru();

describe("trading/order-book/get-order-book", function () {
  var test = function (t) {
    it(t.description, function () {
      var getOrderBook = proxyquire("../../../../src/trading/order-book/get-order-book", {
        "../../api": function () {
          return {
            OrderBook: {
              getOrderBook: t.stub.api.OrderBook.getOrderBook
            }
          };
        }
      });
      getOrderBook(t.params, t.assertions);
    });
  };
  test({
    description: "two orders",
    params: {
      _type: 2,
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      _startingOrderId: "0xa",
      _numOrdersToLoad: 10,
      minPrice: "0",
      maxPrice: "1"
    },
    stub: {
      api: {
        OrderBook: {
          getOrderBook: function (p, callback) {
            assert.deepEqual(p, {
              _type: 2,
              _market: "MARKET_ID",
              _outcome: "OUTCOME_ID",
              _startingOrderId: "0xa",
              _numOrdersToLoad: 10
            });
            callback(null, [
              "0x1",                       // orderId
              speedomatic.fix("1.1111111", "hex"), // amount
              speedomatic.fix("0.7777777", "hex"), // price
              "0xb0b",                     // owner
              speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
              speedomatic.fix("0", "hex"),         // sharesEscrowed
              "0xa",                       // betterOrderId
              "0xb",                       // worseOrderId
              "0x4a817c800",               // gasPrice

              "0xf",                       // orderId
              speedomatic.fix("1.1111111", "hex"), // amount
              speedomatic.fix("0.7777777", "hex"), // price
              "0xb0b",                     // owner
              speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
              speedomatic.fix("0", "hex"),         // sharesEscrowed
              "0xa",                       // betterOrderId
              "0xb",                       // worseOrderId
              "0x4a817c801"                // gasPrice
            ]);
          }
        }
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          amount: "1.1111",
          fullPrecisionAmount: "1.1111111",
          price: "0.7778",
          fullPrecisionPrice: "0.7777777",
          owner: "0x0000000000000000000000000000000000000b0b",
          tokensEscrowed: "0.8641974",
          sharesEscrowed: "0",
          betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
          worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
          gasPrice: "20000000000"
        },
        "0xf": {
          amount: "1.1111",
          fullPrecisionAmount: "1.1111111",
          price: "0.7778",
          fullPrecisionPrice: "0.7777777",
          owner: "0x0000000000000000000000000000000000000b0b",
          tokensEscrowed: "0.8641974",
          sharesEscrowed: "0",
          betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
          worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
          gasPrice: "20000000001"
        }
      });
    }
  });
  test({
    description: "one live order, one filled order",
    params: {
      _type: 2,
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      _startingOrderId: "0xa",
      _numOrdersToLoad: 10,
      minPrice: "0",
      maxPrice: "1"
    },
    stub: {
      api: {
        OrderBook: {
          getOrderBook: function (p, callback) {
            assert.deepEqual(p, {
              _type: 2,
              _market: "MARKET_ID",
              _outcome: "OUTCOME_ID",
              _startingOrderId: "0xa",
              _numOrdersToLoad: 10
            });
            callback(null, [
              "0x1",                       // orderId
              speedomatic.fix("1.1111111", "hex"), // amount
              speedomatic.fix("0.7777777", "hex"), // price
              "0xb0b",                     // owner
              speedomatic.fix("0.8641974", "hex"), // tokensEscrowed
              speedomatic.fix("0", "hex"),         // sharesEscrowed
              "0xa",                       // betterOrderId
              "0xb",                       // worseOrderId
              "0x4a817c800",               // gasPrice

              "0x0",                       // orderId
              "0x0",                       // amount
              "0x0",                       // price
              "0x0",                       // owner
              "0x0",                       // tokensEscrowed
              "0x0",                       // sharesEscrowed
              "0x0",                       // betterOrderId
              "0x0",                       // worseOrderId
              "0x0"                        // gasPrice
            ]);
          }
        }
      }
    },
    assertions: function (err, output) {
      assert.isNull(err);
      assert.deepEqual(output, {
        "0x1": {
          amount: "1.1111",
          fullPrecisionAmount: "1.1111111",
          price: "0.7778",
          fullPrecisionPrice: "0.7777777",
          owner: "0x0000000000000000000000000000000000000b0b",
          tokensEscrowed: "0.8641974",
          sharesEscrowed: "0",
          betterOrderId: "0x000000000000000000000000000000000000000000000000000000000000000a",
          worseOrderId: "0x000000000000000000000000000000000000000000000000000000000000000b",
          gasPrice: "20000000000"
        }
      });
    }
  });
  test({
    description: "missing minPrice and maxPrice values",
    params: {
      _type: 2,
      _market: "MARKET_ID",
      _outcome: "OUTCOME_ID",
      _startingOrderId: "0xa",
      _numOrdersToLoad: 10,
      minPrice: undefined,
      maxPrice: undefined
    },
    stub: {
      api: {
        OrderBook: {
          getOrderBook: function () {
            assert.fail();
          }
        }
      }
    },
    assertions: function (err, output) {
      assert.strictEqual(err, "Must specify minPrice and maxPrice");
      assert.isUndefined(output);
    }
  });
});
