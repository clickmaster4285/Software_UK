import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true, index: true, default: '' },
    published: { type: Boolean, default: false },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    readTimeMinutes: { type: Number, default: 1, min: 1 },
    author: { type: String, default: '' },
    authorLinkedin: { type: String, default: '' },
    authorImage: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: '', index: true },
    faqHeading: { type: String, default: '' },
    tags: { type: [String], default: [] },
    faqs: {
      type: [
        new mongoose.Schema(
          {
            question: { type: String, required: true },
            answer: { type: String, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

// In dev hot-reload, ensure new fields are present if model was already cached
if (BlogPost.schema) {
  const pathsToAdd = {
    readTimeMinutes: { type: Number, default: 1, min: 1 },
    authorLinkedin: { type: String, default: '' },
    authorImage: { type: String, default: '' },
    faqHeading: { type: String, default: '' },
    faqs: {
      type: [
        new mongoose.Schema(
          {
            question: { type: String, required: true },
            answer: { type: String, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  };

  Object.keys(pathsToAdd).forEach(path => {
    if (!BlogPost.schema.path(path)) {
      BlogPost.schema.add({ [path]: pathsToAdd[path] });
    }
  });
}

export default BlogPost;
