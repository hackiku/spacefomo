// src/routes/admin/+page.ts
import type { NewsSubmission } from '$lib/types/database'

// Mock data - replace with Supabase later
const MOCK_SUBMISSIONS: NewsSubmission[] = [
	{
		id: '1',
		url: 'https://www.space.com/spacex-starship-orbital-launch-date',
		title: 'SpaceX Starship Launch Update',
		submitted_at: '2025-01-10T14:23:00Z',
		status: 'pending',
		source: 'space.com'
	},
	{
		id: '2',
		url: 'https://www.nasa.gov/artemis-updates',
		title: 'NASA Artemis Mission Progress',
		submitted_at: '2025-01-10T12:15:00Z',
		status: 'pending',
		source: 'nasa.gov'
	}
]

export function load() {
	return {
		submissions: MOCK_SUBMISSIONS
	}
}