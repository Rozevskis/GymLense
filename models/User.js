import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // NextAuth required fields
  name: String,
  email: {
    type: String,
    unique: true,
  },
  emailVerified: Date,
  image: String,
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],

  // Custom fields
  weight: {
    type: Number,
    min: 20,
    max: 300,
  },
  height: {
    type: Number,
    min: 100,
    max: 250,
  },
  age: {
    type: Number,
    min: 13,
    max: 120,
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
