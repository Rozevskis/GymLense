"use client"
import { motion } from "framer-motion"

export default function DashHeader({
  activePage = "/dash/profile",
  name = "User"
}) {
  // Split into parts, drop any empty strings:
  const segments = activePage.split("/").filter(Boolean)
  // segments = ["dash", "history", "bhgndfkgjdfgdf"]
  // We want the second element (index 1)
  const pageKey = segments[1] || "profile"
  const activePageFormatted =
    pageKey.charAt(0).toUpperCase() + pageKey.slice(1)

  return (
    <motion.header
      initial={{ y: "-100%" }}
      animate={{ y: "0%" }}
      transition={{ ease: [0, 1, 0.77, 0.98], duration: 0.7 }}
      className="w-full max-w-lg fixed top-0 z-[500]"
    >
      <nav className="h-[36px] bg-[var(--background)] flex justify-center items-center px-4 pt-4 pb-4 text-[var(--accent-darker)] rounded-b-2xl">
        <h2 className="subheading text-[var(--foreground)]">Gym<span className="text-[var(--accent)]">Lens</span></h2>
      </nav>
    </motion.header>
  )
}
