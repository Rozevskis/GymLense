"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DashHeader({ activePage="/dash/profile", name="User" }) {
    const activePageFormatted = activePage.split("/dash/")[1]
    .charAt(0).toUpperCase() + activePage.split("/dash/")[1].slice(1)
    return (
        <motion.header 
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{ ease: [0,1,.77,.98], duration: 0.7 }}
        className="w-full max-w-lg fixed top-0 z-500">
            <nav className="bg-[var(--accent)] h-[72px] flex justify-center items-center px-4 text-[var(--background)] rounded-b-2xl">
                {/* <div></div> */}
                <h2 className="subheading">{activePageFormatted}</h2>
                {/* <div><Link href="/user" className="subtext">{name}</Link></div> */}
            </nav>
        </motion.header>
    )
}