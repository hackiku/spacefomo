// $lib/features/news/stores/styleStore.ts
import { writable } from 'svelte/store';
import type { CardStyle } from '../styles';

export const currentStyle = writable<CardStyle>('terminal');