'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import Image from 'next/image';

const DEFAULT_USER_PROFILE = {
  weight: 73,
  height: 175,
  age: 25,
  fitness_level: 'Moderately sporty',
  sex: 'Male',
};

export default function AIWorkout() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoConstraints = {
    facingMode: "user"
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCamera(false);

      // Trigger flash animation
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }
  }, [webcamRef]);

  const startCamera = () => {
    setCapturedImage(null);
    setShowCamera(true);
    setResult(null);
    setError('');
  };

  const stopCamera = () => {
    setCapturedImage(null);
    setShowCamera(false);
    setResult(null);
    setError('');
  };

  const generateWorkout = async () => {
    if (!capturedImage) {
      setError('Please take a picture first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const base64Data = capturedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());

      const formData = new FormData();
      formData.append('image', blob, 'equipment.jpg');
      formData.append('userProfile', JSON.stringify(DEFAULT_USER_PROFILE));
      formData.append('useSampleResponse', 'false'); // ✅ REAL detection, not sample

      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col items-center justify-between w-full bg-white px-4 py-6">

      {/* Camera Container */}
      {!result && (
        <div className="flex-1 w-full flex items-center justify-center py-4">
          <div className="w-[90%] h-[60dvh] bg-[var(--background-darker)] rounded-2xl overflow-hidden flex items-center justify-center relative">

            {/* Flash Animation */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  className="absolute inset-0 bg-white z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>


            {showCamera ? (
            <Webcam
            key={showCamera ? 'camera-on' : 'camera-off'}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
                facingMode: { ideal: 'user' },
                width: { ideal: 1280 },
                height: { ideal: 720 },
            }}
            mirrored
            playsInline
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '1rem',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
            />
            
        ) : capturedImage ? (
            <Image
            src={capturedImage}
            alt="Captured"
            fill
            className="object-contain rounded-2xl"
            />
        ) : null}

        {showCamera && (
            <button
            onClick={capture}
            className="absolute bottom-4 w-16 h-16 rounded-full border-4 border-white hover:scale-110 transition-transform duration-300 z-40"
            />
        )}
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      {!result && (
        <div className="w-full flex flex-col items-center space-y-4 mt-4">
          {showCamera ? (
            <button
              onClick={stopCamera}
              className="w-[90%] py-3 border border-black rounded-full cursor-pointer text-black paragraph"
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                onClick={startCamera}
                className="w-[90%] py-3 border border-black rounded-full cursor-pointer text-black paragraph"
              >
                Retake
              </button>
              <button
                onClick={generateWorkout}
                disabled={loading}
                className="w-[90%] py-3 bg-[var(--accent)] text-white rounded-full cursor-pointer disabled:bg-gray-400 paragraph"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Workout Plan Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full bg-[var(--background-darker)] rounded-xl p-6 space-y-6 shadow-lg py-30"
        >
          <h2 className="heading text-center mb-4">{result.name_of_equipment}</h2>
          <p className="text-gray-700 paragraph text-center">{result.description}</p>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className=" mb-2 subheading">Primary Muscles</h3>
              <ul className="list-disc list-inside text-gray-600 paragraph">
                {result.targeted_muscles.primary.map((muscle, idx) => (
                  <li key={idx}>{muscle}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className=" mb-2 subheading">Secondary Muscles</h3>
              <ul className="list-disc list-inside text-gray-600 paragraph">
                {result.targeted_muscles.secondary.map((muscle, idx) => (
                  <li key={idx}>{muscle}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className=" mb-2 subheading">Workout Sets</h3>
            <div className="space-y-3">
              {result.recommended_repetitions.map((set, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg shadow">
                  <div className='paragraph py-1'>Set: {set.set}</div>
                  <div className='paragraph py-1'>Type: {set.type}</div>
                  <div className='paragraph py-1'>Weight: {set.weight}</div>
                  <div className='paragraph py-1'>Reps: {set.repetitions}</div>
                  <div className='paragraph py-1'>Rest: {set.rest_time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="subheading mb-2">Form Tips</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {result.form_tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="subheading mb-2">Safety Considerations</h3>
            <ul className="list-disc list-inside text-gray-600 paragraph">
              {result.safety_considerations.map((safety, idx) => (
                <li key={idx}>{safety}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="subheading mb-2">Recommended Warmup</h3>
            <p className="text-gray-600 paragraph">{result.recommended_warmup}</p>
          </div>

          <button
            onClick={startCamera}
            className="w-full py-3 cursor-pointer text-white rounded-full paragraph bg-[var(--accent)] mt-6"
          >
            Take Another Picture
          </button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 w-[90%] bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
    </section>
  );
}
