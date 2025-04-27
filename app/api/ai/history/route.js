import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import WorkoutResponse from '@/models/WorkoutResponse';
import { jwtVerify } from 'jose';

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;
    const responses = await WorkoutResponse.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(responses);
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
