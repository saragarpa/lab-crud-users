const mongoose = require("mongoose");

// Connection to DataBse
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.info(`Successfully connected to the database`))
  .catch((error) => {
    console.error(`An error occurred trying to connect to the database`, error);

    process.exit(0);
  });

//'SIGINT', interruption sign
process.on("SIGINT", () => {
  mongoose.connection.close().finally(() => {
    console.log(`Database connection closed`);

    process.exit(0);
  });
});
