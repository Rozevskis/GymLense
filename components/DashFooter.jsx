'use client';
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function DashFooter({ activePage }) {
    console.log(activePage)
    return (
        <motion.footer 
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ ease: [0,1,.77,.98], duration: 0.7 }}
        className="w-full max-w-lg p-2 fixed bottom-0 z-500">
            <nav className="bg-[var(--accent)] h-[64px] rounded-full flex justify-evenly items-center">
                <Link href="/signin"><motion.img 
                initial={ activePage === "/dash/history" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }  
                animate={ activePage === "/dash/history" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }
                src="/routine.svg" height={48} width={48} alt="" /></Link>
                <Link href="/dash/camera"><motion.img 
                initial={ activePage == "/dash/camera" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }  
                animate={ activePage == "/dash/camera" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }
                src="/camera.svg" height={48} width={48} alt="" /></Link>
                <Link href="/dash/user"><motion.img 
                initial={ activePage == "/dash/user" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }  
                animate={ activePage == "/dash/user" ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 } }
                src="/user.svg" height={48} width={48} alt="" /></Link>
            </nav>
        </motion.footer>
    )
}