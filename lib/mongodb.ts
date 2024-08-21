import mongoose from "mongoose";

const { MONGODB_USER_URI } = process.env;

export const connectUserDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_USER_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
