import { NextRequest, NextResponse } from 'next/server';
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

async function ensureUniqueSlug(base) {
  const clean = slugify(base);
  if (!clean) return '';
  let slug = clean;
  let i = 2;
  while (await BlogPost.findOne({ slug }).select('_id').lean()) {
    slug = `${clean}-${i++}`;
  }
  return slug;
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

// GET: published only by default; ?drafts=1 returns all (admin UI)
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const drafts = searchParams.get('drafts') === '1';
    const filter = drafts ? {} : { published: true };

    const list = await BlogPost.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    console.error('GET /blog error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      published, slug, title, excerpt, content,
      author, authorLinkedin, authorImage, thumbnail,
      category, faqHeading, tags, faqs
    } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const desiredSlug = typeof slug === 'string' ? slug.trim() : '';
    const computedSlug = desiredSlug ? slugify(desiredSlug) : await ensureUniqueSlug(String(title));
    const normalizedContent = String(content).trim();
    const normalizedTitle = String(title).trim();
    const normalizedExcerpt = String(excerpt).trim();

    const { minutes: readTimeMinutes } = calculateReadTime({
      html: normalizedContent,
      fallbackParts: [normalizedTitle, normalizedExcerpt],
    });

    if (computedSlug) {
      const taken = await BlogPost.findOne({ slug: computedSlug }).select('_id').lean();
      if (taken) return NextResponse.json({ message: 'Slug already in use' }, { status: 400 });
    }

    const doc = await BlogPost.create({
      published: Boolean(published),
      slug: computedSlug,
      title: normalizedTitle,
      excerpt: normalizedExcerpt,
      content: normalizedContent,
      readTimeMinutes,
      author: typeof author === 'string' ? author.trim() : '',
      authorLinkedin: typeof authorLinkedin === 'string' ? authorLinkedin.trim() : '',
      authorImage: typeof authorImage === 'string' ? authorImage.trim() : '',
      thumbnail: typeof thumbnail === 'string' ? thumbnail.trim() : '',
      category: typeof category === 'string' ? category.trim() : '',
      faqHeading: typeof faqHeading === 'string' ? faqHeading.trim() : '',
      tags: Array.isArray(tags) ? tags.map(String) : [],
      faqs: normalizeFaqs(faqs),
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const msg = err.message || String(err);
    console.error('POST /blog error:', msg);
    if (msg.includes('duplicate key')) {
      return NextResponse.json({ message: 'A blog post with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
