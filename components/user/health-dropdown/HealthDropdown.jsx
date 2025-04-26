"use client"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "react-hot-toast"

import Weight from "@/components/user/health-dropdown/Weight"
import Height from "@/components/user/health-dropdown/Height"
import Sex from "@/components/user/health-dropdown/Sex"
import Age from "@/components/user/health-dropdown/Age"
import FitnessLevel from "@/components/user/health-dropdown/FitnessLevel"

export default function HealthDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [userData, setUserData] = useState({
        weight: 70,
        height: 175,
        age: 25,
        fitnessLevel: "beginner",
        sex: "male"
    })
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/update', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setUserData({
                        weight: data.weight || 70,
                        height: data.height || 175,
                        age: data.age || 25,
                        fitnessLevel: data.fitnessLevel || "beginner",
                        sex: data.sex || "male"
                    })
                } else {
                    console.error('Failed to fetch user data')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const toggleOpen = () => setIsOpen(!isOpen)

    // Update user data in the backend
    const updateUserData = async () => {
        setUpdating(true)
        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (response.ok) {
                toast.success('Health details updated successfully!')
            } else {
                const error = await response.json()
                toast.error(error.message || 'Failed to update health details')
            }
        } catch (error) {
            console.error('Error updating user data:', error)
            toast.error('An error occurred while updating health details')
        } finally {
            setUpdating(false)
        }
    }

    // Handle updates from child components
    const handleWeightChange = (weight) => {
        setUserData(prev => ({ ...prev, weight }))
    }

    const handleHeightChange = (height) => {
        setUserData(prev => ({ ...prev, height }))
    }

    const handleAgeChange = (age) => {
        setUserData(prev => ({ ...prev, age }))
    }

    const handleFitnessLevelChange = (level) => {
        const fitnessLevelMap = {
            1: "beginner",
            2: "intermediate",
            3: "advanced"
        }
        setUserData(prev => ({ ...prev, fitnessLevel: fitnessLevelMap[level] || "beginner" }))
    }

    const handleSexChange = (sex) => {
        setUserData(prev => ({ ...prev, sex }))
    }

    return (
        <div className="flex flex-col w-full p-4">
            {/* Header */}
            <button className="flex flex-row justify-between items-center cursor-pointer py-4" onClick={toggleOpen}>
                <p className="paragraph">Health details</p>
                <motion.img 
                    initial={{ rotate: 0 }} 
                    animate={{ rotate: isOpen ? 90 : 0 }} 
                    transition={{ duration: 0.3 }}
                    src="/arrow.svg"
                    height={36}
                    width={36}
                    alt="Health details dropdown"
                />
            </button>

            {/* Items */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden flex flex-col"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col"
                        >
                            {!loading && (
                                <>
                                    <Weight 
                                        weight={userData.weight} 
                                        onWeightChange={handleWeightChange} 
                                        onSave={updateUserData}
                                    />
                                    <Height 
                                        height={userData.height} 
                                        onHeightChange={handleHeightChange} 
                                        onSave={updateUserData}
                                    />
                                    <Sex 
                                        sex={userData.sex}
                                        onSexChange={handleSexChange}
                                        onSave={updateUserData}
                                    />
                                    <Age 
                                        initialAge={userData.age} 
                                        onAgeChange={handleAgeChange} 
                                        onSave={updateUserData}
                                    />
                                    <FitnessLevel 
                                        fitnessLevel={userData.fitnessLevel} 
                                        onFitnessLevelChange={handleFitnessLevelChange} 
                                        onSave={updateUserData}
                                    />
                                </>
                            )}
                            {loading && (
                                <div className="flex justify-center items-center py-4">
                                    <p className="subtext">Loading health data...</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
