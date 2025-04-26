import Link from "next/link"
import Image from "next/image"

export default function DashFooter() {
    return (
        <footer className="w-full max-w-lg p-2 fixed bottom-0">
            <nav className="bg-[var(--accent)] h-[64px] rounded-full flex justify-evenly items-center">
                <Link href="/signin"><Image src="/routine.svg" height={48} width={48} alt="" /></Link>
                <Link href="/signin"><Image src="/camera.svg" height={48} width={48} alt="" /></Link>
                <Link href="/user"><Image src="/user.svg" height={48} width={48} alt="" /></Link>
            </nav>
        </footer>
    )
}