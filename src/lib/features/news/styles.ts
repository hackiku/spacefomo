// $lib/features/news/styles.ts
export const cardStyles = {
	terminal: {
		container: "group mb-8 cursor-pointer",
		card: `bg-black border-2 border-[#00ff00] p-6 font-mono relative overflow-hidden
           before:content-[''] before:absolute before:inset-0 before:bg-[#00ff00]/5 
           before:opacity-0 before:group-hover:opacity-100 before:transition-opacity`,
		title: "text-[#00ff00] text-xl font-bold tracking-tight",
		summary: "text-[#00ff00]/80 mb-4 text-sm leading-relaxed",
		tag: "text-black bg-[#00ff00] px-2 py-0.5 text-xs hover:bg-[#00ff00]/90 transition-colors",
		score: "text-[#00ff00] font-bold",
		meta: "text-[#00ff00]/60 text-sm"
	},
	scifi: {
		container: "group mb-8 cursor-pointer",
		card: `bg-gradient-to-br from-indigo-950 to-slate-900 p-6 rounded-lg
           border border-indigo-500/30 relative overflow-hidden
           hover:border-indigo-500/50 transition-colors`,
		title: "text-xl font-bold text-white leading-tight",
		summary: "text-slate-300 mb-4",
		tag: `bg-indigo-900/50 text-cyan-300 px-3 py-1 rounded-full text-sm
          border border-cyan-500/20 hover:border-cyan-500/40 transition-colors`,
		score: "text-2xl font-bold text-cyan-400",
		meta: "text-cyan-400 text-sm"
	}
} as const;

export type CardStyle = keyof typeof cardStyles;