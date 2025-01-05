import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully:', connection.connection.host);
  } catch (err) {
    console.error('Error connecting to mongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
