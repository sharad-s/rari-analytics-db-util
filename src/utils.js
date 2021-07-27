// Web3
const EthDater = require("ethereum-block-by-date");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER));

// Utils
const axios = require("axios");

// Dater
const dater = new EthDater(
  web3 // Ethers provider, required.
);

// interface Block {
//   date: string;
//   block: number;
//   timestamp: number;
// }

// Promise<Block[]>
const createBlockIntervals = async (interval = "weeks") => {
  let blocks = await dater.getEvery(
    interval, // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
    "2021-03-24T12:00:00Z", // Start date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
    "2021-07-22T12:00:00Z" // End date,
  );
  return blocks;
};

// interface APIFuseTVL {
//   totalSuppliedUSD: number;
//   totalBorrowedUSD: number;
//   blockNumber: number;
//   blockTimestamp: string | number;
//   ethUSDPrice: number;
// }

// Promise<APIFuseTVL>
const fetchTVLDataFromAPI = async (blockNumber) =>
  await axios.get(
    `https://beta.rari.capital/api/fuse/tvl?blockNumber=${blockNumber}`
  );

const fetchPoolUserBalanceDataFromAPI = async (userAddress, blockNumber) =>
  await axios.get(
    `https://beta.rari.capital/api/accounts/fuse/balances?address=${userAddress}=${blockNumber}`
  );

const getTVLForBlocks = async (blocks) => {
  const tvlPromises = await Promise.allSettled(
    blocks
      .map(({ block }) => block)
      .map((blockNumber) => fetchTVLDataFromAPI(blockNumber))
  );

  const tvls = tvlPromises.map(({ status, value }) => {
    if (status === "fulfilled") return value.data;
  });

  return tvls;
};

const getPoolUserBalanceForBlocks = async (userAddress, blocks) => {
  const poolUserBalancePromises = await Promise.allSettled(
    blocks
      .map(({ block }) => block)
      .map((blockNumber) => fetchPoolUserBalanceDataFromAPI(userAddress, blockNumber))
  );

  const poolUserBalances = poolUserBalancePromises.map(({ status, value }) => {
    if (status === "fulfilled") return value.data;
  });

  return poolUserBalances;
};

const formatDDMMYYToTimestamp = (ddMMYY) => {
  const x = ddMMYY.split("-");
  return new Date([x[1], x[0], x[2]].join("/")).getTime() / 1000;
};

module.exports = {
  getTVLForBlocks,
  getPoolUserBalanceForBlocks,
  fetchTVLDataFromAPI,
  fetchPoolUserBalanceDataFromAPI,
  createBlockIntervals,
  formatDDMMYYToTimestamp,
};
