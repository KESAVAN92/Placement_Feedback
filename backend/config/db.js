const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(
      "MongoDB connection failed: MONGO_URI is not set. Set the MONGO_URI environment variable to a valid MongoDB connection string."
    );
    process.exit(1);
  }

  if (
    mongoUri.includes("<username>") ||
    mongoUri.includes("<password>") ||
    mongoUri.includes("cluster.mongodb.net")
  ) {
    console.error(
      "MongoDB connection failed: MONGO_URI appears to be a placeholder. " +
        "Update it with your Atlas cluster name, username, and password. " +
        "Example: mongodb+srv://<username>:<password>@<clusterName>.mongodb.net/<dbname>?retryWrites=true&w=majority"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
