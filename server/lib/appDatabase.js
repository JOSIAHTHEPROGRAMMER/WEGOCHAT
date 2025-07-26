import mongoose from "mongoose";

// Connect to MongoDB using Mongoose
export const connectToDatabase = async () => {
  try {     
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}