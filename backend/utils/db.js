import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect('mongodb://localhost:27017/daily-nutri');
    console.log('MongoDB connected successfully:', connection.connection.host);
  } catch (err) {
    console.error('Error connecting to mongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
