"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

export default function Camera() {
    return (
        <section className="w-full px-2">
            {/* camera container */}
            <div className="h-[80dvh] bg-[var(--background-darker)] rounded-4xl p-4 flex flex-row justify-between">
                {/* <div className="flex flex-col justify-between  h-full">
                <Image src="/camera-corner.svg" height={64} width={64} alt="" />
                <Image src="/camera-corner.svg" height={64} width={64} alt="" />
                <Image src="/camera-corner.svg" className="rotate-270" height={64} width={64} alt="" />
                </div>
                <div className="flex flex-col justify-between">
                    <Image src="/camera-corner.svg" height={64} width={64} alt="" />
                    <Image src="/camera-corner.svg" className="rotate-270" height={64} width={64} alt="" />
                </div>
                <div className="flex flex-col justify-between h-full">
                    <Image src="/camera-corner.svg" className="rotate-90" height={64} width={64} alt="" />
                    <Image src="/camera-corner.svg" height={64} width={64} alt="" />
                    <Image src="/camera-corner.svg" className="rotate-180" height={64} width={64} alt="" />
                </div> */}
            </div>
            <div className="w-full h-full flex flex-col justify-between items-center"></div>
            <h1 className="heading text-center leading-tight">Ready to take a picture?</h1>
            <div className="text-center flex justify-center items-center">
                <motion.button 
                whileTap={{scale: 0.9}}
                className="rounded-full bg-[var(--accent)] heading text-[var(--background)] h-[25dvh] w-[15dvw] cursor-pointer">Tap</motion.button>
            </div>
        </section>
    )
}

// one sentence that describes all the information in the slide - CLARITY