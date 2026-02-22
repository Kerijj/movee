'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MoviePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState('ALL');

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    fetch(csvUrl).then(r => r.text()).then(text => {
      Papa.parse(text, {
        header: true,
        complete: (res) => {
          const data = res.data.map((row: any) => ({
            title: row['Название'] || row['title'],
            genre: row['Жанр'] || row['genre'],
            desc: row['Описание'] || row['description'],
            rating: row['Оценка'] || row['rating']
          })).filter(m => m.title);
          setMovies(data);
          setFiltered(data);
        }
      });
    });
  }, []);

  const filter = (genre: string) => {
    setActiveGenre(genre);
    if (genre === 'ALL') {
      setFiltered(movies);
    } else {
      setFiltered(movies.filter(m => m.genre?.toUpperCase() === genre));
    }
  };

  const genres = ['ALL', ...new Set(movies.map(m => m.genre?.toUpperCase()).filter(Boolean))];

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Archive</h1>
        <div className={s.filterBar}>
          {genres.map(g => (
            <button 
              key={g} 
              onClick={() => filter(g)}
              className={`${s.btnFilter} ${activeGenre === g ? s.btnActive : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </header>

      <div className={s.grid}>
        {filtered.map((m, i) => (
          <div key={i} className={s.card}>
            <span className={s.genre}>{m.genre}</span>
            <h2 className={s.movieTitle}>{m.title}</h2>
            <p className={s.description}>{m.desc}</p>
            <span className={s.rating}>{m.rating}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
