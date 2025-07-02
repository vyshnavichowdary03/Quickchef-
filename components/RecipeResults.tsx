'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import toast from 'react-hot-toast';

interface RecipeResultsProps {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  onAddToFavorites: (recipe: Recipe) => void;
  onStartOver: () => void;
}

export default function RecipeResults({
  recipes,
  favoriteRecipes,
  onAddToFavorites,
  onStartOver
}: RecipeResultsProps) {
  const isFavorite = (recipeId: string) => {
    return favoriteRecipes.some(fav => fav.id === recipeId);
  };

  const handleAddToFavorites = (recipe: Recipe) => {
    if (!isFavorite(recipe.id)) {
      onAddToFavorites(recipe);
      toast.success(`${recipe.title} added to favorites!`);
    } else {
      toast.error('Recipe already in favorites!');
    }
  };

  return (
    <section className="py-16 lg:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <button
            onClick={onStartOver}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Try New Ingredients</span>
          </button>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Personalized Indian Recipes
          </h2>
          <p className="text-lg text-muted-foreground">
            Authentic flavors crafted from your ingredients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="recipe-card"
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleAddToFavorites(recipe)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                    isFavorite(recipe.id)
                      ? 'bg-secondary text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-secondary hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(recipe.id) ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.difficulty}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.nutrition.calories} cal</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {ingredient.length > 15 ? `${ingredient.substring(0, 15)}...` : ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        +{recipe.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <button className="w-full btn-primary">
                  View Full Recipe
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No recipes generated yet.</div>
            <div className="text-muted-foreground mt-2">Please try uploading ingredients first.</div>
          </div>
        )}
      </div>
    </section>
  );
}