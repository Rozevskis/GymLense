import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const workoutData = {
      "name_of_equipment": "Barbell Bench Press",
      "description": "A compound exercise used to build upper body strength, focusing on the chest, shoulders, and triceps.",
      "difficulty_level": "intermediate",
      "equipment_required": ["barbell", "bench", "weight plates", "safety clips"],
      "targeted_muscles": {
        "primary": ["pectorals", "triceps", "deltoids"],
        "secondary": ["serratus anterior", "core"]
      },
      "recommended_repetitions": [
        {
          "set": 1,
          "weight": "40kg",
          "repetitions": 12,
          "rest_time": "90 seconds",
          "type": "warm-up"
        },
        {
          "set": 2,
          "weight": "50kg",
          "repetitions": 8,
          "rest_time": "120 seconds",
          "type": "working"
        },
        {
          "set": 3,
          "weight": "55kg",
          "repetitions": 6,
          "rest_time": "120 seconds",
          "type": "working"
        }
      ],
      "form_tips": [
        "Keep your feet flat on the ground",
        "Maintain a slight arch in your lower back",
        "Keep your elbows at roughly a 45-degree angle",
        "Control the descent of the bar"
      ],
      "safety_considerations": [
        "Always use a spotter for heavy lifts",
        "Ensure safety clips are properly secured",
        "Start with lighter weights to perfect form"
      ],
      "estimated_calories": "150-200 per session",
      "recommended_warmup": "5-10 minutes of dynamic stretching",
      "video_tutorial_url": "https://example.com/bench-press-tutorial",
      "last_updated": new Date().toISOString()
    };

    return NextResponse.json(workoutData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workout data' },
      { status: 500 }
    );
  }
}
