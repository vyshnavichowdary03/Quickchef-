import { Recipe } from '@/types/recipe';

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    category: 'Italian',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large eggs',
      '100g Pecorino Romano cheese',
      '2 cloves garlic',
      'Black pepper',
      'Salt'
    ],
    instructions: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions',
      'While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy',
      'In a bowl, whisk together eggs, grated cheese, and black pepper',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to the skillet with pancetta',
      'Remove from heat and quickly stir in egg mixture, adding pasta water as needed',
      'Serve immediately with extra cheese and black pepper'
    ],
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 65,
      fat: 18
    },
    tags: ['pasta', 'italian', 'quick', 'comfort food'],
    rating: 4.8,
    reviews: 324
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 45,
    servings: 6,
    difficulty: 'Medium',
    category: 'Indian',
    ingredients: [
      '2 lbs chicken breast, cubed',
      '1 cup plain yogurt',
      '2 tbsp garam masala',
      '1 can crushed tomatoes',
      '1 cup heavy cream',
      '1 onion, diced',
      '4 cloves garlic',
      '1 inch ginger',
      'Cilantro for garnish'
    ],
    instructions: [
      'Marinate chicken in yogurt and half the garam masala for 30 minutes',
      'Cook marinated chicken in a large skillet until browned',
      'In the same pan, sauté onion, garlic, and ginger until fragrant',
      'Add remaining garam masala and cook for 1 minute',
      'Add crushed tomatoes and simmer for 10 minutes',
      'Stir in cream and cooked chicken',
      'Simmer for 15 minutes until sauce thickens',
      'Garnish with cilantro and serve with rice'
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22
    },
    tags: ['indian', 'curry', 'spicy', 'comfort food'],
    rating: 4.7,
    reviews: 256
  },
  {
    id: '3',
    title: 'Fresh Caesar Salad',
    description: 'Crisp romaine lettuce with homemade Caesar dressing and croutons',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Salad',
    ingredients: [
      '2 heads romaine lettuce',
      '1/2 cup mayonnaise',
      '2 tbsp lemon juice',
      '2 cloves garlic, minced',
      '1 tsp Worcestershire sauce',
      '1/2 cup Parmesan cheese',
      '2 cups croutons',
      'Anchovy fillets (optional)'
    ],
    instructions: [
      'Wash and chop romaine lettuce into bite-sized pieces',
      'Make dressing by whisking together mayo, lemon juice, garlic, and Worcestershire',
      'Add minced anchovies if using',
      'Toss lettuce with dressing until well coated',
      'Top with Parmesan cheese and croutons',
      'Serve immediately'
    ],
    nutrition: {
      calories: 220,
      protein: 8,
      carbs: 15,
      fat: 16
    },
    tags: ['salad', 'healthy', 'quick', 'vegetarian'],
    rating: 4.5,
    reviews: 189
  },
  {
    id: '4',
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 25,
    servings: 24,
    difficulty: 'Easy',
    category: 'Dessert',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Mix flour, baking soda, and salt in a bowl',
      'Cream butter and both sugars until fluffy',
      'Beat in eggs and vanilla',
      'Gradually mix in flour mixture',
      'Stir in chocolate chips',
      'Drop rounded tablespoons onto ungreased baking sheets',
      'Bake 9-11 minutes until golden brown',
      'Cool on baking sheet for 2 minutes before removing'
    ],
    nutrition: {
      calories: 180,
      protein: 2,
      carbs: 26,
      fat: 8
    },
    tags: ['dessert', 'cookies', 'baking', 'sweet'],
    rating: 4.9,
    reviews: 412
  },
  {
    id: '5',
    title: 'Grilled Salmon with Lemon',
    description: 'Perfectly grilled salmon with fresh lemon and herbs',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Seafood',
    ingredients: [
      '4 salmon fillets',
      '2 lemons, sliced',
      '3 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 tsp dried dill',
      'Salt and pepper',
      'Fresh parsley'
    ],
    instructions: [
      'Preheat grill to medium-high heat',
      'Brush salmon with olive oil and season with salt and pepper',
      'Mix garlic and dill with remaining olive oil',
      'Grill salmon for 4-5 minutes per side',
      'Top with garlic-dill mixture and lemon slices',
      'Grill for 2 more minutes',
      'Garnish with fresh parsley and serve'
    ],
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 2,
      fat: 14
    },
    tags: ['seafood', 'healthy', 'grilled', 'low-carb'],
    rating: 4.6,
    reviews: 198
  },
  {
    id: '6',
    title: 'Vegetable Stir Fry',
    description: 'Colorful and nutritious vegetable stir fry with Asian flavors',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Asian',
    ingredients: [
      '2 cups broccoli florets',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup snap peas',
      '3 tbsp soy sauce',
      '2 tbsp sesame oil',
      '1 tbsp cornstarch',
      '2 cloves garlic, minced',
      '1 tsp fresh ginger',
      'Green onions for garnish'
    ],
    instructions: [
      'Heat sesame oil in a large wok or skillet',
      'Add garlic and ginger, stir fry for 30 seconds',
      'Add harder vegetables first (broccoli, carrots)',
      'Stir fry for 2-3 minutes',
      'Add remaining vegetables',
      'Mix soy sauce with cornstarch and add to pan',
      'Stir fry until vegetables are crisp-tender',
      'Garnish with green onions and serve over rice'
    ],
    nutrition: {
      calories: 120,
      protein: 4,
      carbs: 18,
      fat: 5
    },
    tags: ['vegetarian', 'healthy', 'asian', 'quick'],
    rating: 4.4,
    reviews: 167
  }
];