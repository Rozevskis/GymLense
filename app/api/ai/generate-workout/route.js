import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import { optimizeImage } from '@/utils/imageUtils';
import connectDB from '@/utils/db';
import WorkoutResponse from '@/models/WorkoutResponse';
import { jwtVerify } from 'jose';

// Initialize OpenAI only if API key is present
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key is not configured');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
}

// Demo endpoint to test image optimization
// export async function GET(req) {
//   try {
//     const imagePath = path.join(process.cwd(), 'public', 'sampleimage', 'benchpress.jpg');
//     const imageDetails = await optimizeImage(imagePath, true);
    
//     return NextResponse.json({
//       message: 'Image optimization details',
//       details: imageDetails
//     });
//   } catch (error) {
//     const errorMessage = error.message || 'An unexpected error occurred';
//     return NextResponse.json({ 
//       error: errorMessage,
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     }, { status: 500 });
//   }
// }

const sampleResponse = {

    "name_of_equipment": "Barbell Bench Press",
    "description": "A common gym exercise used to build strength in the upper body.",
    "targeted_muscles": {
      "primary": [
        "Chest"
      ],
      "secondary": [
        "Triceps",
        "Shoulders"
      ]
    },
    "recommended_repetitions": [
      {
        "set": 1,
        "weight": "40kg",
        "repetitions": 10,
        "rest_time": "60-90 seconds",
        "type": "Warm-up"
      },
      {
        "set": 2,
        "weight": "50kg",
        "repetitions": 8,
        "rest_time": "60-90 seconds",
        "type": "Working"
      },
      {
        "set": 3,
        "weight": "55kg",
        "repetitions": 6,
        "rest_time": "60-90 seconds",
        "type": "Working"
      }
    ],
    "form_tips": [
      "Keep your feet flat on the ground.",
      "Arch your back slightly while keeping your glutes on the bench.",
      "Lower the barbell slowly to your chest."
    ],
    "safety_considerations": [
      "Ensure a spotter is present for heavy sets.",
      "Do not bounce the bar off your chest."
    ],
    "recommended_warmup": "5-10 minutes of light cardio and dynamic stretches for the upper body."
};

export async function POST(req) {
  try {
    // Check OpenAI initialization first
    if (!openai && !process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add it to your environment variables.' },
        { status: 500 }
      );
    }

    // Parse form data
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error('Failed to parse form data:', error);
      return NextResponse.json(
        { error: 'Failed to parse form data: ' + error.message },
        { status: 400 }
      );
    }

    const useSampleResponse = formData.get('useSampleResponse') === 'true';
    const imageFile = formData.get('image');
    const userProfileData = formData.get('userProfile');

    if (useSampleResponse) {
      return NextResponse.json(sampleResponse);
    }

    if (!userProfileData) {
      return NextResponse.json({ error: 'No user profile provided' }, { status: 400 });
    }

    const userProfile = JSON.parse(userProfileData);

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to buffer and optimize
    let imageResult;
    let originalBase64;
    try {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      // Save original uncompressed image as base64
      originalBase64 = imageBuffer.toString('base64');
      imageResult = await optimizeImage(imageBuffer, true);
      
      // Log optimization details
      console.log('Image optimization results:', {
        originalSize: Math.round(imageResult.originalSize / 1024) + 'KB',
        optimizedSize: Math.round(imageResult.optimizedSize / 1024) + 'KB',
        dimensions: `${imageResult.optimizedWidth}x${imageResult.optimizedHeight}`,
        compressionRatio: imageResult.compressionRatio + 'x'
      });
    } catch (error) {
      console.error('Image optimization failed:', error);
      return NextResponse.json({ error: 'Failed to process image: ' + error.message }, { status: 400 });
    }

    // Check if OpenAI is initialized
    if (!openai) {
      return NextResponse.json({
        error: "OpenAI API key is not configured. Please add your API key to the environment variables."
      }, { status: 503 });
    }

    const openAIRequest = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional personal trainer. Analyze the image of gym equipment and create a workout plan. The user's profile is: ${JSON.stringify(userProfile)}. Include specific weight numbers based on the user's weight, not percentages or 1RM values.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this gym equipment and provide a workout plan in this exact JSON format:
{
  "name_of_equipment": "Equipment Name",
  "description": "Brief description",
  "targeted_muscles": {
    "primary": ["muscle1", "muscle2"],
    "secondary": ["muscle3", "muscle4"]
  },
  "recommended_repetitions": [
    {
      "set": 1,
      "type": "warm-up/working",
      "weight": "specific weight in kg",
      "repetitions": "number",
      "rest_time": "duration"
    }
  ],
  "form_tips": ["tip1", "tip2"],
  "safety_considerations": ["safety1", "safety2"],
  "recommended_warmup": "warmup description"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageResult.base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    };

    try {
      const response = await openai.chat.completions.create(openAIRequest);

      try {
        // Get the response content and clean it up
        const responseContent = response.choices[0].message.content;
        // Try to find JSON in the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/m);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        const jsonResponse = JSON.parse(jsonMatch[0]);
        // Persist the AI response
        await connectDB();
        try {
          const token = req.cookies.get('token')?.value;
          let userId = null;
          if (token) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
            const { payload } = await jwtVerify(token, secret);
            userId = payload.id;
          }
          const saved = await WorkoutResponse.create({ userId, response: jsonResponse, image: originalBase64 });
          return NextResponse.json({ id: saved._id, ...jsonResponse });
        } catch (dbError) {
          console.error('Failed to save workout response:', dbError);
          // Still return the response even if DB save fails
          return NextResponse.json(jsonResponse);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', response.choices[0].message.content);
        return NextResponse.json(
          { error: 'Invalid response format from AI. Please try again.' },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      return NextResponse.json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}
