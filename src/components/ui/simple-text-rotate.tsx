"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface SimpleTextRotateProps {
  texts: string[]
  interval?: number
  className?: string
}

export function SimpleTextRotate({ texts, interval = 2000, className = "" }: SimpleTextRotateProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (texts.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
