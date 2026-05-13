import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  showOnHome: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// In dev hot-reload, ensure new fields are present
if (Category.schema) {
  if (!Category.schema.path('showOnHome')) {
    Category.schema.add({ showOnHome: { type: Boolean, default: false } });
  }
  if (!Category.schema.path('slug')) {
    Category.schema.add({ slug: { type: String, unique: true, sparse: true } });
  }
}

export default Category;
