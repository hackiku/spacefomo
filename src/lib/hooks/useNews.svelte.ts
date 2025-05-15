// src/lib/hooks/useNews.svelte.ts 
import { getNewsContext } from '$lib/context/newsContext.svelte';
import { getFomoContext } from '$lib/context/fomoContext.svelte';
import type { NewsItem } from '$lib/types/news';

export function useNews() {
  // Get contexts
  const newsContext = getNewsContext();
  const fomoContext = getFomoContext();
  
  // All items from context
  const allItems = newsContext.newsItems || [];
  
  // Apply filters from FOMO context
  const filteredItems = $derived(() => {
    // If no items, return empty array
    if (!allItems || allItems.length === 0) return [];
    
    // Log the filtering process
    console.log('Filtering news with:', {
      itemCount: allItems.length,
      threshold: fomoContext.fomoThreshold,
      dateRange: [fomoContext.startDate, fomoContext.endDate],
      selectedTags: fomoContext.selectedTags
    });
    
    // Simple filter to check FOMO score
    const result = allItems.filter(item => {
      // If no fomo_score, it's not filterable
      if (item.fomo_score === null || item.fomo_score === undefined) {
        return false;
      }
      
      // Check against threshold (must be >= threshold)
      return item.fomo_score >= fomoContext.fomoThreshold;
    });
    
    console.log('Filtered results:', result.length);
    return result;
  });
  
  return {
    // Original data
    allItems: allItems,
    
    // Filtered data - use the filtered items
    items: filteredItems,
    
    // Pass through other context properties
    isLoading: newsContext.isLoading,
    error: newsContext.error,
    activeItemId: newsContext.activeItemId,
    
    // Pass through context methods
    setActiveItem: newsContext.setActiveItem,
    setActiveDataSource: newsContext.setActiveDataSource
  };
}