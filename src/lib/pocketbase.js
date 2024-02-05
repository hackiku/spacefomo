// src/lib/pocketbase.js

import PocketBase from 'pocketbase';

// import { writable } from 'svelte/store';

export const pb = new PocketBase('http://127.0.0.1:8090');

// export const articles = writable(pb.collection('articles'));

// console.log('PocketBase', pb);
