"use client"

import { motion } from "motion/react"

export default function LetterStagger({children, targetElement, isInView, className, initialDelay=0}) {
    const words = children.split(" ")
    let globalLetterIndex = 0
    const Element = targetElement
    return (
        <Element className={className}>
            {
                words.map((word,i) => (
                    <span key={i}>
                        <span className="whitespace-pre"> </span>
                        {
                            word.split("").map((letter,j) => {
                                globalLetterIndex++
                                return (
                                    <motion.span className="inline-block whitespace-pre" 
                                    initial={{ opacity:0, translateY: 10 }}
                                    animate= {
                                        isInView ? 
                                        { opacity: 1, translateY: 0 }
                                        :
                                        { opacity:0, translateY: 10 }
                                    } 
                                    transition={{ delay: initialDelay + 0.05 * globalLetterIndex, ease: [0,1.01,1,1], duration: 0.5 }}
                                    key={j}>
                                        {letter}
                                    </motion.span>
                                )
                            })
                        }
                    </span>
                ))
            }
        </Element>
    )
}