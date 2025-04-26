"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export default function Camera() {
    const [cameraOpen, setCameraOpen] = useState(false)
    const handleOpenCamera = () => {
        setCameraOpen(true)
    }
    return (
        <section className="w-full px-2">
            {/* camera container */}
            <div className="h-[80dvh] bg-[var(--background-darker)] rounded-4xl p-4 shadow-sm">
            </div>
        </section>
    )
}

// one sentence that describes all the information in the slide - CLARITY
// not making workout plans yet, for now just storing history