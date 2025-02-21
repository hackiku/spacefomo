// src/lib/types/layout.ts

export type LayoutConfig = {
	columns: 1 | 2;
	padding: 'compact' | 'normal' | 'wide';
	width: 'narrow' | 'normal' | 'wide';
};

export type LayoutOption = {
	name: 'compact' | 'normal' | 'grid' | 'wide';
	label: string;
	config: LayoutConfig;
};

export type LayoutState = {
	isSticky: boolean;
};

export type GridClasses = {
	container: string;
	main: string;
	sidebar: string;
	content: string;
};