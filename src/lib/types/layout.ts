// src/lib/types/layout.ts

export type LayoutConfig = {
	columns: 1 | 2;
	padding: 'compact' | 'normal' | 'wide';
	width: 'narrow' | 'normal' | 'wide';
};

export type LayoutState = {
	isSticky: boolean;
	hasPassedThreshold: boolean;
};

export type GridClasses = {
	container: string;
	controls: string;
	news: string;
	sidebar: string;
};