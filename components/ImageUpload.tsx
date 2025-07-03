'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Camera, Upload, Mic, Type, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onIngredientsDetected: (ingredients: string[]) => void;
  trackApiCall: (
    endpoint: 'ingredientDetection' | 'recipeGeneration',
    startTime: number,
    success: boolean,
    apiProvider: 'openai' | 'roboflow' | 'fallback'
  ) => void;
}

export default function ImageUpload({ onIngredientsDetected, trackApiCall }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [manualIngredients, setManualIngredients] = useState('');
  const [isListening, setIsListening] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/detect-ingredients', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to detect ingredients');
      }

      const { ingredients, message } = await response.json();
      onIngredientsDetected(ingredients);
      
      // Determine which API was used based on the message
      let apiProvider: 'openai' | 'roboflow' | 'fallback' = 'fallback';
      if (message?.includes('OpenAI')) {
        apiProvider = 'openai';
      } else if (message?.includes('Roboflow')) {
        apiProvider = 'roboflow';
      }
      
      trackApiCall('ingredientDetection', startTime, true, apiProvider);
      toast.success('Ingredients detected successfully!');
    } catch (error) {
      console.error('Error detecting ingredients:', error);
      trackApiCall('ingredientDetection', startTime, false, 'fallback');
      toast.error('Failed to detect ingredients. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onIngredientsDetected, trackApiCall]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isUploading
  });

  const handleManualSubmit = () => {
    if (!manualIngredients.trim()) {
      toast.error('Please enter some ingredients');
      return;
    }

    const ingredients = manualIngredients
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);

    onIngredientsDetected(ingredients);
    toast.success('Ingredients added successfully!');
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Listening... Speak your ingredients');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setManualIngredients(transcript);
      setIsListening(false);
      toast.success('Voice input captured!');
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Your Culinary Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload an image of your ingredients or type them manually
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-primary" />
                Upload Image
              </h3>
              
              <div
                {...getRootProps()}
                className={`upload-zone ${isDragActive ? 'dragover' : ''} ${isUploading ? 'opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="text-lg font-medium text-foreground">Detecting ingredients...</p>
                    <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse files
                    </p>
                    <button className="btn-primary">
                      Choose Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Manual Input */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Type className="h-5 w-5 mr-2 text-secondary" />
                Type Ingredients
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={manualIngredients}
                    onChange={(e) => setManualIngredients(e.target.value)}
                    placeholder="Enter ingredients separated by commas (e.g., tomatoes, onions, rice, chicken)"
                    className="w-full h-32 p-4 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Mic className={`h-4 w-4 ${isListening ? 'text-secondary animate-pulse' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">
                      {isListening ? 'Listening...' : 'Voice Input'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleManualSubmit}
                    disabled={!manualIngredients.trim()}
                    className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}