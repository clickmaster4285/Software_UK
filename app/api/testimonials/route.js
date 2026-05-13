import { NextRequest, NextResponse } from 'next/server';
import Testimonial from '@/app/models/Testimonial';
import dbConnect from '@/lib/mongoose';

// Helper to get ID from query
function getId(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get('id');
}

// GET all testimonials (public) or a single testimonial by id
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const testimonial = await Testimonial.findById(id).lean();
      if (!testimonial) {
        return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
      }
      return NextResponse.json(testimonial);
    }

    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("GET /api/testimonials error:", err.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST new testimonial
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    if (!data.authorName || !data.content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const testimonial = await Testimonial.create(data);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    console.error("POST /api/testimonials error:", err.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT update testimonial
export async function PUT(req) {
  try {
    await dbConnect();
    const id = getId(req);
    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const data = await req.json();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("PUT /api/testimonials error:", err.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(req) {
  try {
    await dbConnect();
    const id = getId(req);
    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error("DELETE /api/testimonials error:", err.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
