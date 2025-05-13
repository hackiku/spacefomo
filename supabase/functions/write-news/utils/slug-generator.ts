// supabase/functions/write-news/utils/slug-generator.ts

/**
 * Generate a URL-friendly slug from a title
 */
export function slugify(title: string): string {
	// Remove emojis and special characters
	const cleanTitle = title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters and emojis
		.replace(/\s+/g, '-')     // Replace spaces with hyphens
		.replace(/-+/g, '-')      // Replace multiple hyphens with a single one
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

	// Limit length to accommodate a timestamp that might be added later
	return cleanTitle.substring(0, 70);
}