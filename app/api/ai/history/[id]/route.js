import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import WorkoutResponse from '@/models/WorkoutResponse';
import { jwtVerify } from 'jose';

export async function GET(request, { params }) {
  // Await params to ensure it's fully resolved before accessing properties
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    await connectDB();
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;
    const workout = await WorkoutResponse.findOne({ _id: id, userId }).lean();
    if (!workout) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(workout);
  } catch (err) {
    console.error('History detail fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch history item' }, { status: 500 });
  }
}
