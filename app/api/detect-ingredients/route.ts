import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if Roboflow API key is available
    if (!process.env.ROBOFLOW_API_KEY) {
      console.warn('Roboflow API key not found, using fallback ingredients');
      return NextResponse.json({
        ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice', 'chicken'],
        message: 'Roboflow API key not configured. Using sample ingredients.'
      });
    }

    // Convert image to base64 for Roboflow API
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Call Roboflow API
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

    if (!roboflowResponse.ok) {
      console.error('Roboflow API request failed:', roboflowResponse.status, roboflowResponse.statusText);
      throw new Error(`Roboflow API request failed: ${roboflowResponse.status}`);
    }

    const roboflowData = await roboflowResponse.json();
    
    // Extract ingredient names from predictions
    const ingredients = roboflowData.predictions?.map((prediction: any) => 
      prediction.class || prediction.name
    ) || [];

    // Remove duplicates and filter out low confidence predictions
    const uniqueIngredients = [...new Set(ingredients)].filter(Boolean);

    // If no ingredients detected, return some common ones as fallback
    if (uniqueIngredients.length === 0) {
      return NextResponse.json({
        ingredients: ['tomatoes', 'onions', 'garlic', 'ginger'],
        message: 'No specific ingredients detected. Here are some common ones to get started.'
      });
    }

    return NextResponse.json({ ingredients: uniqueIngredients });
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    
    // Return fallback ingredients in case of error
    return NextResponse.json({
      ingredients: ['tomatoes', 'onions', 'garlic', 'ginger', 'rice'],
      message: 'Using fallback ingredients due to detection error.'
    });
  }
}