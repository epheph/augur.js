"use strict";

var async = require("async");
var adjustPositions = require("./adjust-positions");
var calculateShareTotals = require("./calculate-share-totals");
var findUniqueMarketIDs = require("./find-unique-market-ids");
var getLogs = require("../../logs/get-logs");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.account Ethereum account address, as a hexadecimal string.
 * @param {string} p.market Market instance contract address, as a hexadecimal string.
 * @param {string} p.marketCreationBlockNumber Block number in which this market was created, as a base-10 string.
 * @param {Object.<string[]>} p.onChainPositions On-chain (un-adjusted) positions as arrays of base-10 strings, keyed by market ID.
 * @param {function=} callback Callback function.
 * @return {Object.<string[]>} Adjusted positions as arrays of base-10 strings, keyed by market ID.
 */
function getAdjustedPositions(p, callback) {
  // TODO these log lookups add lots of overhead; instead of looking up here,
  //      should be chunked, pre-fetched, stored, then passed in from the UI.
  async.parallel({
    // CreateAskOrder events where the maker does not own shares of the outcome they're selling
    shortAskBuyCompleteSets: function (next) {
      getLogs({
        label: "CreateAskOrder",
        filter: {
          fromBlock: p.marketCreationBlockNumber,
          sender: p.account,
          market: p.market,
          isShort: true
        }
      }, next);
    },
    // FillBidOrder events where the taker does not own shares of the outcome they're selling
    shortSellBuyCompleteSets: function (next) {
      getLogs({
        label: "FillBidOrder",
        filter: {
          fromBlock: p.marketCreationBlockNumber,
          sender: p.account,
          market: p.market,
          isShort: true
        }
      }, next);
    },
    // All SellCompleteSets events for this account on this market
    sellCompleteSets: function (next) {
      getLogs({
        label: "SellCompleteSets",
        filter: {
          fromBlock: p.marketCreationBlockNumber,
          sender: p.account,
          market: p.market
        }
      }, next);
    }
  }, function (err, logs) {
    if (err) return callback(err);
    var shareTotals = calculateShareTotals(logs);
    var marketIDs = p.market ? [p.market] : findUniqueMarketIDs(shareTotals);
    callback(null, adjustPositions(p.account, marketIDs, shareTotals, p.onChainPositions));
  });
}

module.exports = getAdjustedPositions;
