require("dotenv").config();

// DB
const {
  setupDB,
  getTVLObjectsByDateRange,
  getAllTVLObjects
} = require("./src/db");

const main = async () => {
  // connect to db
  await setupDB();

  // Get tvls in a date range
  const stuff = await getTVLObjectsByDateRange("03-04-2021", "21-04-2021");
  console.log({ stuff });

  // Get all tvls
  // const tvls = await getAllTVLObjects();
  // console.log(tvls.length);

};


main();


