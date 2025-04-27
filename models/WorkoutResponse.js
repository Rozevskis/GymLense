import mongoose from 'mongoose';

const WorkoutResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  response: { type: Object, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WorkoutResponse', WorkoutResponseSchema);
