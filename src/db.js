const mongoose = require("mongoose");
const { TVLModel, PoolUserBalanceModel } = require("./models");
const { formatDDMMYYToTimestamp } = require("./utils");

// Init
const setupDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Connected to db...");
};

const dropCollection = async () => await TVLModel.collection.drop();
const dropPoolUserBalanceCollection = async () => await PoolUserBalanceModel.collection.drop();

// Saves TVL obj to db
const saveTVLObject = async ({
  totalSuppliedUSD,
  totalBorrowedUSD,
  ethUSDPrice,
  blockNumber,
  blockDate,
  blockTimestamp,
}) => {
  const instance = new TVLModel();
  instance.totalSuppliedUSD = totalSuppliedUSD;
  instance.totalBorrowedUSD = totalBorrowedUSD;
  instance.ethUSDPrice = ethUSDPrice;
  instance.blockNumber = blockNumber;
  instance.blockDate = blockDate;
  instance.blockTimestamp = blockTimestamp;

  const existingDocument = await getTVLObjectByBlockDate(blockDate);

  if (existingDocument) {
    console.log(`Document exists for blockDate ${blockDate}... skip save`);
  } else {
    const saveResult = await instance.save();
    console.log({ saveResult });
    console.log(`Saved instance for blockNumber ${blockNumber}`);
  }
};

// Saves TVL obj to db
const savePoolUserBalanceObject = async ({
  pools, // This is an array of arrays
  userAddress,
  totals
}) => {
  const instance = new PoolUserBalanceModel();
  instance.pools = pools;
  instance.userAddress = userAddress;
  instance.totals = totals;

  const existingDocument = await getTVLObjectByBlockDate(blockDate);

  if (existingDocument) {
    console.log(`Document exists for blockDate ${blockDate}... skip save`);
  } else {
    const saveResult = await instance.save();
    console.log({ saveResult });
    console.log(`Saved instance for blockNumber ${blockNumber}`);
  }
};

// Getters
const getTVLObjectByBlockNumber = async (blockNumber) =>
  await TVLModel.findOne({ blockNumber }).exec();

const getTVLObjectByBlockDate = async (blockDate) =>
  await TVLModel.findOne({ blockDate }).exec();

const getAllTVLObjects = async () => {
  const tvls = await TVLModel.find({});
  return tvls;
};

const getPoolUserBalanceObjectByBlockNumber = async (blockNumber) => 
  await PoolUserBalanceModel.findOn({ blockNumber }).exec();

const getPoolUserBalanceObjectByBlockDate = async (blockDate) => 
  await PoolUserBalanceModel.findOn({ bockDate }).exec();

const getAllPoolUserBalanceObjects = async () => {
  const poolUserBalances = await PoolUserBalanceModel.find({});
  return poolUserBalances;
};

// Dates are in DD-MM-YYY
const getTVLObjectsByDateRange = async (startDate, endDate) => {
  const start = formatDDMMYYToTimestamp(startDate);
  const end = formatDDMMYYToTimestamp(endDate);

  return await TVLModel.find({
    blockTimestamp: { $gte: start, $lte: end },
  })
    .sort({ blockDate: 1 })
    .exec();
};

// Fetch by blockrange
const getTVLObjectsByBlockRange = async (startBlock, endBlock) =>
  await TVLModel.find({
    blockNumber: { $gte: startBlock, $lte: endBlock },
  })
    .sort({ blockNumber: -1 })
    .exec();

const getPoolUserBalanceObjectsByDateRange = async (startDate, endDate) => {
  const start = formatDDMMYYToTimestamp(startDate);
  const end = formatDDMMYYToTimestamp(endDate);

  return await PoolUserBalanceModel.find({
    blockTimestamp: { $gte: start, $lte: end },
  })
    .sort({ blockDate: 1 })
    .exec();
};

const getPoolUserBalanceObjectsByBlockRange = async (startBlock, endBlock) =>
  await PoolUserBalanceModel.find({
    blockNumber: { $gte: startBlock, $lte: endBlock },
  })
    .sort({ blockNumber: -1 })
    .exec();

module.exports = {
  setupDB,
  dropCollection,
  dropPoolUserBalanceCollection,
  saveTVLObject,
  savePoolUserBalanceObject,
  getAllTVLObjects,
  getAllPoolUserBalanceObjects,
  getTVLObjectByBlockNumber,
  getTVLObjectsByDateRange,
  getTVLObjectsByBlockRange,
  getPoolUserBalanceObjectByBlockNumber,
  getPoolUserBalanceObjectsByDateRange,
  getPoolUserBalanceObjectsByBlockRange,
};
