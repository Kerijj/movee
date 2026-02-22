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

  const categories = useMemo(() => {
    const caps = movies.map(m => m.mainGenre).filter(Boolean);
    return ['ALL GENRES', ...Array.from(new Set(caps))].sort();
  }, [movies]);

  const filtered = useMemo(() => {
    return movies.filter(m => {
      const genreToMatch = selectedGenre === 'ALL GENRES' ? 'ALL' : selectedGenre;
      const matchesGenre = genreToMatch === 'ALL' || m.fullGenre.toUpperCase().includes(genreToMatch);
      const q = search.toLowerCase();
      const matchesSearch = !search || m.title.toLowerCase().includes(q) || m.year.toString().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Archive</h1>
        <p className={s.tagline}>Records Database / v.2026</p>
      </header>

      <section className={s.controls}>
        <div className={s.fieldWrapper}>
          <label className={s.label}>Keyword</label>
          <input 
            type="text"
            placeholder="Search..."
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

      {loading ? (
        <div className="py-20 font-mono text-wine animate-pulse tracking-[0.5em] text-[10px]">INITIALIZING...</div>
      ) : (
        <div className={s.grid}>
          {filtered.map((m, i) => (
            <article key={i} className={s.card}>
              <span className={s.genreTag}>{m.fullGenre}</span>
              <h2 className={s.movieTitle}>{m.title}</h2>
              <p className={s.description}>{m.desc}</p>
              <div className={s.footer}>
                <span>{m.year} — {m.status === 'Да' ? 'RECORDED' : 'PENDING'}</span>
                <span className={s.rating}>{m.rating}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Фоновая литера для глубины */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-wine/[0.02] font-display text-[60vw] -z-20 select-none pointer-events-none">
        A
      </div>
    </main>
  );
}
