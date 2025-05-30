'use client';

import { useState, useRef, useCallback } from 'react';
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
  const [cameraLoading, setCameraLoading] = useState(true);
  const router = useRouter();
  const [result] = useState(null);

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
    setCameraLoading(true);
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
    <section className="flex flex-col items-center justify-between w-full px-4 py-6">
      {/* Loading overlay for API response */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#a3e635]/20 z-50">
          <div className="relative w-48 h-48">
            <Image 
              src="/lift-unscreen.gif" 
              alt="Loading" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      )}

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
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.06 }}
                />
              )}
            </AnimatePresence>

            {showCamera ? (
              <>
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
                  onUserMedia={() => setCameraLoading(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '1rem',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: cameraLoading ? 0 : 1, // Hide camera until loaded
                  }}
                />
                
                {/* Camera Loading Animation */}
                {cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#a3e635]/20 z-10">
                    <div className="relative w-48 h-48">
                      <Image 
                        src="/lift-unscreen.gif" 
                        alt="Loading" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </>
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
      <div className="w-full flex flex-col items-center space-y-4 mt-6">
        {error && <p className="text-red-500">{error}</p>}
        {showCamera ? (
          <button
            onClick={capture}
            className="w-[90%] py-3 bg-[var(--accent)] text-[var(--accent-darker)] rounded-full cursor-pointer paragraph"
          >
            Take Picture
          </button>
        ) : (
          <div className="w-full flex flex-col items-center space-y-4">
            <button
              onClick={startCamera}
              className="w-[90%] py-3 border border-[var(--accent)] rounded-full cursor-pointer paragraph"
            >
              Retake
            </button>
            <button
              onClick={generateWorkout}
              disabled={loading}
              className="w-[90%] py-3 bg-[var(--accent)] text-[var(--accent-darker)] rounded-full cursor-pointer disabled:bg-[var(--accent-darker)] disabled:text-[var(--accent)] paragraph"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
