'use client';

import { Suspense, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function PageLoader({ children }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleLoad = () => {
            setTimeout(() => {
                setIsLoading(false)
            }, 50)
        }

        if (document.readyState === "complete") {
            handleLoad()
        } else {
            window.addEventListener("load", handleLoad)
            return () => window.removeEventListener("load", handleLoad)
        }
    }, [])

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ backdropFilter: "blur(5px)", opacity: 1 }}
                        exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="z-10 absolute inset-0 w-full bg-[var(--background)] flex justify-center items-end"
                    >
                        <div className="pb-35">
                            <motion.img
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="loader"
                                src="/camera-corner.svg"
                                alt="Loader"
                                width={24}
                                height={24}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Suspense goes here */}
            <Suspense fallback={null}>
                {!isLoading && children}
            </Suspense>
        </>
    )
}
