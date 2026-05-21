import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { extractTextFromImage, validateExtractedValues, type OCResult } from '../services/ocrService';
import type { CBCValues } from '../types';

interface Props {
  onValuesExtracted: (values: Partial<CBCValues>) => void;
  onClose: () => void;
}

export default function OCRScanner({ onValuesExtracted, onClose }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (imageData: string | File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const ocrResult = await extractTextFromImage(imageData);
      setResult(ocrResult);

      if (!ocrResult.success) {
        setError(ocrResult.error || 'Failed to process image');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setPreviewImage(imageData);
        processImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError('Could not access camera. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setPreviewImage(imageData);
        stopCamera();

        // Convert data URL to File for Tesseract
        fetch(imageData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'capture.png', { type: 'image/png' });
            processImage(file);
          });
      }
    }
  };

  const handleConfirm = () => {
    if (result?.values) {
      onValuesExtracted(result.values);
      onClose();
    }
  };

  const handleRetry = () => {
    setResult(null);
    setPreviewImage(null);
    setError(null);
  };

  const validation = result ? validateExtractedValues(result.values) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Scan Lab Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!result && !isProcessing && (
            <div className="space-y-4">
              {/* Camera Preview */}
              {isCameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <button
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={startCamera}
                      className="flex flex-col items-center gap-2 p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors"
                    >
                      <Camera className="w-8 h-8 text-sky-400" />
                      <span className="text-sm font-medium text-white">Take Photo</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors"
                    >
                      <Upload className="w-8 h-8 text-green-400" />
                      <span className="text-sm font-medium text-white">Upload Image</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Tips */}
                  <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-amber-400 mb-2">Tips for best results:</h3>
                    <ul className="text-sm text-amber-300/80 space-y-1">
                      <li>• Ensure good lighting</li>
                      <li>• Hold camera steady</li>
                      <li>• Make sure all CBC values are visible</li>
                      <li>• Avoid glare and shadows</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Preview Image */}
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Selected"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={handleRetry}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
              <p className="text-white font-medium">Analyzing document...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
            </div>
          )}

          {/* Results */}
          {result && !isProcessing && (
            <div className="space-y-4">
              {/* Status */}
              {validation?.valid ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Successfully extracted values!</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-amber-400 bg-amber-900/20 border border-amber-800/50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Partial extraction</p>
                    <p className="text-sm text-amber-300/80">
                      Found {validation?.found.length || 0} of {validation?.found.length! + validation?.missing.length!} required values.
                      You can fill in the rest manually.
                    </p>
                  </div>
                </div>
              )}

              {/* Extracted Values */}
              {Object.keys(result.values).length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Extracted Values</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.values).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center bg-gray-700/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-gray-400 uppercase">{key}</span>
                        <span className="text-sm font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Text Toggle */}
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                  View raw OCR text
                </summary>
                <pre className="mt-2 p-3 bg-gray-800 rounded-lg text-xs text-gray-400 overflow-auto max-h-32">
                  {result.rawText || 'No text detected'}
                </pre>
              </details>

              {/* Confidence */}
              <p className="text-xs text-gray-500 text-center">
                OCR Confidence: {result.confidence.toFixed(1)}%
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {result && !isProcessing && (
          <div className="flex gap-3 p-4 border-t border-gray-800">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors"
            >
              Use These Values
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
