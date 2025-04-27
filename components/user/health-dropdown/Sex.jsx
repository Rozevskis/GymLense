"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

export default function SexPicker({ sex, onSexChange, onSave }) {
    const [sexOpen, setSexOpen] = useState(false)
    const [selected, setSelected] = useState()

    // Convert sex string to number for UI
    useEffect(() => {
        if (sex === "male") setSelected(1)
        else if (sex === "female") setSelected(2)
        else if (sex === "other") setSelected(3)
    }, [sex])

    const numToLevel = (num) => {
        if (num === 1) return "Male"
        else if (num === 2) return "Female"
        else if (num === 3) return "Other"
    }

    const handleChangeLevel = (num) => {
        setSelected(num)
    }

    const handleClose = () => setSexOpen(false)
    const handleOpen = () => setSexOpen(true)
    
    const handleSave = () => {
        // Convert number to string value for database
        const sexValue = selected === 1 ? "male" : selected === 2 ? "female" : "other"
        if (onSexChange) onSexChange(sexValue)
        setSexOpen(false)
        if (onSave) onSave({ sex: sexValue })
    }

    // Position for the highlight div
    const getHighlightPosition = () => {
        if (selected === 1) return "0%"
        if (selected === 2) return "calc(50% - 37px)"
        if (selected === 3) return "calc(100% - 58px)"
    }

    const getWidth = () => {
        if (selected === 1) return "63px"
        if (selected === 2) return "80px"
        if (selected === 3) return "58px"
    }

    return (
        <>
            <button 
                className="flex flex-row justify-between items-center cursor-pointer py-4 border-bottom" 
                onClick={handleOpen}
            >
                <p className="subtext">Sex</p>
                <div className="flex justify-center items-center flex-row">
                    <p className="subtext pt-[1px]">{numToLevel(selected)}</p>
                    <Image src="/chevron.svg" alt="" height={32} width={32} />
                </div>
            </button>

            <AnimatePresence>
            {sexOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="w-full h-[100dvh] blur-div z-1000 absolute inset-0 flex justify-center items-center"
                >
                    <motion.dialog 
                        initial={{ y: "50%" }} 
                        animate={{ y: "0%" }} 
                        exit={{ y: "50%" }} 
                        transition={{ ease: [0, 1, .77, .98], duration: 0.5 }}
                        className="bg-[var(--background)] shadow-md rounded-2xl flex flex-col justify-center items-center w-[95%] max-w-md translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2 absolute m-0 p-0"
                    >
                        <div className="h-[72px] flex justify-center items-center rounded-t-2xl bg-[var(--accent)] w-full text-[var(--background)]">
                            <h1 className="subheading">Enter Sex</h1>
                        </div>

                        <div className="bg-[var(--background)] py-20">
                            <div className="relative flex flex-row w-[200px] justify-between items-center">
                                {/* Highlight background */}
                                <motion.div 
                                    className="absolute h-[30px] w-[85px] rounded-md bg-[var(--accent)] z-0" 
                                    animate={{ left: getHighlightPosition(), width: getWidth() }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                                {/* Buttons */}
                                <motion.button
                                    onClick={() => handleChangeLevel(1)}
                                    className="paragraph z-10 w-[60px] text-center cursor-pointer"
                                >
                                    <motion.p style={{ color: selected === 1 ? "white" : "black" }}>Male</motion.p>
                                </motion.button>
                                <motion.button
                                    onClick={() => handleChangeLevel(2)}
                                    className="paragraph z-10 w-[60px] text-center cursor-pointer"
                                >
                                    <motion.p style={{ color: selected === 2 ? "white" : "black" }}>Female</motion.p>
                                </motion.button>
                                <motion.button
                                    onClick={() => handleChangeLevel(3)}
                                    className="paragraph z-10 w-[60px] text-center cursor-pointer"
                                >
                                    <motion.p style={{ color: selected === 3 ? "white" : "black" }}>Other</motion.p>
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex rounded-b-2xl w-full dialog-footer">
                            <button 
                                onClick={handleClose} 
                                className="w-1/2 paragraph font-semibold dialog-close py-5 cursor-pointer"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleSave} 
                                className="w-1/2 paragraph text-[var(--accent)] font-semibold py-5 cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                    </motion.dialog>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    )
}
