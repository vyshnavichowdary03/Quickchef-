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

    const prompt = `Generate 3-5 authentic Indian recipes using these ingredients: ${ingredients.join(', ')}.

For each recipe, provide:
1. A creative and authentic Indian recipe name
2. A brief description (2-3 sentences)
3. Difficulty level (Easy, Medium, or Hard)
4. Cooking time in minutes
5. Number of servings
6. Complete ingredient list with measurements
7. Step-by-step cooking instructions
8. Nutritional information (calories, protein, carbs, fat)

Format the response as a JSON array of recipe objects with these exact fields:
- id (unique string)
- title (string)
- description (string)
- difficulty (string: "Easy", "Medium", or "Hard")
- cookTime (number in minutes)
- servings (number)
- ingredients (array of strings with measurements)
- instructions (array of strings, each step)
- nutrition (object with calories, protein, carbs, fat as numbers)
- image (use this placeholder: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800")

Make sure the recipes are authentic Indian dishes that can realistically be made with the provided ingredients. Include popular dishes like curries, dal, rice dishes, etc.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Indian chef who creates authentic recipes. Always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    let recipes;
    try {
      recipes = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate that we have an array of recipes
    if (!Array.isArray(recipes)) {
      throw new Error('Expected array of recipes');
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error generating recipes:', error);
    
    // Return fallback recipes in case of error
    const fallbackRecipes = [
      {
        id: '1',
        title: 'Simple Vegetable Curry',
        description: 'A quick and easy curry made with available vegetables and basic spices.',
        difficulty: 'Easy',
        cookTime: 25,
        servings: 4,
        ingredients: [
          '2 cups mixed vegetables',
          '1 onion, chopped',
          '2 cloves garlic',
          '1 tsp turmeric',
          '1 tsp cumin powder',
          'Salt to taste',
          '2 tbsp oil'
        ],
        instructions: [
          'Heat oil in a pan',
          'Add onions and garlic, sauté until golden',
          'Add spices and cook for 1 minute',
          'Add vegetables and cook until tender',
          'Season with salt and serve hot'
        ],
        nutrition: {
          calories: 180,
          protein: 6,
          carbs: 25,
          fat: 8
        },
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ];

    return NextResponse.json(fallbackRecipes);
  }
}