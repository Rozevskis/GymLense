import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import { optimizeImage } from '@/utils/imageUtils';

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

export async function POST(req) {
  // Sample response
  return NextResponse.json({
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
  });
  //END Sample response
  try {
    const { user_profile } = await req.json();
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const userProfile = JSON.parse(formData.get('user_profile'));

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Optimize image
    const imageResult = await optimizeImage(imageBuffer, true);
    
    // Log optimization details
    console.log('Image optimization results:', {
      originalSize: Math.round(imageResult.originalSize / 1024) + 'KB',
      optimizedSize: Math.round(imageResult.optimizedSize / 1024) + 'KB',
      dimensions: `${imageResult.optimizedWidth}x${imageResult.optimizedHeight}`,
      compressionRatio: imageResult.compressionRatio + 'x'
    });

    // Check if OpenAI is initialized
    if (!openai) {
      return NextResponse.json({
        error: "OpenAI API key is not configured. Please add your API key to the environment variables."
      }, { status: 503 });
    }

    const openAIRequest = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional personal trainer. Analyze the image of gym equipment and create a workout plan. The user's profile is: ${JSON.stringify(user_profile)}. Include specific weight numbers based on the user's weight, not percentages or 1RM values.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What exercise can I do with this equipment? Please provide a detailed workout plan."
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
        const cleanedContent = responseContent.replace(/```json\n|```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedContent);
        return NextResponse.json(jsonResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', response.choices[0].message.content);
        return NextResponse.json(
          { error: 'Invalid response format from AI' },
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


