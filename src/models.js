const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// export interface PoolUserAssets {
//   cToken: string;
//   underlyingToken:string ;
//   underlyingName: string;
//   underlyingSymbol: string;
//   underlyingDecimals: string;
//   underlyingBalance: string;
//   supplyRatePerBlock: string;
//   borrowRatePerBlock: string;
//   totalSupply: string;
//   totalBorrow: string;
//   supplyBalance: string;
//   borrowBalance: string;
//   liquidity: string;
//   membership: boolean;
//   exchangeRate: string;
//   underlyingPrice: string;
//   oracle: string;
//   collateralFactor: string;
//   reserveFactor: string;
//   adminFee: string;
//   fuseFee: string;
//   supplyBalanceUSD: number;
//   borrowBalanceUSD: number;
//   totalSupplyUSD: number;
//   totalBorrowUSD: number;
//   liquidityUSD: number;
// }

// export interface PoolUserData {
//   assets: PoolUserAssets[];
//   comptroller: string;
//   name: string;
//   totalLiquidityUSD: number;
//   totalSuppliedUSD: number;
//   totalBorrowedUSD: number;
//   totalSupplyBalanceUSD: number;
//   totalBorrowBalanceUSD: number;
//   id: number;
// }

// export interface PoolUserTotals {
//   totalBorrowsUSD: number;
//   totalSuppliedUSD: number;
// }

// // The top level data representation of the query
// export interface PoolUser {
//   pools: PoolUserData[];
//   userAddress: string;
//   totals: PoolUserTotals;
// }

const TVLSchema = new Schema({
  totalSuppliedUSD: Number,
  totalBorrowedUSD: Number,
  ethUSDPrice: Number,
  blockNumber: Number,
  blockDate: String,
  blockTimestamp: String,
});


const PoolUserBalanceSchema = new Schema({
  pools: Array, // This is an array of arrays
  userAddress: String,
  totals: Array,
});

const TVLModel = mongoose.model("TVL", TVLSchema);
const PoolUserBalanceModel = mongoose.model("PoolUserBalance", PoolUserBalanceSchema);

module.exports = { TVLModel, PoolUserBalanceModel };
