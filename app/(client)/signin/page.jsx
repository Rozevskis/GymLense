'use client';

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignIn() {
    const handleSignIn = (provider) => {
        signIn(provider, { callbackUrl: '/' });
    };

    return (
        <section className="h-[100dvh] w-full flex flex-col justify-center items-center">
            <div>
                <h1 className="mb-5 heading">Gym<span className="blue-span">Lense</span></h1>
                <div className="w-full space-y-3">
                    <button 
                        onClick={() => handleSignIn('apple')}
                        className="sign-in-button flex justify-center gap-2 items-center w-full">
                        <Image src="/apple-logo.svg" height={19} width={19} alt="Apple logo" />
                        Sign in with Apple
                    </button>
                    <button 
                        onClick={() => handleSignIn('google')}
                        className="sign-in-button flex justify-center gap-2 items-center w-full">
                        <Image src="/google-logo.svg" height={19} width={19} alt="Google logo" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </section>
    )
}