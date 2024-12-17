import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: { type: String, required: true },
  age: { type: Number, min: 0 },
  gender: { type: String },
  preferences: {
    vegetarian: { type: Boolean, default: false },
    allergies: { type: [String], default: [] },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Users', userSchema);
