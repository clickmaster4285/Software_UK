import { NextRequest, NextResponse } from 'next/server';
import Category from '@/app/models/Category';
import dbConnect from '@/lib/mongoose';

// Helper to get ID from query string
function getId(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get('id');
}

// GET all categories
export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({ deleted: false });
    return NextResponse.json(categories);
  } catch (err) {
    console.error('GET /categories error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// CREATE category
export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    
    // Auto-generate slug if missing
    let slug = data?.slug;
    if (!slug && data?.name) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = await Category.create({
      name: data?.name,
      slug: slug,
      description: data?.description,
      showOnHome: Boolean(data?.showOnHome),
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error('POST /categories error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(req) {
  await dbConnect();
  try {
    const id = getId(req);
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const data = await req.json();

    const updateData = {
      ...(typeof data?.name === 'string' ? { name: data.name } : {}),
      ...(typeof data?.slug === 'string' ? { slug: data.slug } : {}),
      ...(typeof data?.description === 'string' ? { description: data.description } : {}),
      ...(typeof data?.showOnHome !== 'undefined'
        ? { showOnHome: Boolean(data.showOnHome) }
        : {}),
    };

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error('PUT /categories error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE category (soft delete)
export async function DELETE(req) {
  await dbConnect();
  try {
    const id = getId(req);
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(id, { deleted: true });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /categories error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
