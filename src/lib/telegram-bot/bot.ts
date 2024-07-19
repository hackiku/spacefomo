import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI
const openaiConfig = new Configuration({
	apiKey: 'YOUR_OPENAI_API_KEY'
});
const openai = new OpenAIApi(openaiConfig);

// Initialize Telegram Bot
const bot = new Telegraf('YOUR_TELEGRAM_BOT_API_TOKEN');

bot.start((ctx) => ctx.reply('Send me a URL and I will summarize it for you.'));

bot.on('text', async (ctx) => {
	const url = ctx.message.text;
	const summary = await getSummary(url);
	ctx.reply(summary);
});

const getSummary = async (url: string): Promise<string> => {
	const articleText = await fetchArticle(url);
	if (articleText) {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `Summarize this article in 100 words: ${articleText}`,
			max_tokens: 150
		});
		return response.data.choices[0].text.trim();
	} else {
		return "Couldn't fetch the article. Please try another URL.";
	}
};

const fetchArticle = async (url: string): Promise<string | null> => {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const $ = cheerio.load(html);
		const paragraphs = $('p');
		const articleText = paragraphs.map((_, p) => $(p).text()).get().join(' ');
		return articleText;
	} catch (error) {
		console.error(`Error fetching the article: ${error}`);
		return null;
	}
};

bot.launch();
