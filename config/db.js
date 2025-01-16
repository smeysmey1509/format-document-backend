// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://dbFormat:123@cluster0.6okor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
