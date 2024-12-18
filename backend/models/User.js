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
  age: { type: Number, min: 0, required: true },
  gender: { type: String, enum: ['male', 'female'], default: 'not specified' },
  preferences: {
    vegetarian: { type: Boolean, default: false },
    allergies: { type: [String], default: [] },
  },
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Users', userSchema);
