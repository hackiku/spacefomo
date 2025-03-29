// src/lib/types/layout.ts
export type SidebarMode = 'thin' | 'default' | 'wide'; // Controls feed width
export type CardWidth = 'normal' | 'wide';
export type ColumnCount = 1 | 2;

export interface LayoutSettings {
	sidebarMode: SidebarMode;
	cardWidth: CardWidth;
	columnCount: ColumnCount;
}

// Legacy types, kept for backward compatibility
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