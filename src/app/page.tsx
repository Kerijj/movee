'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState('ALL');

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl)
      .then(r => r.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            const data = res.data.map((row: any) => ({
              title: row['Название'] || row['Title'] || row['title'],
              genre: row['Жанр'] || row['Genre'] || row['genre'],
              desc: row['Описание'] || row['Description'] || row['description'],
              rating: row['Оценка'] || row['Rating'] || row['rating'],
              watched: row['Смотрели'] || row['Status']
            })).filter(m => m.title);
            setMovies(data);
            setFiltered(data);
          }
        });
      });
  }, []);

  // ИСПРАВЛЕННАЯ СТРОКА: используем Array.from() для совместимости
  const uniqueGenres = Array.from(new Set(movies.map(m => m.genre).filter(Boolean)));
  const genres = ['ALL', ...uniqueGenres];

  const handleFilter = (genre: string) => {
    setActiveGenre(genre);
    setFiltered(genre === 'ALL' ? movies : movies.filter(m => m.genre === genre));
  };

  return (
    <main className={s.container}>
      <div className={s.hero}>
        <h1 className={s.bigTitle}>Archive</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-wine mt-4 opacity-70">
          Curated Collection / Vol. 2026
        </p>
      </div>

      <nav className={s.filterBar}>
        {genres.map(g => (
          <button 
            key={g} 
            onClick={() => handleFilter(g)}
            className={`${s.btnFilter} ${activeGenre === g ? s.btnActive : ''}`}
          >
            {g}
          </button>
        ))}
      </nav>

      <div className={s.grid}>
        {filtered.map((m, i) => (
          <div key={i} className={s.card}>
            <div className="flex justify-between items-start mb-6">
               <span className={s.genreTag}>{m.genre || 'UNSPECIFIED'}</span>
               <span className="font-mono text-[10px] text-wine/40">#{i + 1}</span>
            </div>
            <h2 className={s.movieTitle}>{m.title}</h2>
            <p className={s.description}>{m.desc}</p>
            <div className="flex justify-between items-end mt-auto">
              <span className={s.status}>
                {m.watched === 'Да' ? '● RECORDED' : '○ PENDING'}
              </span>
              <span className={s.rating}>{m.rating}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Декоративный элемент в стиле коллажа */}
      <div className="fixed bottom-10 left-10 text-wine/10 font-display text-9xl -z-10 select-none">
        M
      </div>
    </main>
  );
}
