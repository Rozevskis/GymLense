'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HistoryDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/ai/history/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch workout');
        setWorkout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const { response, image } = workout;
  return (
    <section className="flex flex-col items-center justify-start w-full bg-white px-4 py-6">
      <button onClick={() => router.back()} className="mb-4 text-blue-600">Back</button>
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt={response.name_of_equipment}
        className="w-full h-auto object-cover rounded-md mb-4"
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[var(--background-darker)] rounded-xl p-6 space-y-6 shadow-lg"
      >
        <h2 className="heading text-center mb-4">{response.name_of_equipment}</h2>
        <p className="text-gray-700 paragraph text-center">{response.description}</p>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="subheading mb-2">Primary Muscles</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {response.targeted_muscles.primary.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="subheading mb-2">Secondary Muscles</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {response.targeted_muscles.secondary.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="subheading mb-2">Workout Sets</h3>
          <div className="space-y-3">
            {response.recommended_repetitions.map((set, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg shadow">
                <div className="paragraph py-1">Set: {set.set}</div>
                <div className="paragraph py-1">Type: {set.type}</div>
                <div className="paragraph py-1">Weight: {set.weight}</div>
                <div className="paragraph py-1">Reps: {set.repetitions}</div>
                <div className="paragraph py-1">Rest: {set.rest_time}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="subheading mb-2">Form Tips</h3>
          <ul className="list-disc list-inside text-gray-600 paragraph">
            {response.form_tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="subheading mb-2">Safety Considerations</h3>
          <ul className="list-disc list-inside text-gray-600 paragraph">
            {response.safety_considerations.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="subheading mb-2">Recommended Warmup</h3>
          <p className="text-gray-600 paragraph">{response.recommended_warmup}</p>
        </div>
      </motion.div>
    </section>
  );
}
