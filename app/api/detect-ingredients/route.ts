import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 2, // Built-in retry mechanism
});

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delayMs = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }
  
  throw lastError!;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, trying Roboflow...');
      return await tryRoboflowDetection(image);
    }

    try {
      // Convert image to base64 for OpenAI Vision API
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = image.type || 'image/jpeg';

      console.log('Attempting OpenAI Vision API call with retry logic...');

      // Call OpenAI Vision API with retry logic
      const response = await retryWithBackoff(async () => {
        return await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image carefully and identify ALL visible food ingredients, vegetables, fruits, spices, grains, proteins, and cooking ingredients.

Please return ONLY a JSON array of ingredient names in lowercase, like this format:
["tomatoes", "onions", "garlic", "ginger", "rice", "chicken", "cilantro"]

Look for:
- Fresh vegetables and fruits (be specific: "red bell peppers", "green beans", etc.)
- Grains, legumes, and cereals
- Proteins (meat, fish, eggs, dairy products)
- Spices and herbs (both whole and ground)
- Cooking oils, sauces, and condiments
- Any packaged food items with visible labels
- Dried ingredients like lentils, beans, nuts

Be very specific and detailed. If you see different varieties or colors of the same ingredient, list them separately (e.g., "red onions", "white onions"). Include everything you can identify, even if partially visible.`
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
          max_tokens: 800,
          temperature: 0.1,
        });
      }, 3, 2000); // 3 retries with 2 second base delay

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI Vision API');
      }

      console.log('OpenAI Vision response:', content);

      // Parse the JSON response
      let ingredients;
      try {
        // Clean the response in case there's extra text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        ingredients = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', content);
        // Try to extract ingredients from text if JSON parsing fails
        const lines = content.split('\n');
        const extractedIngredients = [];
        
        for (const line of lines) {
          // Look for ingredient-like words
          const matches = line.match(/[a-zA-Z\s]{3,25}/g);
          if (matches) {
            extractedIngredients.push(...matches);
          }
        }
        
        ingredients = extractedIngredients
          .map(item => item.trim().toLowerCase())
          .filter(item => item.length > 2 && item.length < 30)
          .slice(0, 15);
      }

      // Validate and clean ingredients array
      if (!Array.isArray(ingredients)) {
        console.error('Invalid ingredients format from OpenAI');
        throw new Error('Invalid ingredients format from OpenAI');
      }

      // Filter and clean ingredients
      const cleanedIngredients = ingredients
        .filter(ingredient => typeof ingredient === 'string' && ingredient.trim().length > 0)
        .map(ingredient => ingredient.trim().toLowerCase())
        .filter(ingredient => ingredient.length > 1 && ingredient.length < 30)
        .slice(0, 20); // Increased limit to 20 ingredients

      // Remove duplicates
      const uniqueIngredients = [...new Set(cleanedIngredients)];

      console.log('Detected ingredients:', uniqueIngredients);

      // If no ingredients detected, return some common ones as fallback
      if (uniqueIngredients.length === 0) {
        console.log('No ingredients detected, using fallback');
        return NextResponse.json({
          ingredients: ['tomatoes', 'onions', 'garlic', 'ginger'],
          message: 'No specific ingredients detected in the image. Here are some common ones to get started.'
        });
      }

      return NextResponse.json({ 
        ingredients: uniqueIngredients,
        message: `Successfully detected ${uniqueIngredients.length} ingredients from your image using OpenAI Vision.`
      });

    } catch (apiError) {
      console.error('OpenAI Vision API call failed after retries:', apiError);
      
      // Check if it's a network-related error
      const errorMessage = (apiError as Error).message.toLowerCase();
      if (errorMessage.includes('connection') || errorMessage.includes('socket') || errorMessage.includes('network')) {
        console.log('Network error detected, falling back to Roboflow...');
      } else {
        console.log('API error detected, falling back to Roboflow...');
      }
      
      return await tryRoboflowDetection(image);
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

async function tryRoboflowDetection(image: File) {
  if (!process.env.ROBOFLOW_API_KEY) {
    console.warn('Roboflow API key not found');
    return NextResponse.json({
      ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice', 'chicken'],
      message: 'No API keys configured. Using sample ingredients.'
    });
  }

  try {
    console.log('Attempting Roboflow API call with retry logic...');
    console.log('API Key (first 10 chars):', process.env.ROBOFLOW_API_KEY.substring(0, 10));
    
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Try different Roboflow endpoints that might work with your account
    const endpoints = [
      'food-ingredients-v1/1',
      'ingredients-detection/1',
      'food-detection/1', 
      'grocery-detection/1',
      'vegetable-detection/1',
      'food-items/1',
      'kitchen-ingredients/1'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Roboflow endpoint: ${endpoint}`);
        
        const roboflowResponse = await retryWithBackoff(async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000); // Increased timeout to 25 seconds
          
          try {
            const response = await fetch(
              `https://detect.roboflow.com/${endpoint}?api_key=${process.env.ROBOFLOW_API_KEY}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: base64,
                signal: controller.signal,
              }
            );
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        }, 3, 4000); // Increased to 3 retries with 4 second base delay

        console.log(`Roboflow response status for ${endpoint}:`, roboflowResponse.status);
        
        if (roboflowResponse.ok) {
          const roboflowData = await roboflowResponse.json();
          console.log('Roboflow response data:', JSON.stringify(roboflowData, null, 2));
          
          // Extract ingredients from predictions
          const ingredients = roboflowData.predictions?.map((prediction: any) => {
            // Try different property names that Roboflow might use
            return prediction.class || prediction.name || prediction.label || prediction.category;
          }).filter(Boolean) || [];
          
          const uniqueIngredients = [...new Set(ingredients)]
            .map(ingredient => ingredient.toLowerCase().trim())
            .filter(ingredient => ingredient.length > 1);
          
          if (uniqueIngredients.length > 0) {
            console.log(`Successfully detected ingredients with Roboflow (${endpoint}):`, uniqueIngredients);
            return NextResponse.json({ 
              ingredients: uniqueIngredients,
              message: `Successfully detected ${uniqueIngredients.length} ingredients using Roboflow.`
            });
          }
        } else {
          const errorText = await roboflowResponse.text();
          console.error(`Roboflow ${endpoint} error (${roboflowResponse.status}):`, errorText);
          
          // If it's a 404, the endpoint doesn't exist, continue to next
          // If it's a 403, there might be an auth issue
          if (roboflowResponse.status === 403) {
            console.error('Roboflow 403 error - check API key permissions and model access');
          }
        }
      } catch (endpointError) {
        console.error(`Error with Roboflow endpoint ${endpoint} after retries:`, endpointError);
      }
    }

    // If all Roboflow endpoints failed, try to get available models with retry
    try {
      console.log('Trying to get available Roboflow models...');
      const modelsResponse = await retryWithBackoff(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
          const response = await fetch(
            `https://api.roboflow.com/models?api_key=${process.env.ROBOFLOW_API_KEY}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }, 2, 2000); // 2 retries with 2 second base delay
      
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        console.log('Available Roboflow models:', JSON.stringify(modelsData, null, 2));
      }
    } catch (modelsError) {
      console.error('Error fetching Roboflow models after retries:', modelsError);
    }

    // If all endpoints failed
    return NextResponse.json({
      ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice'],
      message: 'Roboflow API access failed for all endpoints after retries. Using fallback ingredients.'
    });

  } catch (roboflowError) {
    console.error('Roboflow detection failed after retries:', roboflowError);
    return NextResponse.json({
      ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice'],
      message: 'Ingredient detection service unavailable after retries. Using sample ingredients.'
    });
  }
}