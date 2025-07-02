'use client';

import { useState } from 'react';
import { Search, Menu, X, ChefHat } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function Header({ onSearch, searchTerm }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">QuickChef</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="search-input w-full pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Recipes
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              About
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-500"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="search-input w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">
                Recipes
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">
                Categories
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors">
                About
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}