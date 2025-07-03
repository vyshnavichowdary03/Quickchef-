'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users,
  Image,
  Zap,
  Server,
  Wifi,
  AlertTriangle
} from 'lucide-react';

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

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
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
      uptime: 0
    },
    apiUsage: {
      openaiCalls: 0,
      roboflowCalls: 0,
      fallbackUsage: 0
    }
  });

  const [isVisible, setIsVisible] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  useEffect(() => {
    // Load metrics from localStorage
    const savedMetrics = localStorage.getItem('quickchef-metrics');
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    }

    // Start performance monitoring
    const interval = setInterval(() => {
      updateSystemMetrics();
    }, 5000);

    // Monitor network performance
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setMetrics(prev => ({
        ...prev,
        systemMetrics: {
          ...prev.systemMetrics,
          networkLatency: connection.rtt || 0
        }
      }));
    }

    return () => clearInterval(interval);
  }, []);

  const updateSystemMetrics = () => {
    // Simulate system metrics (in a real app, these would come from actual monitoring)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? 
      Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 
      Math.random() * 100;

    setMetrics(prev => ({
      ...prev,
      systemMetrics: {
        ...prev.systemMetrics,
        memoryUsage,
        uptime: Date.now() - (prev.systemMetrics.uptime || Date.now())
      }
    }));
  };

  const getPerformanceGrade = () => {
    const avgResponseTime = metrics.apiResponseTimes.average;
    const successRate = metrics.successRates.overall;
    const errorRate = metrics.systemMetrics.errorRate;

    if (avgResponseTime < 2000 && successRate > 95 && errorRate < 5) return 'A+';
    if (avgResponseTime < 3000 && successRate > 90 && errorRate < 10) return 'A';
    if (avgResponseTime < 5000 && successRate > 85 && errorRate < 15) return 'B';
    if (avgResponseTime < 8000 && successRate > 75 && errorRate < 25) return 'C';
    return 'D';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors z-50"
        title="Show Performance Metrics"
      >
        <Activity className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
              <p className="text-muted-foreground">Real-time application metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                getPerformanceGrade().startsWith('A') ? 'text-green-500' :
                getPerformanceGrade() === 'B' ? 'text-yellow-500' :
                getPerformanceGrade() === 'C' ? 'text-orange-500' : 'text-red-500'
              }`}>
                {getPerformanceGrade()}
              </div>
              <div className="text-xs text-muted-foreground">Performance Grade</div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* API Response Times */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Response Time</h3>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatDuration(metrics.apiResponseTimes.average)}
            </div>
            <div className="text-sm text-muted-foreground">Average API response</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Ingredient Detection</span>
                <span>{formatDuration(metrics.apiResponseTimes.ingredientDetection.slice(-1)[0] || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Recipe Generation</span>
                <span>{formatDuration(metrics.apiResponseTimes.recipeGeneration.slice(-1)[0] || 0)}</span>
              </div>
            </div>
          </div>

          {/* Success Rates */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Success Rate</h3>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metrics.successRates.overall.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Overall success rate</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Ingredient Detection</span>
                <span>{metrics.successRates.ingredientDetection.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Recipe Generation</span>
                <span>{metrics.successRates.recipeGeneration.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* User Interactions */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-foreground">User Activity</h3>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metrics.userInteractions.totalUploads}
            </div>
            <div className="text-sm text-muted-foreground">Total uploads</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Recipes Generated</span>
                <span>{metrics.userInteractions.totalRecipesGenerated}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Favorites Saved</span>
                <span>{metrics.userInteractions.favoritesSaved}</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Server className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-foreground">System Health</h3>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metrics.systemMetrics.memoryUsage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Memory usage</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Network Latency</span>
                <span>{metrics.systemMetrics.networkLatency}ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Error Rate</span>
                <span>{metrics.systemMetrics.errorRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Usage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              API Usage Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">OpenAI Vision API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(metrics.apiUsage.openaiCalls / Math.max(1, metrics.apiUsage.openaiCalls + metrics.apiUsage.roboflowCalls + metrics.apiUsage.fallbackUsage)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.apiUsage.openaiCalls}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Roboflow API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(metrics.apiUsage.roboflowCalls / Math.max(1, metrics.apiUsage.openaiCalls + metrics.apiUsage.roboflowCalls + metrics.apiUsage.fallbackUsage)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.apiUsage.roboflowCalls}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Fallback Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(metrics.apiUsage.fallbackUsage / Math.max(1, metrics.apiUsage.openaiCalls + metrics.apiUsage.roboflowCalls + metrics.apiUsage.fallbackUsage)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.apiUsage.fallbackUsage}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Performance Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">API Reliability</div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.successRates.overall > 90 ? 'Excellent' : 
                     metrics.successRates.overall > 75 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">Response Speed</div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.apiResponseTimes.average < 3000 ? 'Fast' : 
                     metrics.apiResponseTimes.average < 6000 ? 'Moderate' : 'Slow'}
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Wifi className="h-4 w-4 text-purple-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">Network Quality</div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.systemMetrics.networkLatency < 100 ? 'Excellent' : 
                     metrics.systemMetrics.networkLatency < 300 ? 'Good' : 'Poor'}
                  </div>
                </div>
              </div>
              {metrics.systemMetrics.errorRate > 10 && (
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">High Error Rate</div>
                    <div className="text-xs text-muted-foreground">
                      Consider checking API configurations
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Activity Log */}
        <div className="bg-muted/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {realTimeData.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No recent activity to display
              </div>
            ) : (
              realTimeData.slice(-10).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{activity.action}</span>
                  <span className="text-muted-foreground">{activity.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button 
            onClick={() => {
              setMetrics({
                apiResponseTimes: { ingredientDetection: [], recipeGeneration: [], average: 0 },
                successRates: { ingredientDetection: 0, recipeGeneration: 0, overall: 0 },
                userInteractions: { totalUploads: 0, totalRecipesGenerated: 0, favoritesSaved: 0, sessionDuration: 0 },
                systemMetrics: { memoryUsage: 0, networkLatency: 0, errorRate: 0, uptime: 0 },
                apiUsage: { openaiCalls: 0, roboflowCalls: 0, fallbackUsage: 0 }
              });
              localStorage.removeItem('quickchef-metrics');
            }}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
          >
            Reset Metrics
          </button>
          <button 
            onClick={() => {
              const data = JSON.stringify(metrics, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `quickchef-metrics-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>
    </motion.div>
  );
}