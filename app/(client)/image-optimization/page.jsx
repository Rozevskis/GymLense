'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageOptimization() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    fetchImageDetails();
  }, []);

  const fetchImageDetails = async () => {
    try {
      const response = await fetch('/api/ai/generate-workout');
      if (!response.ok) {
        throw new Error('Failed to fetch image details');
      }
      const data = await response.json();
      setImageDetails(data.details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDimensions = (width, height) => {
    if (!width || !height) return 'Unknown';
    return `${width} x ${height}px`;
  };

  console.log('Image Details:', imageDetails);

  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-slate-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 bg-slate-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-8 rounded-lg shadow-md border border-red-200">
            <h2 className="text-red-600 text-xl font-semibold">Error</h2>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Image Optimization Demo</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Original Image</h2>
            <div className="relative w-full h-[300px] mb-4">
              <Image
                src="/sampleimage/benchpress.jpg"
                alt="Original Image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Size:</span> {formatSize(imageDetails?.originalSize)}</p>
              <p><span className="font-medium">Dimensions:</span> {formatDimensions(imageDetails?.originalWidth, imageDetails?.originalHeight)}</p>
            </div>
          </div>

          {/* Optimized Image */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimized Image</h2>
            <div className="relative w-full h-[300px] mb-4">
              <Image
                src={`data:image/${imageDetails.format};base64,${imageDetails.base64Data}`}
                alt="Optimized Image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Size:</span> {formatSize(imageDetails?.optimizedSize)}</p>
              <p><span className="font-medium">Dimensions:</span> {formatDimensions(imageDetails?.optimizedWidth, imageDetails?.optimizedHeight)}</p>
            </div>
          </div>
        </div>

        {/* Optimization Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimization Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Size Reduction</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {formatSize((imageDetails?.originalSize || 0) - (imageDetails?.optimizedSize || 0))}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Compression Ratio</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{imageDetails?.compressionRatio || 'N/A'}x</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Format</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{(imageDetails?.format || 'Unknown').toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
