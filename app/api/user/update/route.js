import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import User from '@/models/User';
import { getToken } from '@/utils/auth';

export async function PUT(req) {
  try {
    await connectDB();
    const token = await getToken(req);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { weight, height, age, fitnessLevel } = await req.json();
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      token.id,
      { 
        weight, 
        height, 
        age, 
        fitnessLevel 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user without password
    const userWithoutPassword = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      weight: updatedUser.weight,
      height: updatedUser.height,
      age: updatedUser.age,
      fitnessLevel: updatedUser.fitnessLevel
    };

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const token = await getToken(req);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findById(token.id).select('-password');
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
