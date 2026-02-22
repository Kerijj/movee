'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl).then(r => r.text()).then(text => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const data = res.data.map((row: any) => {
            const rawGenre = row['Жанр'] || row['Genre'] || "";
            // Логика: берем только первый жанр для списка категорий
            const mainGenre = rawGenre.split(/[/,]/)[0].trim().toUpperCase();
            
            return {
              title: row['Название'] || row['Title'] || "",
              fullGenre: rawGenre,
              mainGenre: mainGenre || 'OTHER',
              desc: row['Описание'] || row['Description'] || "",
              rating: row['Оценка'] || row['Rating'] || "",
              year: row['Год'] || row['Year'] || "",
              status: row['Смотрели'] || row['Status'] || ""
            };
          }).filter(m => m.title && m.title.length > 1);
          setMovies(data);
          setLoading(false);
        }
      });
    });
  }, []);

  // Умный список жанров (только первые названия)
  const categories = useMemo(() => {
    const caps = movies.map(m => m.mainGenre).filter(Boolean);
    return ['ALL', ...Array.from(new Set(caps))].sort();
  }, [movies]);

  // Фильтрация: Поиск + Категория
  const filtered = useMemo(() => {
    return movies.filter(m => {
      const matchesGenre = selectedGenre === 'ALL' || m.fullGenre.toUpperCase().includes(selectedGenre);
      const q = search.toLowerCase();
      const matchesSearch = !search || 
        m.title.toLowerCase().includes(q) || 
        m.fullGenre.toLowerCase().includes(q) ||
        m.year.toString().includes(q) ||
        m.rating.toString().includes(q);
      
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Archive</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-wine mt-4 opacity-50">Volume 2026 / Records: {movies.length}</p>
      </header>

      <section className={s.controls}>
        <div className={s.fieldWrapper}>
          <label className={s.label}>Search Database</label>
          <input 
            type="text"
            placeholder="Title, Year, or Rating..."
            className={s.input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={s.fieldWrapper}>
          <label className={s.label}>Category</label>
          <div className="relative">
            <select 
              className={s.select}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute right-0 bottom-2 pointer-events-none text-wine/30 text-[10px]">▼</div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center font-mono text-wine animate-pulse tracking-widest">ACCESSING ENCRYPTED DATA...</div>
      ) : (
        <div className={s.grid}>
          {filtered.map((m, i) => (
            <article key={i} className={s.card}>
              <span className={s.genreTag}>{m.fullGenre}</span>
              <h2 className={s.movieTitle}>{m.title}</h2>
              <p className={s.description}>{m.desc}</p>
              <div className={s.footer}>
                <div className="flex flex-col gap-1">
                  <span className={m.status === 'Да' ? 'text-wine font-bold' : ''}>
                    {m.status === 'Да' ? '● ARCHIVED' : '○ PENDING'}
                  </span>
                  <span>RELEASE: {m.year}</span>
                </div>
                <span className={s.rating}>{m.rating}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Фоновый декор */}
      <div className="fixed top-1/2 -right-20 -translate-y-1/2 text-wine/[0.03] font-display text-[40vw] -z-10 select-none pointer-events-none">
        A
      </div>
    </main>
  );
}
