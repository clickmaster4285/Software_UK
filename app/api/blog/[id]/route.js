import { NextResponse } from 'next/server';
import BlogPost from '@/app/models/BlogPost';
import dbConnect from '@/lib/mongoose';
import { calculateReadTime } from '@/lib/readTime';

function slugify(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeFaqs(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const question = typeof item.question === 'string' ? item.question.trim() : '';
      const answer = typeof item.answer === 'string' ? item.answer.trim() : '';
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item) => Boolean(item));
}

// GET single: public if published; ?drafts=1 allows draft (admin)
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const drafts = searchParams.get('drafts') === '1';

    let doc;
    // Check if ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      doc = await BlogPost.findById(id).lean();
    }

    // If not found by ID or ID was not a valid ObjectId, try searching by slug
    if (!doc) {
      doc = await BlogPost.findOne({ slug: id }).lean();
    }

    if (!doc) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    
    if (!doc.published && !drafts) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (err) {
    console.error('GET /blog/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await req.json();

    const updates = {};
    const keys = [
      'published',
      'slug',
      'title',
      'excerpt',
      'content',
      'author',
      'authorLinkedin',
      'authorImage',
      'thumbnail',
      'category',
      'faqHeading',
      'tags',
      'faqs',
    ];

    for (const k of keys) {
      if (k in body) {
        if (k === 'tags' && Array.isArray(body[k])) updates[k] = body[k].map(String);
        else if (k === 'faqs') updates[k] = normalizeFaqs(body[k]);
        else if (k === 'published') updates[k] = Boolean(body[k]);
        else if (k === 'slug' && typeof body[k] === 'string') updates[k] = slugify(body[k].trim());
        else if (typeof body[k] === 'string') updates[k] = body[k].trim();
        else updates[k] = body[k];
      }
    }

    const nextTitle = typeof updates.title === 'string' ? updates.title : typeof body.title === 'string' ? body.title.trim() : '';
    const nextExcerpt = typeof updates.excerpt === 'string' ? updates.excerpt : typeof body.excerpt === 'string' ? body.excerpt.trim() : '';

    if (typeof updates.content === 'string') {
      const { minutes } = calculateReadTime({
        html: updates.content,
        fallbackParts: [nextTitle, nextExcerpt],
      });
      updates.readTimeMinutes = minutes;
    } else if ('title' in updates || 'excerpt' in updates) {
      const existing = await BlogPost.findById(id).select('content').lean();
      const existingContent = typeof existing?.content === 'string' ? existing.content : '';
      const { minutes } = calculateReadTime({
        html: existingContent,
        fallbackParts: [nextTitle, nextExcerpt],
      });
      updates.readTimeMinutes = minutes;
    }

    if (typeof updates.slug === 'string' && updates.slug) {
      const existing = await BlogPost.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      }).select('_id').lean();
      if (existing) return NextResponse.json({ message: 'Slug already in use' }, { status: 400 });
    }

    const doc = await BlogPost.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error('PUT /blog/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req, context) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /blog/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
