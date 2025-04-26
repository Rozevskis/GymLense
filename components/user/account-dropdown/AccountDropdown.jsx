"use client"
import Image from "next/image"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Name from "@/components/user/account-dropdown/Name"


export default function HealthDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const toggleOpen = () => {
        setIsOpen(!isOpen)
        console.log('toggled')
    }
    return (
        // health dropdown container
        <div className="flex flex-col w-full p-4 border-top">
            {/* health dropdown header */}
            <button className="flex flex-row justify-between items-center cursor-pointer py-4" onClick={toggleOpen}>
                <p className="paragraph">Account details</p>
                <motion.img 
                initial={{ rotate: 0 }} 
                animate={ isOpen ? {rotate: 90} : { rotate: 0 } } src="/arrow.svg" height={36} width={36} alt="Health details dropdown"/>
            </button>
            <AnimatePresence>
            {
                isOpen &&
                <>
                    <Name />
                </>
            }
            </AnimatePresence>
        </div>
    )
}