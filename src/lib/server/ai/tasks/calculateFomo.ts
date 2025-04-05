// src/lib/server/ai/tasks/generateSummary.ts
import { claude } from '../providers/claude';

export async function generateSummary(content, entities) {
	const response = await claude.messages.create({
		model: "claude-3-5-sonnet-20240620",
		messages: [
			{
				role: "user",
				content: `Summarize this article in about 100 words. Also create a catchy, 
        viral-style headline (60 chars max) that would make someone want to read it.
        
        Article: ${content}
        
        Key entities: ${JSON.stringify(entities.people)} ${JSON.stringify(entities.organizations)}`
			}
		],
		temperature: 0.7
	});

	const textContent = response.content[0].text;

	// Parse the summary and viral title
	const viralTitle = textContent.split('\n')[0].replace(/^#+ /, '');
	const summary = textContent.split('\n\n').slice(1).join('\n\n');

	return { summary, viralTitle };
}