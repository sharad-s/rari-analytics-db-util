require("dotenv").config();

// DB
const { setupDB, saveTVLObject, dropCollection } = require("./src/db");

// Utils
const { getTVLForBlocks, createBlockIntervals } = require("./src/utils");

const seedDB = async () => {
  // connect to db
  await setupDB();

  try {
    await dropCollection();
    console.log("Dropped collection...");
  } catch (err) {
    console.log("could not drop collection.");
  }

  console.log("Getting block")
  // Get the blocknum approximations for each date
  const blocks = await createBlockIntervals("days");
  console.log(blocks.length);

  // Get TVLS for each block from API
  let tvls;
  try {
    tvls = await getTVLForBlocks(blocks);
  } catch (err) {
    console.log({ err });
  }

  console.log("Saving tvls to DB")
  // Save them to the DB
  if (tvls.length) {
    const savePromises = tvls.map((tvl) => saveTVLObject(tvl));
    const saveTVLPromises = await Promise.allSettled(savePromises);
  }

  console.log("Seeded 💦")
};

seedDB();
