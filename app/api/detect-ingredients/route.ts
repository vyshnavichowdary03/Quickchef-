import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback ingredients');
      return NextResponse.json({
        ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice', 'chicken'],
        message: 'OpenAI API key not configured. Using sample ingredients.'
      });
    }

    try {
      // Convert image to base64 for OpenAI Vision API
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = image.type || 'image/jpeg';

      // Call OpenAI Vision API to detect ingredients
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and identify all the food ingredients, vegetables, fruits, spices, grains, proteins, and other cooking ingredients visible. 

Please return ONLY a JSON array of ingredient names in lowercase, like this format:
["tomatoes", "onions", "garlic", "ginger", "rice", "chicken", "cilantro"]

Focus on:
- Fresh vegetables and fruits
- Grains, legumes, and cereals
- Proteins (meat, fish, eggs, dairy)
- Spices and herbs
- Cooking oils and condiments
- Any packaged food items

Be specific but use common ingredient names that would be used in cooking recipes. If you see multiple varieties of the same ingredient, just list the main ingredient once.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI Vision API');
      }

      // Parse the JSON response
      let ingredients;
      try {
        // Clean the response in case there's extra text
        const jsonMatch = content.match(/\[.*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        ingredients = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        // Try to extract ingredients from text if JSON parsing fails
        const textIngredients = content
          .toLowerCase()
          .split(/[,\n]/)
          .map(item => item.trim().replace(/[^\w\s]/g, ''))
          .filter(item => item.length > 2 && item.length < 30)
          .slice(0, 10);
        
        ingredients = textIngredients.length > 0 ? textIngredients : ['tomatoes', 'onions', 'garlic'];
      }

      // Validate and clean ingredients array
      if (!Array.isArray(ingredients)) {
        throw new Error('Invalid ingredients format from OpenAI');
      }

      // Filter and clean ingredients
      const cleanedIngredients = ingredients
        .filter(ingredient => typeof ingredient === 'string' && ingredient.trim().length > 0)
        .map(ingredient => ingredient.trim().toLowerCase())
        .filter(ingredient => ingredient.length > 1 && ingredient.length < 30)
        .slice(0, 15); // Limit to 15 ingredients max

      // Remove duplicates
      const uniqueIngredients = [...new Set(cleanedIngredients)];

      // If no ingredients detected, return some common ones as fallback
      if (uniqueIngredients.length === 0) {
        return NextResponse.json({
          ingredients: ['tomatoes', 'onions', 'garlic', 'ginger'],
          message: 'No specific ingredients detected in the image. Here are some common ones to get started.'
        });
      }

      return NextResponse.json({ 
        ingredients: uniqueIngredients,
        message: `Detected ${uniqueIngredients.length} ingredients from your image.`
      });

    } catch (apiError) {
      console.error('OpenAI Vision API call failed:', apiError);
      
      // Fallback to Roboflow if available
      if (process.env.ROBOFLOW_API_KEY) {
        try {
          const bytes = await image.arrayBuffer();
          const base64 = Buffer.from(bytes).toString('base64');

          const roboflowResponse = await fetch(
            `https://detect.roboflow.com/ingredients-detection/1?api_key=${process.env.ROBOFLOW_API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: base64,
            }
          );

          if (roboflowResponse.ok) {
            const roboflowData = await roboflowResponse.json();
            const ingredients = roboflowData.predictions?.map((prediction: any) => 
              prediction.class || prediction.name
            ) || [];
            const uniqueIngredients = [...new Set(ingredients)].filter(Boolean);
            
            if (uniqueIngredients.length > 0) {
              return NextResponse.json({ 
                ingredients: uniqueIngredients,
                message: 'Ingredients detected using backup service.'
              });
            }
          }
        } catch (roboflowError) {
          console.warn('Roboflow fallback also failed:', roboflowError);
        }
      }

      // Final fallback
      return NextResponse.json({
        ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice', 'chicken'],
        message: 'Ingredient detection service unavailable. Using sample ingredients.'
      });
    }
  } catch (error) {
    console.error('Error in ingredient detection endpoint:', error);
    
    // Return fallback ingredients in case of any other error
    return NextResponse.json({
      ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice'],
      message: 'Using fallback ingredients due to unexpected error.'
    });
  }
}