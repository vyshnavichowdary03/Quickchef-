'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

interface IngredientDisplayProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onGenerateRecipes: (ingredients: string[]) => void;
  isLoading: boolean;
  onStartOver: () => void;
}

export default function IngredientDisplay({
  ingredients,
  onIngredientsChange,
  onGenerateRecipes,
  isLoading,
  onStartOver
}: IngredientDisplayProps) {
  const [newIngredient, setNewIngredient] = useState('');

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      onIngredientsChange([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <section className="py-16 lg:py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span>Start Over</span>
          </button>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Detected Ingredients
          </h2>
          <p className="text-lg text-muted-foreground">
            Review and modify your ingredients before generating recipes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card rounded-2xl p-8 shadow-lg border border-border"
        >
          {/* Ingredients Display */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Ingredients ({ingredients.length})
            </h3>
            
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-3 mb-6">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="ingredient-chip group"
                  >
                    <span>{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No ingredients detected. Add some ingredients below.
              </p>
            )}
          </div>

          {/* Add New Ingredient */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Add More Ingredients
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add an ingredient..."
                className="flex-1 p-3 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <button
                onClick={addIngredient}
                disabled={!newIngredient.trim()}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Generate Recipes Button */}
          <div className="text-center">
            <button
              onClick={() => onGenerateRecipes(ingredients)}
              disabled={ingredients.length === 0 || isLoading}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Recipes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Indian Recipes</span>
                </>
              )}
            </button>
            
            {ingredients.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                We'll create {Math.min(ingredients.length + 2, 5)} personalized recipes for you
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}