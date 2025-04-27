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
        weight: null,
        height: null,
        age: null,
        fitnessLevel: null,
        sex: null
    })
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData()
    }, [])

    const toggleOpen = () => setIsOpen(!isOpen)

    // Update user data in the backend
    const updateUserData = async (overrides = {}) => {
        setUpdating(true)
        try {
            // Get the latest state, merging any overrides to avoid stale values
            const latestUserData = { ...userData, ...overrides };
            console.log('Sending data to update (latest state):', latestUserData)
            
            // Create a clean copy of the data to send
            const dataToSend = {
                weight: Number(latestUserData.weight),
                height: Number(latestUserData.height),
                age: Number(latestUserData.age),
                fitnessLevel: latestUserData.fitnessLevel,
                sex: latestUserData.sex
            }
            
            console.log('Cleaned data to send:', dataToSend)
            
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
                // Prevent caching issues
                cache: 'no-store'
            })

            const result = await response.json()
            console.log('Update response:', result)

            if (response.ok) {
                toast.success('Health details updated successfully!')
                
                // Update local state with the returned data to ensure consistency
                if (result.user) {
                    setUserData({
                        weight: result.user.weight,
                        height: result.user.height,
                        age: result.user.age,
                        fitnessLevel: result.user.fitnessLevel,
                        sex: result.user.sex
                    });
                } else {
                    // If no user data returned, fetch fresh data
                    setTimeout(() => {
                        fetchUserData()
                    }, 300)
                }
            } else {
                toast.error(result.error || 'Failed to update health details')
            }
        } catch (error) {
            console.error('Error updating user data:', error)
            toast.error('An error occurred while updating health details')
        } finally {
            setUpdating(false)
        }
    }
    
    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            console.log('Fetching user data...')
            const response = await fetch('/api/user/update', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add cache busting to prevent caching issues
                cache: 'no-store'
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Fetched user data (raw):', data)
                
                // Create the new user data object with no defaults
                const newUserData = {
                    weight: data.weight,
                    height: data.height,
                    age: data.age,
                    fitnessLevel: data.fitnessLevel,
                    sex: data.sex
                }
                
                console.log('Setting user data to:', newUserData)
                console.log('Previous user data was:', userData)
                
                // Update the state with the new data
                setUserData(newUserData)
            } else {
                console.error('Failed to fetch user data')
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
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
            <button className="flex flex-row justify-between items-center cursor-pointer py-4 text-[var(--foreground)]" onClick={toggleOpen}>
                <p className="subheading">Health details</p>
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
