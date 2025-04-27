import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import User from '@/models/User';
import { getToken } from '@/utils/auth';

export async function PUT(req) {
  try {
    await connectDB();
    const token = await getToken(req);
    
    if (!token) {
      console.log('PUT - Unauthorized: No token found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const requestBody = await req.json();
    console.log('PUT - Received data:', requestBody);
    
    // Extract the fields with explicit type conversion
    const weight = requestBody.weight ? Number(requestBody.weight) : undefined;
    const height = requestBody.height ? Number(requestBody.height) : undefined;
    const age = requestBody.age ? Number(requestBody.age) : undefined;
    const fitnessLevel = requestBody.fitnessLevel;
    const sex = requestBody.sex;
    
    console.log('PUT - Processed data:', { weight, height, age, fitnessLevel, sex });
    
    // Only update fields that are provided
    const updateFields = {};
    if (weight !== undefined) updateFields.weight = weight;
    if (height !== undefined) updateFields.height = height;
    if (age !== undefined) updateFields.age = age;
    if (fitnessLevel) updateFields.fitnessLevel = fitnessLevel;
    if (sex) updateFields.sex = sex;
    
    console.log('PUT - Update fields:', updateFields);
    
    // Find the user before update
    const userBeforeUpdate = await User.findById(token.id);
    console.log('PUT - User before update:', userBeforeUpdate);
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      token.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('PUT - User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('PUT - User after update:', updatedUser);

    // Return user without password
    const userWithoutPassword = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      weight: updatedUser.weight,
      height: updatedUser.height,
      age: updatedUser.age,
      fitnessLevel: updatedUser.fitnessLevel,
      sex: updatedUser.sex
    };

    console.log('PUT - Returning user data:', userWithoutPassword);
    
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
      console.log('GET - Unauthorized: No token found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('GET - Token ID:', token.id);

    const user = await User.findById(token.id).select('-password');
    if (!user) {
      console.log('GET - User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  

    // Set cache control headers to prevent caching
    const response = NextResponse.json(user);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
