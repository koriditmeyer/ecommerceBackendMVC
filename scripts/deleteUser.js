import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../src/config/config.js";

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CNX_STR);

    // Specify the schema and model for the 'users' collection
    const userSchema = new mongoose.Schema({
      // Define your user schema fields here
    });
    const User = mongoose.model("User", userSchema);

    // Use the aggregation pipeline to count the number of users
    let user = await User.aggregate([
      {
        $count: "total_users",
      },
    ]);

    console.log(`Total number of users: ${user[0].total_users}`);

    // Use the aggregation pipeline to count the number of not verified users
    user = await User.aggregate([
      {
        $match: {
          $or: [{ verified: false }, { verified: { $exists: false } }],
        },
      },
      {
        $count: "total_users",
      },
    ]);

    console.log(`Total number of users not verified: ${user[0].total_users}`);

    // Perform the database query
    const result = await User.deleteMany({
      $or: [{ verified: false }, { verified: { $exists: false } }],
    });

    console.log(`Total number of users not deleted: ${result.deletedCount }`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
})();

//  node --env-file=prod.env scripts/deleteuser.js
