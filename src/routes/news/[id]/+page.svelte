<!-- src/routes/news/[id]/+page.svelte -->
<script lang="ts">
    import { browser } from '$app/environment';
    
    let { data } = $props();
    const { newsItem } = data;
    
    // Define metadata
    $page.meta = {
        title: newsItem.title + ' | SpaceFOMO',
        description: newsItem.summary || 'Latest space news and updates',
        openGraph: {
            title: newsItem.viral_title || newsItem.title,
            description: newsItem.summary || 'Space news missing-out relief',
            image: newsItem.image_url || 'https://spacefomo.com/og-image.jpg',
            type: 'article',
            article: {
                publishedTime: newsItem.publication_date,
                tags: newsItem.tags
            }
        },
        twitter: {
            card: 'summary_large_image',
            title: newsItem.viral_title || newsItem.title,
            description: newsItem.summary || 'Space news missing-out relief',
            image: newsItem.image_url || 'https://spacefomo.com/og-image.jpg'
        }
    };
    
    // Track page view if in browser
    $effect(() => {
        if (browser) {
            // Analytics tracking code here
        }
    });
</script>

<article>
    <!-- Article content here -->
</article>