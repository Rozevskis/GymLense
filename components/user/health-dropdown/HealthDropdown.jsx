"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Weight from "@/components/user/health-dropdown/Weight"
import Height from "@/components/user/health-dropdown/Height"
import Sex from "@/components/user/health-dropdown/Sex"
import Age from "@/components/user/health-dropdown/Age"
import FitnessLevel from "@/components/user/health-dropdown/FitnessLevel"

import Image from "next/image"

export default function HealthDropdown() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        <div className="flex flex-col w-full p-4">
            {/* Header */}
            <button className="flex flex-row justify-between items-center cursor-pointer py-4" onClick={toggleOpen}>
                <p className="paragraph">Health details</p>
                <motion.img 
                    initial={{ rotate: 0 }} 
                    animate={{ rotate: isOpen ? 90 : 0 }} 
                    transition={{ duration: 0.3 }}
                    src="/arrow.svg"
                    height={36}
                    width={36}
                    alt="Health details dropdown"
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
                            <Weight />
                            <Height />
                            <Sex />
                            <Age />
                            <FitnessLevel />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
