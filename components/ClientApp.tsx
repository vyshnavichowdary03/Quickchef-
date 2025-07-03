'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import ImageUpload from '@/components/ImageUpload';
import IngredientDisplay from '@/components/IngredientDisplay';
import RecipeResults from '@/components/RecipeResults';
import FavoriteRecipes from '@/components/FavoriteRecipes';
import Footer from '@/components/Footer';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { Recipe } from '@/types/recipe';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

export default function ClientApp() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'ingredients' | 'recipes'>('upload');

  const { trackApiCall, trackUserInteraction } = usePerformanceTracking();

  const handleIngredientsDetected = (detectedIngredients: string[]) => {
    setIngredients(detectedIngredients);
    setCurrentStep('ingredients');
    trackUserInteraction('upload');
  };

  const handleGenerateRecipes = async (finalIngredients: string[]) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: finalIngredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const generatedRecipes = await response.json();
      setRecipes(generatedRecipes);
      setCurrentStep('recipes');
      
      // Track successful API call
      trackApiCall('recipeGeneration', startTime, true, 'openai');
      trackUserInteraction('recipeGenerated');
    } catch (error) {
      console.error('Error generating recipes:', error);
      // Track failed API call
      trackApiCall('recipeGeneration', startTime, false, 'fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = (recipe: Recipe) => {
    if (!favoriteRecipes.find(fav => fav.id === recipe.id)) {
      setFavoriteRecipes(prev => [...prev, recipe]);
      trackUserInteraction('favoriteSaved');
    }
  };

  const handleRemoveFromFavorites = (recipeId: string) => {
    setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const handleStartOver = () => {
    setIngredients([]);
    setRecipes([]);
    setCurrentStep('upload');
  };

  return (
    <>
      {currentStep === 'upload' && (
        <>
          <Hero />
          <ImageUpload 
            onIngredientsDetected={handleIngredientsDetected}
            trackApiCall={trackApiCall}
          />
        </>
      )}

      {currentStep === 'ingredients' && (
        <IngredientDisplay
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          onGenerateRecipes={handleGenerateRecipes}
          isLoading={isLoading}
          onStartOver={handleStartOver}
        />
      )}

      {currentStep === 'recipes' && (
        <RecipeResults
          recipes={recipes}
          favoriteRecipes={favoriteRecipes}
          onAddToFavorites={handleAddToFavorites}
          onStartOver={handleStartOver}
        />
      )}

      {favoriteRecipes.length > 0 && (
        <FavoriteRecipes
          recipes={favoriteRecipes}
          onRemoveFromFavorites={handleRemoveFromFavorites}
        />
      )}

      <Footer />
      <PerformanceMonitor />
    </>
  );
}