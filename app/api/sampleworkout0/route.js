import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const workoutData = {
      "name_of_equipment": "Barbell Bench Press",
      "description": "A compound exercise used to build upper body strength, focusing on the chest, shoulders, and triceps.",
      "targeted_muscles": ["pectorals", "triceps", "deltoids"],
      "recommended_repetitions": [
        {
          "set": 1,
          "weight": "40kg",
          "repetitions": 12
        },
        {
          "set": 2,
          "weight": "50kg",
          "repetitions": 8
        },
        {
          "set": 3,
          "weight": "55kg",
          "repetitions": 6
        }
      ]
    };

    return NextResponse.json(workoutData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workout data' },
      { status: 500 }
    );
  }
}
