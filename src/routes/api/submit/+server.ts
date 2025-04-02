// src/routes/api/submit/+server.ts
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function POST({ request }) {
	try {
		const { url, comment, fomoScore, email } = await request.json();

		// Basic validation
		if (!url || !url.trim()) {
			throw error(400, { message: 'URL is required' });
		}

		// Get current date for timestamp
		const now = new Date().toISOString();

		// Get the current week to associate with the submission
		const { data: weeks, error: weeksError } = await supabase
			.from('weeks')
			.select('id')
			.order('week_number', { ascending: false })
			.limit(1);

		if (weeksError) {
			console.error('Error fetching current week:', weeksError);
			throw error(500, { message: 'Error fetching current week' });
		}

		const currentWeekId = weeks && weeks.length > 0 ? weeks[0].id : null;

		// Insert the submission
		const { data, error: insertError } = await supabase
			.from('submissions')
			.insert({
				id: Date.now(), // Simple ID generation using timestamp
				url: url.trim(),
				comment: comment?.trim() || null,
				fomo_score: fomoScore || null,
				email: email?.trim() || null,
				week_id: currentWeekId,
				published: false,
				created_at: now
			})
			.select();

		if (insertError) {
			console.error('Error inserting submission:', insertError);
			throw error(500, { message: 'Failed to save submission' });
		}

		return json({ success: true, submission: data[0] });
	} catch (err) {
		console.error('Submission error:', err);
		if (err.status && err.body) {
			throw error(err.status, err.body.message || 'Submission failed');
		}
		throw error(500, { message: 'Unexpected error submitting news' });
	}
}