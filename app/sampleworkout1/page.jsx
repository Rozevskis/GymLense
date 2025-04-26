'use client';
import { useState, useEffect } from 'react';

export default function SampleWorkout() {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch('/api/sampleworkout1');
        if (!response.ok) {
          throw new Error('Failed to fetch workout data');
        }
        const data = await response.json();
        setWorkout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, []);

  if (loading) return <div className="p-4">Loading workout data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!workout) return <div className="p-4">No workout data available</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{workout.name_of_equipment}</h1>
      
      <section className="mb-6">
        <p className="text-lg mb-4">{workout.description}</p>
        <div className="bg-gray-100 text-black p-4 rounded-lg">
          <p className="font-semibold">Difficulty: {workout.difficulty_level}</p>
          <p>Estimated Calories: {workout.estimated_calories}</p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Equipment Required</h2>
        <ul className="list-disc pl-5">
          {workout.equipment_required.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Targeted Muscles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Primary</h3>
            <ul className="list-disc pl-5">
              {workout.targeted_muscles.primary.map((muscle, index) => (
                <li key={index}>{muscle}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Secondary</h3>
            <ul className="list-disc pl-5">
              {workout.targeted_muscles.secondary.map((muscle, index) => (
                <li key={index}>{muscle}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Workout Sets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-black">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="p-3 text-left">Set</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Reps</th>
                <th className="p-3 text-left">Rest</th>
                <th className="p-3 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {workout.recommended_repetitions.map((set) => (
                <tr key={set.set} className="border-t border-gray-300">
                  <td className="p-3">{set.set}</td>
                  <td className="p-3">{set.weight}</td>
                  <td className="p-3">{set.repetitions}</td>
                  <td className="p-3">{set.rest_time}</td>
                  <td className="p-3">{set.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Form Tips</h2>
        <ul className="list-disc pl-5">
          {workout.form_tips.map((tip, index) => (
            <li key={index} className="mb-2">{tip}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Safety Considerations</h2>
        <ul className="list-disc pl-5">
          {workout.safety_considerations.map((safety, index) => (
            <li key={index} className="mb-2">{safety}</li>
          ))}
        </ul>
      </section>

      <footer className="text-sm text-gray-500 mt-8">
        Last updated: {new Date(workout.last_updated).toLocaleDateString()}
      </footer>
    </div>
  );
}
