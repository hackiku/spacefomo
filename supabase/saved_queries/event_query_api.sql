-- Basic event query API
SELECT 
  e.id,
  e.title,
  e.slug,
  e.summary,
  e.fomo_score,
  e.impact_score,
  e.tags,
  e.event_date,
  -- Get primary source info
  (
    SELECT json_build_object(
      'id', pn.id,
      'title', pn.title,
      'source', pn.source,
      'url', pn.url,
      'publication_date', pn.publication_date
    )
    FROM public.event_sources es
    JOIN public.processed_news pn ON es.news_id = pn.id
    WHERE es.event_id = e.id AND es.is_primary = true
    LIMIT 1
  ) AS primary_source,
  -- Count of all sources
  (
    SELECT COUNT(*)
    FROM public.event_sources es
    WHERE es.event_id = e.id
  ) AS source_count
FROM 
  public.events e
ORDER BY 
  e.fomo_score DESC, e.created_at DESC
LIMIT 20;