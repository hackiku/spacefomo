-- Detailed event with full sources
SELECT 
  e.id,
  e.title,
  e.slug,
  e.summary,
  e.fomo_score,
  e.impact_score,
  e.tags,
  e.entities,
  e.context,
  e.event_date,
  -- Get all sources with complete details
  (
    SELECT json_agg(
      json_build_object(
        'id', pn.id,
        'title', pn.title,
        'viral_title', pn.viral_title,
        'source', pn.source,
        'url', pn.url,
        'summary', pn.summary,
        'publication_date', pn.publication_date,
        'fomo_score', pn.fomo_score,
        'is_primary', es.is_primary
      ) ORDER BY es.is_primary DESC, pn.publication_date DESC
    )
    FROM public.event_sources es
    JOIN public.processed_news pn ON es.news_id = pn.id
    WHERE es.event_id = e.id
  ) AS sources
FROM 
  public.events e
WHERE 
  e.slug = 'ursa-major-draper-engine-afrl-contract-hypersonic-2025';