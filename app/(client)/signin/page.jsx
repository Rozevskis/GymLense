'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form states
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        weight: '',
        height: '',
        age: '',
        fitnessLevel: 'beginner'
    });

    // Handle OAuth sign in
    const handleOAuthSignIn = (provider) => {
        // This is a placeholder for OAuth integration
        console.log(`Sign in with ${provider}`);
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Redirect to home page on successful login
            router.push('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // First register the user
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                }),
            });
            
            const registerResult = await registerResponse.json();
            
            if (!registerResponse.ok) {
                throw new Error(registerResult.error || 'Registration failed');
            }
            
            // Then log them in
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registerData.email,
                    password: registerData.password,
                }),
            });
            
            const loginResult = await loginResponse.json();
            
            if (!loginResponse.ok) {
                throw new Error(loginResult.error || 'Login after registration failed');
            }
            
            // Then update their profile with the additional information
            const updateResponse = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weight: registerData.weight ? parseFloat(registerData.weight) : null,
                    height: registerData.height ? parseFloat(registerData.height) : null,
                    age: registerData.age ? parseInt(registerData.age) : null,
                    fitnessLevel: registerData.fitnessLevel,
                }),
            });
            
            const updateResult = await updateResponse.json();
            
            if (!updateResponse.ok) {
                throw new Error(updateResult.error || 'Profile update failed');
            }
            
            // Redirect to home page on successful registration and profile update
            router.push('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for login form
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle input change for registration form
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col justify-center items-center py-10">
            <div className="w-full max-w-md px-4">
                <h1 className="mb-5 heading text-center">Gym<span className="blue-span">Lense</span></h1>
                
                {/* Toggle between login and register */}
                <div className="flex mb-6 border-b">
                    <button 
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 font-medium ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 font-medium ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Register
                    </button>
                </div>
                
                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                
                {/* Login Form */}
                {isLogin ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    /* Registration Form */
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="reg-email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="reg-password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={registerData.weight}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={registerData.height}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={registerData.age}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                            <select
                                id="fitnessLevel"
                                name="fitnessLevel"
                                value={registerData.fitnessLevel}
                                onChange={handleRegisterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
                
                {/* OAuth buttons */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleOAuthSignIn('google')}
                            className="sign-in-button flex justify-center gap-2 items-center w-full"
                        >
                            <Image src="/google-logo.svg" height={19} width={19} alt="Google logo" />
                            Google
                        </button>
                        <button 
                            onClick={() => handleOAuthSignIn('apple')}
                            className="sign-in-button flex justify-center gap-2 items-center w-full"
                        >
                            <Image src="/apple-logo.svg" height={19} width={19} alt="Apple logo" />
                            Apple
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}