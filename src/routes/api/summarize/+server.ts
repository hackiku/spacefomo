// routes/api/summarize/+server.ts

import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const GET = async () => {
	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{ "role": "system", "content": "You are a helpful assistant." },
				{ "role": "user", "content": "Who won the world series in 2020?" },
				{ "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
				{ "role": "user", "content": "Where was it played?" }
			],
			model: "gpt-4o-mini",
		});

		// Return the actual OpenAI response to the client
		return json(completion);
	} catch (error) {
		console.error('Error fetching OpenAI response:', error);
		return json({ success: false, error: error.message });
	}
};
