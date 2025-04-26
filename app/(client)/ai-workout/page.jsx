'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';

const DEFAULT_USER_PROFILE = {
  weight: 73,
  height: 175,
  age: 25,
  fitness_level: "Moderately sporty",
  sex: "Male"
};

export default function AIWorkout() {
  useEffect(() => {
    return () => {
      // Cleanup: make sure to stop the camera when component unmounts
      stopCamera();
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [userProfile] = useState(DEFAULT_USER_PROFILE);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [useSampleResponse, setUseSampleResponse] = useState(true);
  const webcamRef = useRef(null);
  
  useEffect(() => {
    // Cleanup camera when component unmounts
    return () => {
      if (showCamera) {
        stopCamera();
      }
    };
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment'
  };

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowCamera(false);
    }
  }, [webcamRef]);

  const generateWorkout = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      setError('Please take a picture first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Convert base64 to blob
      const base64Data = capturedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());

      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'equipment.jpg');
      formData.append('userProfile', JSON.stringify(userProfile));
      formData.append('useSampleResponse', useSampleResponse);

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

  const renderWorkoutPlan = () => {
    if (!result) return null;

    return (
      <div className="space-y-6 text-gray-800">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Equipment Image</h3>
          {capturedImage && (
            <div className="relative w-full h-[300px] mb-4">
              <Image
                src={capturedImage}
                alt="Captured equipment"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{result.name_of_equipment}</h2>
          <p className="mt-2 text-gray-600">{result.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Primary Muscles</h3>
            <ul className="list-disc list-inside text-gray-600">
              {result.targeted_muscles.primary.map((muscle, i) => (
                <li key={i}>{muscle}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Secondary Muscles</h3>
            <ul className="list-disc list-inside text-gray-600">
              {result.targeted_muscles.secondary.map((muscle, i) => (
                <li key={i}>{muscle}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Workout Sets</h3>
          <div className="grid gap-3">
            {result.recommended_repetitions.map((set, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="font-medium">Set:</span> {set.set}</div>
                  <div><span className="font-medium">Type:</span> {set.type}</div>
                  <div><span className="font-medium">Weight:</span> {set.weight}</div>
                  <div><span className="font-medium">Reps:</span> {set.repetitions}</div>
                  <div className="col-span-2"><span className="font-medium">Rest:</span> {set.rest_time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Form Tips</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {result.form_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Safety Considerations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {result.safety_considerations.map((safety, i) => (
                <li key={i}>{safety}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Recommended Warm-up</h3>
            <p className="text-gray-600">{result.recommended_warmup}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Development Toggle */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSampleResponse}
              onChange={(e) => setUseSampleResponse(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-yellow-800">
              Use sample response (development only)
            </span>
          </label>
        </div>

        {/* Camera UI */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Take a Picture of Equipment</h2>
          
          {showCamera ? (
            <div className="space-y-4">
              <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={captureImage}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Picture
              </button>
              <button
                onClick={stopCamera}
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {capturedImage ? (
                <div>
                  <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={capturedImage}
                      alt="Captured equipment"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      startCamera();
                    }}
                    className="mt-4 w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retake Picture
                  </button>
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Camera
                </button>
              )}
            </div>
          )}
        </div>



        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generateWorkout}
          disabled={loading || !capturedImage}
          className={`w-full py-3 px-4 rounded-lg text-white transition-colors ${
            loading || !capturedImage
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Workout Plan'}
        </button>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generating your workout plan...</p>
          </div>
        )}

        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">User Profile</h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700">
            <div>Weight: {userProfile.weight} kg</div>
            <div>Height: {userProfile.height} cm</div>
            <div>Age: {userProfile.age} years</div>
            <div>Fitness Level: {userProfile.fitness_level}</div>
            <div>Sex: {userProfile.sex}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Equipment Image</h2>
          <div className="relative w-full h-[300px]">
            <Image
              src="/sampleimage/benchpress.jpg"
              alt="Bench Press Equipment"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={generateWorkout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Workout Plan'}
        </button>

        {error && (
          <div className="text-red-600 p-4 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {result && (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Workout Plan</h2>
            {renderWorkoutPlan()}
          </div>
        )}
      </div>
    </div>
  );
}
