const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TVLSchema = new Schema({
  totalSuppliedUSD: Number,
  totalBorrowedUSD: Number,
  ethUSDPrice: Number,
  blockNumber: Number,
  blockDate: String,
  blockTimestamp: String,
});

const TVLModel = mongoose.model("TVL", TVLSchema);

module.exports = { TVLModel };
