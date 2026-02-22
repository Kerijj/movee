export const s = {
  // 1. ОБЩИЙ КОНТЕЙНЕР (Централизация всего контента)
  // Мы используем max-w-5xl, чтобы сайт выглядел аккуратно посередине экрана
  container: "min-h-screen bg-[#FDF0E5] p-6 md:p-16 flex flex-col items-center",
  wrapper: "w-full max-w-5xl mx-auto flex flex-col",

  // 2. ШАПКА (Header)
  header: "mb-16 text-center flex flex-col items-center",
  bigTitle: "text-6xl md:text-8xl font-black text-[#8E443D] uppercase tracking-tighter leading-[0.8] mb-4",
  tagline: "font-mono text-[11px] uppercase tracking-[0.5em] text-[#8E443D]/50",

  // 3. ФИЛЬТРЫ И ПОИСК (Панель управления)
  // Сделано в стиле "таблеток" с мягкими тенями
  controls: "flex flex-col md:flex-row gap-4 mb-16 justify-center w-full",
  fieldWrapper: "flex flex-col gap-2",
  label: "font-mono text-[9px] uppercase tracking-widest text-[#8E443D]/40 ml-4",
  
  input: "bg-white/60 backdrop-blur-md border-none rounded-[25px] py-4 px-8 w-full md:w-80 text-[#8E443D] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88E7D]/40 placeholder:text-[#8E443D]/30 shadow-sm transition-all",
  
  select: "bg-[#E88E7D] text-white border-none rounded-[25px] py-4 px-8 w-full md:w-64 text-sm font-bold cursor-pointer shadow-lg hover:bg-[#d67b6a] transition-colors focus:outline-none appearance-none text-center",

  // 4. СЕТКА (Grid)
  // На мобильных — 1 колонка, на десктопе — 2 колонки
  grid: "grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-20",

  // 5. КАРТОЧКА (Pinterest Style)
  // Увеличили скругление углов (rounded-[50px]) для более мягкого вида
  card: "relative p-10 rounded-[50px] transition-all duration-500 flex flex-col shadow-sm border-none group hover:shadow-2xl hover:-translate-y-2",
  cardNotWatched: "bg-white", 
  cardWatched: "bg-[#F7D8C4] border border-[#8E443D]/5", // Мягкий цвет для просмотренных

  // 6. ТЕКСТ В КАРТОЧКЕ
  genreTag: "text-[11px] font-black uppercase tracking-[0.2em] text-[#8E443D]/30 mb-4 block",
  movieTitle: "text-4xl font-black text-[#8E443D] leading-tight mb-4 group-hover:text-[#E88E7D] transition-colors",
  description: "text-[15px] text-[#8E443D]/70 leading-relaxed font-medium mb-10 line-clamp-4",

  // 7. ФУТЕР КАРТОЧКИ (Нижняя часть с рейтингом)
  cardFooter: "mt-auto pt-8 flex justify-between items-end border-t border-[#8E443D]/5",
  badgeStack: "flex flex-col gap-2",
  badge: "bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-[#8E443D] w-fit shadow-sm uppercase tracking-wider",
  
  ratingGroup: "text-right flex flex-col items-end",
  ratingLabel: "text-[10px] font-black text-[#8E443D]/20 uppercase tracking-tighter mb-1",
  ratingValue: "text-6xl font-black text-[#8E443D] italic leading-[0.8] tracking-tighter",

  // 8. ФУТЕР САЙТА (Нижняя часть страницы)
  footer: "mt-auto py-12 text-center border-t border-[#8E443D]/10 w-full",
  footerText: "font-mono text-[10px] uppercase tracking-[0.4em] text-[#8E443D]/30"
};
