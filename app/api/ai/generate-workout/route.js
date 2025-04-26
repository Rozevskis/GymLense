import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import { optimizeImage } from '@/utils/imageUtils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { user_profile } = await req.json();

    // Get optimized image
    const imagePath = path.join(process.cwd(), 'public', 'sampleimage', 'benchpress.jpg');
    const base64Image = await optimizeImage(imagePath);

    const openAIRequest = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness coach AI. When provided with an image of gym equipment and user profile details, analyze the image and generate a detailed JSON response. For the recommended_repetitions, calculate actual weight numbers in kg based on the user's weight and fitness level - do not use percentages or 1RM values. For example, if a user weighs 73kg, suggest actual weights like '40kg' or '50kg'. Strictly output only the JSON object without additional commentary. Follow the exact structure specified."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the provided gym equipment image and the following user profile:

User Profile:
- Weight: ${user_profile.weight} kg
- Height: ${user_profile.height} cm
- Age: ${user_profile.age} years
- Fitness Level: ${user_profile.fitness_level}
- Sex: ${user_profile.sex}

Return a JSON response structured exactly like this:

{
  "name_of_equipment": "string",
  "description": "string",
  "difficulty_level": "string",
  "targeted_muscles": {
    "primary": ["string"],
    "secondary": ["string"]
  },
  "recommended_repetitions": [
    {
      "set": number,
      "weight": "string",
      "repetitions": number,
      "rest_time": "string",
      "type": "string"
    }
  ],
  "form_tips": ["string"],
  "safety_considerations": ["string"],
  "recommended_warmup": "string"
}

Strictly respect JSON formatting and field names.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1500
    };

    const completion = await openai.chat.completions.create(openAIRequest);

    try {
      // Get the response content and clean it up
      const responseContent = completion.choices[0].message.content;
      const cleanedContent = responseContent.replace(/```json\n|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedContent);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', completion.choices[0].message.content);
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}
