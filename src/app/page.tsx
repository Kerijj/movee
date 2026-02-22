'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl)
      .then(r => r.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            const data = res.data.map((row: any) => {
              // Функция для поиска ключа в строке таблицы без учета регистра
              const getVal = (names: string[]) => {
                const key = Object.keys(row).find(k => 
                  names.some(n => k.toLowerCase().trim() === n.toLowerCase())
                );
                return key ? row[key] : "";
              };

              return {
                title: getVal(['название', 'title', 'фильм', 'имя']),
                genre: getVal(['жанр', 'genre', 'категория']),
                desc: getVal(['описание', 'description', 'инфо']),
                rating: getVal(['оценка', 'rating', 'рейтинг']),
                watched: getVal(['смотрели', 'status', 'статус'])
              };
            }).filter(m => m.title && m.title.length > 1); // Убираем пустые строки

            setMovies(data);
            setFiltered(data);
            setLoading(false);
          }
        });
      })
      .catch(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="py-20 text-center font-mono text-wine animate-pulse">
          ACCESSING RECORDS...
        </div>
      ) : (
        <>
          <nav className={s.filterBar}>
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleFilter(g as string)}
                className={`${s.btnFilter} ${activeGenre === g ? s.btnActive : ''}`}
              >
                {g as string}
              </button>
            ))}
          </nav>

          <div className={s.grid}>
            {filtered.map((m, i) => (
              <div key={i} className={s.card}>
                <div className="flex justify-between items-start mb-6">
                   <span className={s.genreTag}>{m.genre || 'MOVIE'}</span>
                   <span className="font-mono text-[10px] text-wine/40">#{String(i + 1).padStart(3, '0')}</span>
                </div>
                <h2 className={s.movieTitle}>{m.title}</h2>
                <p className={s.description}>{m.desc}</p>
                <div className="flex justify-between items-end mt-auto">
                  <span className={s.status}>
                    {m.watched?.toLowerCase() === 'да' ? '● RECORDED' : '○ PENDING'}
                  </span>
                  <span className={s.rating}>{m.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
