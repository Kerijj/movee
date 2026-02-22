
export const s = {
  container: "min-h-screen p-4 md:p-12 max-w-4xl mx-auto flex flex-col items-center",
  hero: "mb-16 text-center w-full",
  bigTitle: "text-6xl md:text-8xl font-black text-[#722f37] uppercase tracking-tighter font-display",
  tagline: "font-mono text-[10px] uppercase tracking-[0.4em] text-[#722f37] mt-2 opacity-40",
  
  // Панель управления (центрированная)
  controls: "flex flex-col md:flex-row gap-6 mb-16 items-center justify-center w-full",
  fieldWrapper: "flex flex-col items-center gap-2",
  label: "font-mono text-[9px] uppercase tracking-widest text-[#722f37]/50",
  input: "bg-white/80 border border-[#722f37]/10 rounded-2xl py-2 px-4 w-64 text-center font-mono text-sm focus:outline-none focus:border-[#722f37]/30 text-[#722f37] transition-all",
  select: "bg-white/80 border border-[#722f37]/10 rounded-2xl py-2 px-4 w-56 text-center font-mono text-sm focus:outline-none text-[#722f37] cursor-pointer appearance-none transition-all",
  
  // Сетка и Карточки
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8 w-full",
  card: "relative p-8 rounded-[40px] transition-all duration-500 flex flex-col shadow-sm border border-[#722f37]/5",
  cardNotWatched: "bg-white/60 hover:bg-white hover:shadow-xl hover:-translate-y-1", 
  cardWatched: "bg-[#722f37]/10 border-[#722f37]/10 hover:shadow-lg hover:-translate-y-1", 
  
  genreTag: "text-[10px] font-bold uppercase tracking-[0.2em] text-[#722f37]/30 mb-4",
  movieTitle: "text-3xl font-display font-black text-[#722f37] uppercase leading-tight mb-4",
  description: "text-[14px] text-gray-800/80 leading-relaxed font-sans mb-10 opacity-90 line-clamp-4",
  
  // Футер карточки
  footer: "mt-auto pt-6 flex justify-between items-end border-t border-[#722f37]/5",
  info: "space-y-1 font-mono text-[10px] uppercase tracking-wider text-[#722f37]/50",
  ratingBox: "text-right",
  ratingLabel: "text-[8px] font-mono uppercase opacity-40 block mb-1",
  ratingValue: "text-4xl font-display italic text-[#722f37] font-black"
};
