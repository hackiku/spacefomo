// $lib/stores/styleStore.ts
import { writable } from 'svelte/store';
import type { CardStyle } from '../features/news/styles';

export const currentStyle = writable<CardStyle>('terminal');