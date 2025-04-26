'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const DEFAULT_USER_PROFILE = {
  weight: 73,
  height: 175,
  age: 25,
  fitness_level: "Moderately sporty",
  sex: "Male"
};

export default function AIWorkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [userProfile] = useState(DEFAULT_USER_PROFILE);

  const generateWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_profile: userProfile }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">AI Workout Generator</h1>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">User Profile</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>Weight: {userProfile.weight} kg</div>
            <div>Height: {userProfile.height} cm</div>
            <div>Age: {userProfile.age} years</div>
            <div>Fitness Level: {userProfile.fitness_level}</div>
            <div>Sex: {userProfile.sex}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Equipment Image</h2>
          <div className="relative w-full h-[300px]">
            <Image
              src="/sampleimage/benchpress.jpg"
              alt="Bench Press Equipment"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={generateWorkout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Workout Plan'}
        </button>

        {error && (
          <div className="text-red-600 p-4 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Workout Plan</h2>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
