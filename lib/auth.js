import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getTokenFromCookies() {
  const cookieStore = cookies();
  const cookieObj = cookieStore instanceof Promise ? await cookieStore : cookieStore;
  const token = cookieObj.get('token')?.value ?? null;
  return token;
}

export async function verifyToken(token) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function requireAuth() {
  const token = await getTokenFromCookies();
  if (!token) throw new Error('Unauthorized');
  return await verifyToken(token);
}

export function requireAdmin(decoded) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (decoded.email !== ADMIN_EMAIL) throw new Error('Admin only');
  return true;
}
