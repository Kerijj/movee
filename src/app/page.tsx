'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Важно: эта ссылка должна отдавать CSV
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl)
      .then(r => {
        if (!r.ok) throw new Error("Таблица недоступна. Проверь настройки доступа в Google Docs.");
        return r.text();
      })
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            if (res.data.length === 0) {
              setError("Таблица пуста или заголовки не распознаны.");
              return;
            }

            const data = res.data.map((row: any) => {
              // Поиск колонок без учета регистра и пробелов
              const getVal = (names: string[]) => {
                const key = Object.keys(row).find(k => 
                  names.some(n => k.toLowerCase().trim() === n.toLowerCase())
                );
                return key ? row[key] : "";
              };

              const rawGenre = getVal(['жанр', 'genre', 'категория']);
              const mainGenre = rawGenre.split(/[/,]/)[0].trim().toUpperCase();

              return {
                title: getVal(['название', 'title', 'фильм', 'имя']),
                fullGenre: rawGenre,
                mainGenre: mainGenre || 'OTHER',
                desc: getVal(['описание', 'description', 'инфо']),
                rating: getVal(['оценка', 'rating', 'рейтинг']),
                year: getVal(['год', 'year']),
                status: getVal(['смотрели', 'status', 'статус'])
              };
            }).filter(m => m.title && m.title.length > 1);

            setMovies(data);
            setLoading(false);
          },
        });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const caps = movies.map(m => m.mainGenre).filter(Boolean);
    return ['ALL GENRES', ...Array.from(new Set(caps))].sort();
  }, [movies]);

  const filtered = useMemo(() => {
    return movies.filter(m => {
      const matchesGenre = selectedGenre === 'ALL GENRES' || m.fullGenre.toUpperCase().includes(selectedGenre);
      const q = search.toLowerCase();
      const matchesSearch = !search || m.title.toLowerCase().includes(q) || m.year.toString().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-wine animate-pulse">CONNECTING TO ARCHIVE...</div>;
  
  if (error) return <div className="min-h-screen flex items-center justify-center font-mono text-wine p-10 text-center uppercase tracking-widest">{error}</div>;

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Archive</h1>
        <p className={s.tagline}>Records Database / v.2026</p>
      </header>

      <section className={s.controls}>
        <div className={s.fieldWrapper}>
          <label className={s.label}>Keyword Search</label>
          <input 
            type="text"
            placeholder="Search by title or year..."
            className={s.input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={s.fieldWrapper}>
          <label className={s.label}>Category</label>
          <select 
            className={s.select}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </section>

      <div className={s.grid}>
        {filtered.length > 0 ? filtered.map((m, i) => (
          <article key={i} className={s.card}>
            <span className={s.genreTag}>{m.fullGenre}</span>
            <h2 className={s.movieTitle}>{m.title}</h2>
            <p className={s.description}>{m.desc}</p>
            <div className={s.footer}>
              <span>{m.year} — {m.status === 'Да' ? 'RECORDED' : 'WATCHLIST'}</span>
              <span className={s.rating}>{m.rating}</span>
            </div>
          </article>
        )) : (
          <div className="col-span-full text-center font-mono opacity-30 uppercase tracking-[0.5em] py-20">No matching records found</div>
        )}
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-wine/[0.02] font-display text-[60vw] -z-20 select-none pointer-events-none">
        A
      </div>
    </main>
  );
}
