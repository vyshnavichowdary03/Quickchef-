import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback recipes');
      return getFallbackRecipes(ingredients);
    }

    const prompt = `Create 3-5 diverse and authentic Indian recipes using these specific ingredients: ${ingredients.join(', ')}.

IMPORTANT REQUIREMENTS:
1. Each recipe must use at least 3-4 of the provided ingredients
2. Create varied recipes (different cooking styles: curry, dal, rice dish, stir-fry, etc.)
3. Make recipes authentic to different Indian regions
4. Ensure recipes are practical and achievable
5. Include proper Indian spice combinations

For each recipe, provide:
- A creative and authentic Indian recipe name
- A detailed description (3-4 sentences) explaining the dish and its origin/style
- Difficulty level (Easy, Medium, or Hard)
- Cooking time in minutes (realistic timing)
- Number of servings
- Complete ingredient list with proper measurements
- Detailed step-by-step cooking instructions (at least 6-8 steps)
- Accurate nutritional information
- Relevant tags for the dish

Return ONLY valid JSON in this exact format:
[
  {
    "id": "unique-id-1",
    "title": "Recipe Name",
    "description": "Detailed description of the dish, its flavors, and cooking style",
    "difficulty": "Easy|Medium|Hard",
    "cookTime": 30,
    "servings": 4,
    "ingredients": [
      "2 cups basmati rice",
      "1 large onion, sliced",
      "3 cloves garlic, minced"
    ],
    "instructions": [
      "Heat oil in a heavy-bottomed pot over medium heat",
      "Add cumin seeds and let them splutter for 30 seconds"
    ],
    "nutrition": {
      "calories": 320,
      "protein": 12,
      "carbs": 45,
      "fat": 8
    },
    "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

Make each recipe unique and ensure they showcase different Indian cooking techniques and regional styles.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a master Indian chef with expertise in regional cuisines from across India. You create authentic, detailed recipes that are both traditional and practical for home cooking. Always respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    let recipes;
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      recipes = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate that we have an array of recipes
    if (!Array.isArray(recipes)) {
      throw new Error('Expected array of recipes');
    }

    // Validate and enhance each recipe
    const validatedRecipes = recipes.map((recipe, index) => ({
      id: recipe.id || `recipe-${Date.now()}-${index}`,
      title: recipe.title || 'Indian Recipe',
      description: recipe.description || 'A delicious Indian dish made with fresh ingredients.',
      difficulty: ['Easy', 'Medium', 'Hard'].includes(recipe.difficulty) ? recipe.difficulty : 'Medium',
      cookTime: typeof recipe.cookTime === 'number' ? recipe.cookTime : 30,
      servings: typeof recipe.servings === 'number' ? recipe.servings : 4,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      nutrition: {
        calories: recipe.nutrition?.calories || 250,
        protein: recipe.nutrition?.protein || 8,
        carbs: recipe.nutrition?.carbs || 35,
        fat: recipe.nutrition?.fat || 6
      },
      image: recipe.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    }));

    return NextResponse.json(validatedRecipes);
  } catch (error) {
    console.error('Error generating recipes:', error);
    
    // Return fallback recipes in case of error
    return getFallbackRecipes(ingredients);
  }
}

function getFallbackRecipes(ingredients: string[]) {
  const fallbackRecipes = [
    {
      id: 'fallback-1',
      title: `Mixed Vegetable Curry with ${ingredients.slice(0, 2).join(' and ')}`,
      description: 'A hearty and flavorful curry made with fresh vegetables and aromatic Indian spices. This comforting dish brings together the natural flavors of your ingredients in a rich, spiced gravy.',
      difficulty: 'Easy',
      cookTime: 25,
      servings: 4,
      ingredients: [
        `2 cups ${ingredients[0] || 'mixed vegetables'}`,
        `1 large ${ingredients[1] || 'onion'}, chopped`,
        `3 cloves ${ingredients[2] || 'garlic'}, minced`,
        '1 tsp turmeric powder',
        '1 tsp cumin powder',
        '1 tsp coriander powder',
        'Salt to taste',
        '2 tbsp cooking oil',
        '1 cup water or broth'
      ],
      instructions: [
        'Heat oil in a large pan over medium heat',
        'Add chopped onions and sauté until golden brown',
        'Add minced garlic and cook for 1 minute until fragrant',
        'Add turmeric, cumin, and coriander powder, stir for 30 seconds',
        'Add the main vegetables and mix well with spices',
        'Pour in water or broth and bring to a boil',
        'Reduce heat, cover and simmer for 15-20 minutes until vegetables are tender',
        'Season with salt and serve hot with rice or bread'
      ],
      nutrition: {
        calories: 180,
        protein: 6,
        carbs: 25,
        fat: 8
      },
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'fallback-2',
      title: `Spiced ${ingredients[0] || 'Vegetable'} Rice`,
      description: 'A fragrant one-pot rice dish infused with whole spices and fresh ingredients. This aromatic recipe transforms simple ingredients into a satisfying and flavorful meal.',
      difficulty: 'Medium',
      cookTime: 35,
      servings: 4,
      ingredients: [
        '2 cups basmati rice',
        `1 cup ${ingredients[0] || 'vegetables'}, diced`,
        `1 medium ${ingredients[1] || 'onion'}, sliced`,
        '2 bay leaves',
        '4-5 green cardamom pods',
        '1 cinnamon stick',
        '1 tsp cumin seeds',
        '3 cups water',
        'Salt to taste',
        '3 tbsp ghee or oil'
      ],
      instructions: [
        'Wash and soak basmati rice for 30 minutes, then drain',
        'Heat ghee in a heavy-bottomed pot over medium heat',
        'Add bay leaves, cardamom, cinnamon, and cumin seeds',
        'When spices splutter, add sliced onions and cook until golden',
        'Add diced vegetables and sauté for 5 minutes',
        'Add the soaked rice and gently mix for 2 minutes',
        'Pour in water, add salt, and bring to a boil',
        'Reduce heat to low, cover tightly and cook for 18-20 minutes',
        'Let it rest for 5 minutes before serving'
      ],
      nutrition: {
        calories: 320,
        protein: 8,
        carbs: 58,
        fat: 7
      },
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return NextResponse.json(fallbackRecipes);
}