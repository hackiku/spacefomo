// src/lib/trpc/t.ts

import type { Context } from './context';
import { initTRPC } from '@trpc/server';
// import transformer from 'trpc-transformer';

// export const t = initTRPC.context<Context>().create({ transformer });
export const t = initTRPC.context<Context>().create();
