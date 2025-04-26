"use client"
import Image from "next/image"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Name from "@/components/user/account-dropdown/Name"

import Image from "next/image"

export default function AccountDropdown() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        // health dropdown container
        <div className="flex flex-col w-full p-4 border-top">
            {/* Header */}
            <button className="flex flex-row justify-between items-center cursor-pointer py-4" onClick={toggleOpen}>
                <p className="paragraph">Account details</p>
                <motion.img 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    src="/arrow.svg"
                    height={36}
                    width={36}
                    alt="Account details dropdown"
                />
            </button>

            {/* Items */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden flex flex-col"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col"
                        >
                            <Name />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
