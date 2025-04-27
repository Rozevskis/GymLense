'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function History() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/ai/history');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching history');
        setResponses(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (selected) {
    const result = selected.response;
    return (
      <section className="flex flex-col items-center justify-start w-full bg-white px-4 py-6">
        <button onClick={() => setSelected(null)} className="mb-4 text-blue-600">Back</button>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[var(--background-darker)] rounded-xl p-6 space-y-6 shadow-lg"
        >
          <h2 className="heading text-center mb-4">{result.name_of_equipment}</h2>
          <p className="text-gray-700 paragraph text-center">{result.description}</p>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="subheading mb-2">Primary Muscles</h3>
              <ul className="list-disc list-inside text-gray-600 paragraph">
                {result.targeted_muscles.primary.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="subheading mb-2">Secondary Muscles</h3>
              <ul className="list-disc list-inside text-gray-600 paragraph">
                {result.targeted_muscles.secondary.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          </div>

          {result.recommended_repetitions.map((rep, i) => (
            <div key={i} className="space-y-2">
              <h3 className="subheading">{`Set ${rep.set} (${rep.type})`}</h3>
              <p className="paragraph">{`Weight: ${rep.weight}, Reps: ${rep.repetitions}, Rest: ${rep.rest_time}`}</p>
            </div>
          ))}

          <div>
            <h3 className="subheading">Form Tips</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {result.form_tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="subheading">Safety Considerations</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {result.safety_considerations.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="subheading">Recommended Warmup</h3>
            <p className="paragraph">{result.recommended_warmup}</p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full px-2 bg-[var(--accent)] min-h-[80dvh] py-10">
      <div className="grid grid-cols-1 gap-4">
        {responses.map(item => (
          <div
            key={item._id}
            onClick={() => setSelected(item)}
            className="cursor-pointer bg-[var(--background)] p-4 rounded-lg shadow flex flex-row items-center justify-between space-x-4"
          >
            <p className="text-lg subheading">{item.response.name_of_equipment}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}