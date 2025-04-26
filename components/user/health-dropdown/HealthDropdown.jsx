"use client"
import Image from "next/image"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Height from "@/components/user/health-dropdown/Height"
import Weight from "@/components/user/health-dropdown/Weight"
import Sex from "@/components/user/health-dropdown/Sex"
import Age from "@/components/user/health-dropdown/Age"
import FitnessLevel from "@/components/user/health-dropdown/FitnessLevel"


export default function HealthDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownState, setDropdownState] = useState({
        weightOpen: false,
        heightOpen: false,
        ageOpen: false,
        sexOpen: false,
        fitnessOpen: false
    })
    const toggleOpen = () => {
        setIsOpen(!isOpen)
        console.log('toggled')
    }
    return (
        // health dropdown container
        <div className="flex flex-col w-full p-4">
            {/* health dropdown header */}
            <button className="flex flex-row justify-between items-center cursor-pointer py-4" onClick={toggleOpen}>
                <p className="paragraph">Health details</p>
                <motion.img 
                initial={{ rotate: 0 }} 
                animate={ isOpen ? {rotate: 90} : { rotate: 0 } } src="/arrow.svg" height={36} width={36} alt="Health details dropdown"/>
            </button>
            {
                isOpen &&
                <>
                <Weight />
                <Height />
                <Sex />
                <FitnessLevel />
                </>
            }
        </div>
    )
}