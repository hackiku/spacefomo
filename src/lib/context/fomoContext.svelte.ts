// src/lib/context/fomoContext.svelte.ts
import { getContext } from 'svelte';
import type { NewsItem } from '$lib/types/news';

export function createFomoContext(initialNewsData: any[] = []) {
  // Core state
  let newsItems = $state<any[]>([]); // All news items
  let fomoThreshold = $state(50);  // Default FOMO threshold
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);
  let isExpanded = $state(false);
  let visualizationType = $state<'bar' | 'line' | 'heatmap'>('bar');
  
  // Derived values
  
  // Filter news by FOMO score
  const filteredNews = $derived(() => {
    return newsItems.filter(item => {
      // Filter by FOMO score
      if (!item.fomo_score || item.fomo_score < fomoThreshold) {
        return false;
      }
      
      // Filter by date range if active
      if (startDate && endDate && item.publication_date) {
        const pubDate = new Date(item.publication_date);
        return pubDate >= startDate && pubDate <= endDate;
      }
      
      return true;
    });
  });
  
  // Calculate current FOMO score (average of filtered news)
  const currentFomoScore = $derived(() => {
    if (filteredNews.length === 0) return 0;
    
    const totalScore = filteredNews.reduce((sum, article) => 
      sum + (article.fomo_score || 0), 0);
    
    return Math.round(totalScore / filteredNews.length);
  });
  
  // Group by day for visualization
  const dailyFomoData = $derived(() => {
    const dataByDay = new Map();
    
    // Process all news items
    newsItems.forEach(item => {
      if (!item.publication_date || !item.fomo_score || item.fomo_score < fomoThreshold) return;
      
      // Skip if outside date range when filters active
      if (startDate && endDate) {
        const pubDate = new Date(item.publication_date);
        if (pubDate < startDate || pubDate > endDate) return;
      }
      
      const dateStr = new Date(item.publication_date).toISOString().split('T')[0];
      
      if (!dataByDay.has(dateStr)) {
        dataByDay.set(dateStr, {
          date: new Date(item.publication_date),
          totalScore: 0,
          count: 0
        });
      }
      
      const dayData = dataByDay.get(dateStr);
      dayData.totalScore += item.fomo_score;
      dayData.count += 1;
    });
    
    // Calculate averages and sort by date
    return Array.from(dataByDay.entries())
      .map(([dateStr, day]) => ({
        date: day.date,
        score: Math.round(day.totalScore / day.count),
        count: day.count
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });
  
  // Format data for the BarTimeline component
  const barTimelineData = $derived(() => {
    if (dailyFomoData.length === 0) {
      // Generate empty placeholder data for last 90 days
      return Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        
        return {
          date,
          score: 0,
          weekNumber: Math.floor(i / 7),
          dayIndex: i % 7
        };
      });
    }
    
    // Calculate relative week numbers
    const sortedData = [...dailyFomoData].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstDate = sortedData[0].date;
    const startOfFirstWeek = new Date(firstDate);
    startOfFirstWeek.setDate(firstDate.getDate() - firstDate.getDay()); // Sunday
    
    return sortedData.map(day => {
      const diffTime = day.date.getTime() - startOfFirstWeek.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(diffDays / 7);
      const dayIndex = diffDays % 7;
      
      return {
        date: day.date,
        score: day.score,
        weekNumber,
        dayIndex
      };
    });
  });
  
  // Methods
  function setFomoThreshold(value: number) {
    fomoThreshold = value;
  }
  
  function setDateRange(start: Date | null, end: Date | null) {
    startDate = start;
    endDate = end;
  }
  
  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
  
  function setVisualizationType(type: 'bar' | 'line' | 'heatmap') {
    visualizationType = type;
  }
  
  // Initialize with news data
  function initializeData(data: any[]) {
    // Process dates to ensure they're proper Date objects
    newsItems = data.map(item => ({
      ...item,
      created_at: item.created_at instanceof Date ? 
        item.created_at : new Date(item.created_at),
      publication_date: item.publication_date ?
        (item.publication_date instanceof Date ? 
          item.publication_date : new Date(item.publication_date)) : null
    }));
  }
  
  // Initialize with provided data
  if (initialNewsData.length > 0) {
    initializeData(initialNewsData);
  }
  
  return {
    // State
    newsItems,
    filteredNews,
    fomoThreshold,
    startDate,
    endDate,
    isExpanded,
    visualizationType,
    
    // Computed values
    currentFomoScore,
    dailyFomoData,
    barTimelineData,
    
    // Methods
    setFomoThreshold,
    setDateRange,
    toggleExpanded,
    setVisualizationType,
    initializeData
  };
}

// Helper to get the fomo context
export function getFomoContext() {
  return getContext<ReturnType<typeof createFomoContext>>('fomo');
}

// Helper to create a hook for fomo data
export function useFomo() {
  const context = getFomoContext();
  
  if (!context) {
    throw new Error('useFomo must be used within a component with FomoContext');
  }
  
  return context;
}