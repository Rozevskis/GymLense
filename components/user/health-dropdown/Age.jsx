"use client"

import { useState } from "react"
import { AnimatePresence,motion } from "framer-motion"

export default function Age({ age = 25 }) {
    const [ageOpen, setAgeOpen] = useState(false)
    const handleClose = () => setAgeOpen(false)
    const handleOpen = () => setAgeOpen(true)

    return (
        <>
            <button className="flex flex-row justify-between items-center cursor-pointer border-bottom py-4" onClick={handleOpen}>
                <p className="subtext">Age</p>
                <div className="flex justify-center items-center flex-row">
                    <p className="subtext pt-[1px]">{age}</p>
                    <Image src="/chevron.svg" alt="" height={32} width={32}/>
                </div>
            </button>
            {ageOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity:1 }} exit={{opacity:0}} className="w-full h-[100dvh] blur-div z-1000 absolute inset-0 flex justify-center items-center">
                    <motion.dialog initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="bg-[var(--background)] shadow-md rounded-2xl flex flex-col justify-center items-center w-[95%] max-w-md translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2 absolute m-0 p-0">
                        <div className="w-full bg-[var(--accent)] text-[var(--background)] rounded-b-xl rounded-t-2xl text-center py-2">
                            <h3 className="subheading">Enter Age</h3>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="py-5">
                                <input type="text" placeholder="25" className="text-center w-[250px] rounded-md py-2 subtext dialog-input" />
                            </div>
                        </div>
                        <div className="flex rounded-b-2xl w-full dialog-footer">
                            <button onClick={handleClose} className="w-1/2 paragraph text-semibold dialog-close py-5 cursor-pointer">Close</button>
                            <button className="w-1/2 paragraph text-[var(--accent)] text-semibold py-5 cursor-pointer">Save</button>
                        </div>
                    </motion.dialog>
                </motion.div>
            )}
        </>
    )
}
