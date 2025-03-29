// src/lib/types/layout.ts

// Core layout types
export type SidebarMode = 'thin' | 'default' | 'wide';
export type ColumnCount = 1 | 2;
export type CardWidth = 'normal' | 'wide';

// Current settings interface
export interface LayoutSettings {
	sidebarMode: SidebarMode;
	columnCount: ColumnCount;
	sidebarOpen: boolean;
}

// Interface for computed classes
export interface LayoutClasses {
	container: string;
	sidebar: string;
	content: string;
}

// Export icons/controls options interfaces
export interface ControlOption<T> {
	value: T;
	label: string;
	icon: any; // Icon component type
}

// Add any new types above this line
// -----------------------------------------------------------
// Legacy types below - keep for reference but they're not used in current code
// These can be removed when the refactoring is complete

// export type LayoutConfig = {
// 	columns: 1 | 2;
// 	padding: 'compact' | 'normal' | 'wide';
// 	width: 'narrow' | 'normal' | 'wide';
// };

// export type LayoutOption = {
// 	name: 'compact' | 'normal' | 'grid' | 'wide';
// 	label: string;
// 	config: LayoutConfig;
// };

// export type LayoutState = {
// 	isSticky: boolean;
// };

// export type GridClasses = {
// 	container: string;
// 	main: string;
// 	sidebar: string;
// 	content: string;
// };