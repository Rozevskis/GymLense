import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';

export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { email, name, weight, height, age, fitnessLevel, sex } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email and update, or create if doesn't exist
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        weight,
        height,
        age,
        fitnessLevel,
        sex,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
