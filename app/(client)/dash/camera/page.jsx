'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  const [flash, setFlash] = useState(false);
  const router = useRouter();
  const [result] = useState(null);

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
    setError('');
  };

  const stopCamera = () => {
    setCapturedImage(null);
    setShowCamera(false);
    setError('');
  };

  const generateWorkout = async () => {
    if (!capturedImage) {
      setError('Please take a picture first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const base64Data = capturedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());

      const formData = new FormData();
      formData.append('image', blob, 'equipment.jpg');
      formData.append('userProfile', JSON.stringify(DEFAULT_USER_PROFILE));
      formData.append('useSampleResponse', 'false'); // REAL detection, not sample

      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout');
      }

      const data = await response.json();
      // For some stupid reason this doesn't work here but works in history page
      // router.push(`/dash/history/${data.id}`);
      // Force navigation with window.location instead of router.push
      if (data.id) {
        window.location.href = `/dash/history/${data.id}`;
      }
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
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 },
            }}
            mirrored={false}
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

      {/* Error Message */}
      {error && (
        <div className="mt-4 w-[90%] bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
    </section>
  );
}
