import Link from "next/link"

export default function DashHeader({ activePage="Profile", name="User" }) {
    return (
        <header className="w-full max-w-lg fixed top-0">
            <nav className="bg-[var(--accent)] h-[72px] flex justify-between items-center px-4 text-[var(--background)] rounded-b-2xl">
                <div></div>
                <h2 className="subheading">{activePage}</h2>
                <div><Link href="/user" className="subtext">{name}</Link></div>
            </nav>
        </header>
    )
}