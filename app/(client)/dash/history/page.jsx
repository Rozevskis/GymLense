'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function History() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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

  return (
    <section className="w-full px-2 bg-[var(--accent)] min-h-[80dvh] py-10">
      <div className="grid grid-cols-1 gap-4">
        {responses.map(item => (
          <div
            key={item._id}
            onClick={() => router.push(`/dash/history/${item._id}`)}
            className="cursor-pointer bg-[var(--background)] p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.response.name_of_equipment}
                className="w-12 h-12 object-cover rounded-md"
              />
              <p className="text-lg subheading">{item.response.name_of_equipment}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}