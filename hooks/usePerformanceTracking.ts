'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  apiResponseTimes: {
    ingredientDetection: number[];
    recipeGeneration: number[];
    average: number;
  };
  successRates: {
    ingredientDetection: number;
    recipeGeneration: number;
    overall: number;
  };
  userInteractions: {
    totalUploads: number;
    totalRecipesGenerated: number;
    favoritesSaved: number;
    sessionDuration: number;
  };
  systemMetrics: {
    memoryUsage: number;
    networkLatency: number;
    errorRate: number;
    uptime: number;
  };
  apiUsage: {
    openaiCalls: number;
    roboflowCalls: number;
    fallbackUsage: number;
  };
}

export function usePerformanceTracking() {
  const metricsRef = useRef<PerformanceMetrics>({
    apiResponseTimes: {
      ingredientDetection: [],
      recipeGeneration: [],
      average: 0
    },
    successRates: {
      ingredientDetection: 0,
      recipeGeneration: 0,
      overall: 0
    },
    userInteractions: {
      totalUploads: 0,
      totalRecipesGenerated: 0,
      favoritesSaved: 0,
      sessionDuration: 0
    },
    systemMetrics: {
      memoryUsage: 0,
      networkLatency: 0,
      errorRate: 0,
      uptime: Date.now()
    },
    apiUsage: {
      openaiCalls: 0,
      roboflowCalls: 0,
      fallbackUsage: 0
    }
  });

  useEffect(() => {
    // Load existing metrics from localStorage
    const savedMetrics = localStorage.getItem('quickchef-metrics');
    if (savedMetrics) {
      metricsRef.current = JSON.parse(savedMetrics);
    }

    // Set up session start time
    const sessionStart = Date.now();
    
    // Update session duration periodically
    const sessionInterval = setInterval(() => {
      metricsRef.current.userInteractions.sessionDuration = Date.now() - sessionStart;
      saveMetrics();
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(sessionInterval);
    };
  }, []);

  const saveMetrics = () => {
    localStorage.setItem('quickchef-metrics', JSON.stringify(metricsRef.current));
  };

  const trackApiCall = (
    endpoint: 'ingredientDetection' | 'recipeGeneration',
    startTime: number,
    success: boolean,
    apiProvider: 'openai' | 'roboflow' | 'fallback'
  ) => {
    const responseTime = Date.now() - startTime;
    
    // Update response times
    metricsRef.current.apiResponseTimes[endpoint].push(responseTime);
    
    // Keep only last 50 measurements
    if (metricsRef.current.apiResponseTimes[endpoint].length > 50) {
      metricsRef.current.apiResponseTimes[endpoint] = 
        metricsRef.current.apiResponseTimes[endpoint].slice(-50);
    }
    
    // Calculate average
    const allTimes = [
      ...metricsRef.current.apiResponseTimes.ingredientDetection,
      ...metricsRef.current.apiResponseTimes.recipeGeneration
    ];
    metricsRef.current.apiResponseTimes.average = 
      allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : 0;

    // Update success rates
    const currentSuccessRate = metricsRef.current.successRates[endpoint];
    const totalCalls = metricsRef.current.apiResponseTimes[endpoint].length;
    const successfulCalls = Math.round((currentSuccessRate / 100) * (totalCalls - 1)) + (success ? 1 : 0);
    metricsRef.current.successRates[endpoint] = (successfulCalls / totalCalls) * 100;

    // Update overall success rate
    const totalIngredientCalls = metricsRef.current.apiResponseTimes.ingredientDetection.length;
    const totalRecipeCalls = metricsRef.current.apiResponseTimes.recipeGeneration.length;
    const totalSuccessfulCalls = 
      Math.round((metricsRef.current.successRates.ingredientDetection / 100) * totalIngredientCalls) +
      Math.round((metricsRef.current.successRates.recipeGeneration / 100) * totalRecipeCalls);
    const totalAllCalls = totalIngredientCalls + totalRecipeCalls;
    metricsRef.current.successRates.overall = 
      totalAllCalls > 0 ? (totalSuccessfulCalls / totalAllCalls) * 100 : 0;

    // Update API usage
    metricsRef.current.apiUsage[apiProvider]++;

    // Update error rate
    if (!success) {
      const totalErrors = Math.round((metricsRef.current.systemMetrics.errorRate / 100) * (totalAllCalls - 1)) + 1;
      metricsRef.current.systemMetrics.errorRate = (totalErrors / totalAllCalls) * 100;
    }

    saveMetrics();
  };

  const trackUserInteraction = (action: 'upload' | 'recipeGenerated' | 'favoriteSaved') => {
    switch (action) {
      case 'upload':
        metricsRef.current.userInteractions.totalUploads++;
        break;
      case 'recipeGenerated':
        metricsRef.current.userInteractions.totalRecipesGenerated++;
        break;
      case 'favoriteSaved':
        metricsRef.current.userInteractions.favoritesSaved++;
        break;
    }
    saveMetrics();
  };

  const getMetrics = () => metricsRef.current;

  return {
    trackApiCall,
    trackUserInteraction,
    getMetrics
  };
}