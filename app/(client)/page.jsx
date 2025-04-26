'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data when component mounts
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user/update');
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // If not authenticated, redirect to login page
                    router.push('/signin');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="h-[100dvh] w-full flex flex-col justify-center items-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">Hello, <span className="text-blue-600">{user?.name || 'User'}</span>!</h1>
            
            {user && (
                <div className="mt-4 p-6 bg-white rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        {user.weight && <p><span className="font-medium">Weight:</span> {user.weight} kg</p>}
                        {user.height && <p><span className="font-medium">Height:</span> {user.height} cm</p>}
                        {user.age && <p><span className="font-medium">Age:</span> {user.age} years</p>}
                        {user.fitnessLevel && (
                            <p>
                                <span className="font-medium">Fitness Level:</span> 
                                {user.fitnessLevel.charAt(0).toUpperCase() + user.fitnessLevel.slice(1)}
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={async () => {
                            await fetch('/api/auth/logout');
                            router.push('/signin');
                        }}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}