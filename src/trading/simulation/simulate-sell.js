"use strict";

var simulateCreateAskOrder = require("./simulate-create-ask-order");
var simulateFillBidOrder = require("./simulate-fill-bid-order");
var sumSimulatedResults = require("./sum-simulated-results");
var filterByPriceAndOutcomeAndUserSortByPrice = require("../order-book/filter-by-price-and-outcome-and-user-sort-by-price");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateSell(outcome, sharesToCover, shareBalances, tokenBalance, userAddress, minPrice, maxPrice, price, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, buyOrderBook) {
  var simulatedSell = {
    settlementFees: ZERO,
    worstCaseFees: ZERO,
    gasFees: ZERO,
    sharesDepleted: ZERO,
    otherSharesDepleted: ZERO,
    tokensDepleted: ZERO,
    shareBalances: shareBalances
  };
  var matchingSortedBids = filterByPriceAndOutcomeAndUserSortByPrice(buyOrderBook, 1, price, userAddress);

  // if no matching bids, then user is asking: no settlement fees
  if (!matchingSortedBids.length) {
    simulatedSell = sumSimulatedResults(simulatedSell, simulateCreateAskOrder(sharesToCover, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, shareBalances));

  // if there are matching bids, user is selling
  } else {
    var simulatedFillBidOrder = simulateFillBidOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedBids, outcome, shareBalances);
    simulatedSell = sumSimulatedResults(simulatedSell, simulatedFillBidOrder);
    if (simulatedFillBidOrder.sharesToCover.gt(PRECISION.zero)) {
      simulatedSell = sumSimulatedResults(simulatedSell, simulateCreateAskOrder(simulatedFillBidOrder.sharesToCover, price, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, outcome, shareBalances));
    }
  }

  return simulatedSell;
}

module.exports = simulateSell;
