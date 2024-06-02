import mongoose from "mongoose";

// connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB Successfully");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
