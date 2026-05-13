import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorRole: { type: String, default: '' },
  authorCompany: { type: String, default: '' },
  content: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);