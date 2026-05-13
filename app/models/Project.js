import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [String],
  status: { type: String, enum: ['live', 'coming-soon', 'maintenance' , 'in-progress' , 'completed'], default: 'live' },
  thumbnail: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);

