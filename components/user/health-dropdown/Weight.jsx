"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

export default function WeightPicker({ weight, onWeightChange, onSave }) {
    const [weightOpen, setWeightOpen] = useState(false)
    const [selectedWeight, setSelectedWeight] = useState(weight || '')

    // Update selected weight when prop changes
    useEffect(() => {
        if (weight !== undefined) {
            setSelectedWeight(weight)
        }
    }, [weight])

    const handleClose = () => setWeightOpen(false)
    const handleOpen = () => setWeightOpen(true)

    const handleSave = () => {
        const currentValue = Number(selectedWeight);
        console.log('Weight - Saving value:', currentValue);
        if (onWeightChange) {
            onWeightChange(currentValue);
        }
        setWeightOpen(false);
        if (onSave) {
            onSave({ weight: currentValue });
        }
    }

    const handleWeightChange = (e) => {
        const newValue = e.target.value;
        console.log('Weight - Input changed to:', newValue);
        setSelectedWeight(newValue);
    }

    return (
        <>
            <button 
                className="flex flex-row justify-between items-center cursor-pointer border-bottom py-4 text-[var(--foreground-darker)]" 
                onClick={handleOpen}
            >
                <p className="paragraph">Weight</p>
                <div className="flex justify-center items-center flex-row">
                    <p className="paragraph pt-[1px]">{selectedWeight} kg</p>
                    <Image src="/chevron.svg" alt="" height={32} width={32} />
                </div>
            </button>

            <AnimatePresence>
            {weightOpen && (
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
                            <h1 className="subheading text-[var(--accent-darker)]">Enter Weight</h1>
                        </div>

                        <div className="bg-[var(--background)] py-20">
                            <div>
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="500" 
                                    className="py-2 w-[350px] paragraph age-input dialog-input text-[var(--foreground)]" 
                                    value={selectedWeight}
                                    onChange={handleWeightChange}
                                />
                            </div>
                        </div>

                        <div className="flex rounded-b-2xl w-full dialog-footer">
                            <button 
                                onClick={handleClose} 
                                className="w-1/2 paragraph dialog-close py-5 cursor-pointer text-[var(--foreground)]"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleSave} 
                                className="w-1/2 paragraph text-[var(--accent)] py-5 cursor-pointer"
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
