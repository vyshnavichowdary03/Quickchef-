'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageUpload from '@/components/ImageUpload';
import IngredientDisplay from '@/components/IngredientDisplay';
import RecipeResults from '@/components/RecipeResults';
import FavoriteRecipes from '@/components/FavoriteRecipes';
import Footer from '@/components/Footer';
import { Recipe } from '@/types/recipe';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'ingredients' | 'recipes'>('upload');

  const handleIngredientsDetected = (detectedIngredients: string[]) => {
    setIngredients(detectedIngredients);
    setCurrentStep('ingredients');
  };

  const handleGenerateRecipes = async (finalIngredients: string[]) => {
    setIsLoading(true);
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
    } catch (error) {
      console.error('Error generating recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = (recipe: Recipe) => {
    if (!favoriteRecipes.find(fav => fav.id === recipe.id)) {
      setFavoriteRecipes(prev => [...prev, recipe]);
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
    <div className="min-h-screen bg-background spice-pattern">
      <Header />
      
      {currentStep === 'upload' && (
        <>
          <Hero />
          <ImageUpload onIngredientsDetected={handleIngredientsDetected} />
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
    </div>
  );
}