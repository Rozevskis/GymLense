"use client"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import HealthDropdown from "@/components/user/health-dropdown/HealthDropdown"
import AccountDropdown from "@/components/user/account-dropdown/AccountDropdown"
import Image from "next/image"

export default function Profile() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                toast.success('Logged out successfully')
                router.push('/')
            } else {
                toast.error('Failed to logout')
            }
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('An error occurred during logout')
        }
    }

    return (
        <section className="w-full px-2">
            {/* dropdown menu container */}
            <div className="bg-[var(--background-darker)] rounded-2xl">
                <HealthDropdown />
                {/* <AccountDropdown /> hujzin vecit nebus laika */}
                <div className="flex flex-col w-full p-4 border-top">
                    <button 
                        className="flex flex-row justify-between items-center cursor-pointer py-4"
                        onClick={handleLogout}
                    >
                        <p className="paragraph">Log out</p>
                        <Image src="/logout.svg" height={32} width={32} alt="logout"/>
                    </button>
                </div>
            </div>
        </section>
    )
}