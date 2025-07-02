'use client';

import { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';

interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

export default function RecipeGrid({ recipes, onRecipeClick }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No recipes found matching your criteria.</div>
        <div className="text-gray-400 mt-2">Try adjusting your filters or search terms.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <RecipeCard recipe={recipe} onClick={onRecipeClick} />
        </motion.div>
      ))}
    </div>
  );
}