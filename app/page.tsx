'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import RecipeGrid from '@/components/RecipeGrid';
import RecipeModal from '@/components/RecipeModal';
import { recipes } from '@/data/recipes';
import { Recipe, RecipeFilters } from '@/types/recipe';

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<RecipeFilters>({
    category: 'All',
    difficulty: 'All',
    maxCookTime: 999,
    searchTerm: ''
  });

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const matchesCategory = filters.category === 'All' || recipe.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'All' || recipe.difficulty === filters.difficulty;
      const matchesCookTime = recipe.cookTime <= filters.maxCookTime;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCookTime;
    });
  }, [filters]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} searchTerm={filters.searchTerm} />
      <Hero />
      <FilterBar filters={filters} onFiltersChange={setFilters} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.searchTerm ? `Search Results for "${filters.searchTerm}"` : 'Featured Recipes'}
          </h2>
          <p className="text-gray-600">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <RecipeGrid recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QuickChef</h3>
              <p className="text-gray-400">
                Discover amazing recipes from around the world and cook with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recipes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Italian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Desserts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quick Meals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuickChef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}