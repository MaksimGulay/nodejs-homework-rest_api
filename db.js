require("dotenv").config();

const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

// async function run() {
//   try {
//     await mongoose.connect(DB_URI);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// run().catch(console.error);
