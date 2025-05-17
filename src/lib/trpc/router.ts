// src/lib/trpc/router.ts
import { t } from './t';
import { newsRouter } from './routes/news';
import { fomoRouter } from './routes/fomo';
// import { tagsRouter } from './routes/tags';
// import { userRouter } from './routes/user';

export const router = t.router({
	news: newsRouter,
	fomo: fomoRouter,
	// tags: tagsRouter,
	// user: userRouter,
});

// Create a type-safe caller function for server-side usage
export const createCaller = t.createCallerFactory(router);

// Export the router type for client-side usage
export type Router = typeof router;