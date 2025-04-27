'use client';

import { useEffect, useState } from 'react';

export default function History() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/update', {
          method: 'GET',
          credentials: 'include', // 🔥 VERY IMPORTANT to send cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <section className="w-full px-2 bg-[var(--accent)] min-h-[80dvh] py-30 flex flex-col items-center justify-center text-white">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {!user ? (
        <div>Loading user profile...</div>
      ) : (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
          <div className="space-y-2">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Weight:</strong> {user.weight} kg</div>
            <div><strong>Height:</strong> {user.height} cm</div>
            <div><strong>Age:</strong> {user.age} years</div>
            <div><strong>Fitness Level:</strong> {user.fitnessLevel}</div>
            <div><strong>Sex:</strong> {user.sex}</div>
          </div>
        </div>
      )}
    </section>
  );
}
