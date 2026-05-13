import { NextResponse } from 'next/server';
import CaseStudy from '@/app/models/CaseStudy';
import '@/app/models/Project';
import '@/app/models/Category';
import dbConnect from '@/lib/mongoose';

function slugify(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function populateProject() {
  return {
    path: 'project',
    select: 'title description thumbnail url category status',
    populate: { path: 'category', select: 'name description' },
  };
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
      doc = await CaseStudy.findById(id).populate(populateProject()).lean();
    }

    // If not found by ID or ID was not a valid ObjectId, try searching by slug
    if (!doc) {
      doc = await CaseStudy.findOne({ slug: id }).populate(populateProject()).lean();
    }

    if (!doc) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (!doc.published && !drafts) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err) {
    console.error('GET /case-studies/[id] error:', err);
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
      'client',
      'technologies',
      'thumbnail',
      'status',
      'challenge',
      'approach',
      'results',
    ];

    for (const k of keys) {
      if (k in body) {
        if (k === 'technologies' && Array.isArray(body[k])) {
          updates[k] = body[k].map(String);
        } else if (k === 'published') {
          updates[k] = Boolean(body[k]);
        } else if (k === 'slug' && typeof body[k] === 'string') {
          updates[k] = slugify(body[k].trim());
        } else if (typeof body[k] === 'string') {
          updates[k] = body[k].trim();
        } else {
          updates[k] = body[k];
        }
      }
    }

    if (typeof updates.slug === 'string' && updates.slug) {
      const existing = await CaseStudy.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      })
        .select('_id')
        .lean();
      if (existing) {
        return NextResponse.json({ message: 'Slug already in use' }, { status: 400 });
      }
    }

    const doc = await CaseStudy.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate(populateProject())
      .lean();

    if (!doc) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err) {
    console.error('PUT /case-studies/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req, context) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const deleted = await CaseStudy.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /case-studies/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
