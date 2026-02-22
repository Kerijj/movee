'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ВСЕ');
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
              const key = Object.keys(row).find(k => names.some(n => k.toLowerCase().trim() === n.toLowerCase()));
              return key ? row[key] : "";
            };

            return {
              title: getVal(['название', 'title', 'фильм']),
              genre: getVal(['жанр', 'genre']),
              desc: getVal(['описание', 'description']),
              rating: getVal(['оценка', 'rating']),
              year: getVal(['год', 'year']),
              watched: getVal(['смотрели', 'status'])?.toLowerCase() === 'да'
            };
          }).filter(m => m.title);
          setMovies(data);
          setLoading(false);
        }
      });
    });
  }, []);

  // Собираем все уникальные жанры, разделяя их запятыми или слешами
  const categories = useMemo(() => {
    const allGenres = new Set<string>();
    movies.forEach(m => {
      if (m.genre) {
        m.genre.split(/[/,]/).forEach((g: string) => {
          const trimmed = g.trim().toUpperCase();
          if (trimmed) allGenres.add(trimmed);
        });
      }
    });
    return ['ВСЕ', ...Array.from(allGenres)].sort();
  }, [movies]);

  const filtered = useMemo(() => {
    return movies.filter(m => {
      const matchesGenre = selectedGenre === 'ВСЕ' || 
        (m.genre && m.genre.toUpperCase().includes(selectedGenre));
      const q = search.toLowerCase();
      const matchesSearch = !search || m.title.toLowerCase().includes(q) || m.year.toString().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-[#722f37] animate-pulse">ЗАГРУЗКА АРХИВА...</div>;

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Архив</h1>
        <p className={s.tagline}>Личная коллекция / 2026</p>
      </header>

      <section className={s.controls}>
        <div className={s.fieldWrapper}>
          <label className={s.label}>Поиск фильма</label>
          <input 
            type="text"
            placeholder="Название или год..."
            className={s.input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={s.fieldWrapper}>
          <label className={s.label}>Категория</label>
          <select 
            className={s.select}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </section>

      <div className={s.grid}>
        {filtered.map((m, i) => (
          <article 
            key={i} 
            className={`${s.card} ${m.watched ? s.cardWatched : s.cardNotWatched}`}
          >
            <span className={s.genreTag}>{m.genre}</span>
            <h2 className={s.movieTitle}>{m.title}</h2>
            <p className={s.description}>{m.desc}</p>
            <div className={s.footer}>
              <div className={s.info}>
                <span>ГОД: {m.year}</span>
                <br />
                <span>СТАТУС: {m.watched ? 'ПРОСМОТРЕНО' : 'В ОЧЕРЕДИ'}</span>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono opacity-40 uppercase">Оценка</div>
                <span className={s.rating}>{m.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="fixed bottom-10 right-10 opacity-5 text-[#722f37] font-display text-[20vw] pointer-events-none -z-10">
        А
      </div>
    </main>
  );
}
