// src/lib/server/ai/tasks/extractEntities.ts
import { openai } from '../providers/openai';

export async function extractEntities(content) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{
				role: "system",
				content: "Extract structured information from this article."
			},
			{
				role: "user",
				content
			}
		],
		functions: [
			{
				name: "extract_entities",
				description: "Extract entities from the article",
				parameters: {
					type: "object",
					properties: {
						title: { type: "string" },
						source: { type: "string" },
						publicationDate: { type: "string", format: "date" },
						tags: { type: "array", items: { type: "string" } },
						people: {
							type: "array",
							items: {
								type: "object",
								properties: {
									name: { type: "string" },
									role: { type: "string" },
									company: { type: "string" }
								}
							}
						},
						// Add other entity types...
					},
					required: ["title", "tags"]
				}
			}
		],
		function_call: { name: "extract_entities" }
	});

	const functionCall = response.choices[0].message.function_call;
	return JSON.parse(functionCall.arguments);
}