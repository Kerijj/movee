'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ВСЕ ЖАНРЫ');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    fetch(csvUrl).then(r => r.text()).then(text => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const data = res.data.map((row: any) => {
            const getVal = (names: string[]) => {
              const key = Object.keys(row).find(k => names.some(n => k.toLowerCase().trim().includes(n.toLowerCase())));
              return key ? row[key] : "";
            };
            return {
              title: getVal(['название', 'фильм', 'title']),
              genre: getVal(['жанр', 'genre', 'категория']),
              desc: getVal(['описание', 'description']),
              rating: getVal(['оценка', 'rating', 'рейтинг']),
              year: getVal(['год', 'year']),
              status: getVal(['смотрели', 'status', 'статус'])
            };
          }).filter(m => m.title && m.title.length > 1);
          setMovies(data);
          setLoading(false);
        }
      });
    });
  }, []);

  const categories = useMemo(() => {
    const all = new Set<string>();
    movies.forEach(m => {
      if (m.genre) {
        m.genre.split(/[\\/;,]/).forEach((g: string) => {
          const clean = g.trim().toUpperCase();
          if (clean && clean.length > 1) all.add(clean);
        });
      }
    });
    return ['ВСЕ ЖАНРЫ', ...Array.from(all)].sort();
  }, [movies]);

  const filtered = useMemo(() => {
    return movies.filter(m => {
      const matchesGenre = selectedGenre === 'ВСЕ ЖАНРЫ' || (m.genre && m.genre.toUpperCase().includes(selectedGenre));
      const q = search.toLowerCase();
      const matchesSearch = !search || m.title.toLowerCase().includes(q) || m.year.toString().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF0E5] text-[#8E443D] font-bold tracking-[0.3em] uppercase">
      Загрузка коллекции...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDF0E5] p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* ШАПКА */}
        <header className="mb-16 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-[#8E443D] uppercase tracking-tighter leading-none mb-4">
            Архив
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#8E443D]/50">
            Movie Collection / Vol. 2026
          </p>
        </header>

        {/* УПРАВЛЕНИЕ */}
        <section className="flex flex-col md:flex-row gap-6 mb-16 justify-center">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E443D]/40 ml-4">Поиск</span>
            <input 
              type="text" 
              placeholder="Название или год..." 
              className="bg-white/60 backdrop-blur-md border-none rounded-[25px] py-4 px-8 w-full md:w-80 text-[#8E443D] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88E7D]/40 shadow-sm"
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E443D]/40 ml-4">Категория</span>
            <select 
              className="bg-[#E88E7D] text-white border-none rounded-[25px] py-4 px-8 w-full md:w-64 text-sm font-bold cursor-pointer shadow-lg hover:bg-[#d67b6a] transition-all appearance-none text-center outline-none"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </section>

        {/* СЕТКА КАРТОЧЕК */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filtered.map((m, i) => {
            const isWatched = m.status?.toLowerCase() === 'да';
            return (
              <article 
                key={i} 
                className={`relative p-10 rounded-[50px] transition-all duration-500 flex flex-col shadow-sm group hover:shadow-2xl hover:-translate-y-2 ${
                  isWatched ? 'bg-[#F7D8C4]' : 'bg-white'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8E443D]/30 mb-4 block">
                  {m.genre}
                </span>
                <h2 className="text-4xl font-black text-[#8E443D] leading-tight mb-4 group-hover:text-[#E88E7D] transition-colors">
                  {m.title}
                </h2>
                <p className="text-[15px] text-[#8E443D]/70 leading-relaxed font-medium mb-10 line-clamp-4">
                  {m.desc}
                </p>
                
                <div className="mt-auto pt-8 flex justify-between items-end border-t border-[#8E443D]/5">
                  <div className="flex flex-col gap-2">
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-[#8E443D] w-fit shadow-sm uppercase tracking-wider">
                      {m.year} ГОД
                    </span>
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-[#8E443D] w-fit shadow-sm uppercase">
                      {isWatched ? "● ПРОСМОТРЕНО" : "○ В ОЧЕРЕДИ"}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#8E443D]/20 uppercase mb-1">ОЦЕНКА</span>
                    <span className="text-6xl font-black text-[#8E443D] italic leading-[0.8] tracking-tighter">
                      {m.rating || '—'}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ФУТЕР */}
        <footer className="mt-20 py-12 text-center border-t border-[#8E443D]/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8E443D]/30">
            Личный архив • Найдено записей: {filtered.length}
          </p>
        </footer>

      </div>
    </main>
  );
}
