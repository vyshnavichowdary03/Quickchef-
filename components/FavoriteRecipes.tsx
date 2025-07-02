'use client';

import { motion } from 'framer-motion';
import { Heart, Trash2, Clock, Users } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import toast from 'react-hot-toast';

interface FavoriteRecipesProps {
  recipes: Recipe[];
  onRemoveFromFavorites: (recipeId: string) => void;
}

export default function FavoriteRecipes({ recipes, onRemoveFromFavorites }: FavoriteRecipesProps) {
  const handleRemove = (recipe: Recipe) => {
    onRemoveFromFavorites(recipe.id);
    toast.success(`${recipe.title} removed from favorites`);
  };

  if (recipes.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-secondary fill-current" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Favorite Recipes
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Saved recipes you can cook anytime
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-lg border border-border card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                  {recipe.title}
                </h3>
                <button
                  onClick={() => handleRemove(recipe)}
                  className="p-1 text-muted-foreground hover:text-secondary transition-colors ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.cookTime}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings}</span>
                </div>
                <span className="font-medium">{recipe.difficulty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}