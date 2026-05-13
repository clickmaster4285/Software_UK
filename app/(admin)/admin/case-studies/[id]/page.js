'use client';

import { useCaseStudy } from '@/hooks/useCaseStudies';
import CaseStudyForm from '@/components/admin/CaseStudyForm';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditCaseStudyPage() {
  const { id } = useParams();
  const { data: caseStudy, isLoading } = useCaseStudy(id, true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Case Study not found</h2>
        <p className="text-slate-500">The case study you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div>
      <CaseStudyForm initialData={caseStudy} id={id} />
    </div>
  );
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
