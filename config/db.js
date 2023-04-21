const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
