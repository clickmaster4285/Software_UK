import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/app/models/User';
import dbConnect from '@/lib/mongoose';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: 'Only admin can login' }, { status: 403 });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ id: user._id, email: user.email });
    response.cookies.set('token', token, { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const token = await getTokenFromCookies();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    const { email, password, newPassword } = await req.json();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify current password if changing sensitive info
    if (password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: 'Current password required to make changes' }, { status: 400 });
    }

    if (email) user.email = email;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', email: user.email });
  } catch (error) {
    console.error('PUT /users error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('token');
  return response;
}

export async function GET() {
  try {
    await dbConnect();
    const token = await getTokenFromCookies();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /users error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
