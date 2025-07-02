'use client';

import { motion } from 'framer-motion';
import { Camera, Type, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-pattern py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">Discover Authentic</span>
              <br />
              <span className="text-foreground">Indian Recipes</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload a photo of your ingredients and let AI create personalized Indian recipes 
              that transform your pantry into a feast of flavors
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="p-3 bg-primary/10 rounded-full">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium">Upload Ingredients</span>
            </div>
            <div className="hidden sm:block w-8 h-px bg-border"></div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <span className="font-medium">AI Detection</span>
            </div>
            <div className="hidden sm:block w-8 h-px bg-border"></div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="p-3 bg-accent/10 rounded-full">
                <Type className="h-6 w-6 text-accent" />
              </div>
              <span className="font-medium">Get Recipes</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Delicious Indian curry with rice and vegetables"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold mb-2">From Your Ingredients</h3>
                <p className="text-white/90">To Authentic Indian Flavors</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}