require("dotenv").config();

// DB
const { setupDB, savePoolUserBalanceObject, dropCollection, dropPoolUserBalanceCollection } = require("./src/db");

// Utils
const { getPoolUserBalancesForBlocks, createBlockIntervals } = require("./src/utils");

const seedDB = async () => {
  // connect to db
  await setupDB();

  try {
    await dropPoolUserBalanceCollection();
    console.log("Dropped collection...");
  } catch (err) {
    console.log("could not drop collection.");
  }

  console.log("Getting block")
  // Get the blocknum approximations for each date
  const blocks = await createBlockIntervals("days");
  console.log(blocks.length);

  // Get poolUserBalances for each block from API
  let poolUserBalances;
  try {
    poolUserBalances = await getPoolUserBalancesForBlocks(blocks);
  } catch (err) {
    console.log({ err });
  }

  console.log("Saving tvls to DB")
  // Save them to the DB
  if (tvls.length) {
    const savePromises = poolUserBalances.map((poolUserBalance) => savePoolUserBalanceObject(poolUserBalance));
    const savePoolUserBalancePromises = await Promise.allSettled(savePromises);
  }

  console.log("Seeded 💦")
};

seedDB();
