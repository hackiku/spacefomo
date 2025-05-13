// supabase/functions/write-raw-news/sources/extract-from-submissions.ts

export async function extractFromSubmission(submissionId: string | number, supabase: any) {
	// Get the submission
	const { data: submission, error } = await supabase
		.from('submissions')
		.select('*')
		.eq('id', submissionId)
		.single();

	if (error || !submission) {
		throw new Error(`Error fetching submission: ${error?.message || 'Submission not found'}`);
	}

	try {
		const url = submission.url;

		// Check if already processed
		const { data: existing } = await supabase
			.from('raw_news')
			.select('id')
			.eq('source_type', 'submission')
			.eq('source_id', submission.id.toString())
			.limit(1);

		if (existing && existing.length > 0) {
			return [{
				id: existing[0].id,
				url,
				alreadyExists: true
			}];
		}

		// Create raw_news entry
		const { data, error: insertError } = await supabase
			.from('raw_news')
			.insert({
				url: submission.url,
				title: null, // Will be extracted during processing
				publication_date: null, // Will be extracted during processing
				source_name: new URL(submission.url).hostname.replace('www.', ''),
				source_type: 'submission',
				source_id: submission.id.toString(),
				discovered_at: submission.created_at,
				source_fomo: submission.fomo_score,
				context: {
					user_comment: submission.comment,
					user_email: submission.email,
					week_id: submission.week_id
				}
			})
			.select();

		if (insertError) throw insertError;

		return [{
			...data[0],
			alreadyExists: false
		}];
	} catch (error) {
		console.error(`Error extracting submission: ${error.message}`);
		throw error;
	}
}