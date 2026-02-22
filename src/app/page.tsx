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
              genre: getVal(['жанр', 'genre', 'категория']),
              desc: getVal(['описание', 'description']),
              rating: getVal(['оценка', 'rating', 'рейтинг']),
              year: getVal(['год', 'year']),
              status: getVal(['смотрели', 'status', 'статус'])
            };
          }).filter(m => m.title);
          setMovies(data);
          setLoading(false);
        }
      });
    });
  }, []);

  // Умный фильтр: разбивает "Драма / Комедия" на отдельные пункты
  const categories = useMemo(() => {
    const all = new Set<string>();
    movies.forEach(m => {
      if (m.genre) {
        m.genre.split(/[/,;\\]/).forEach((g: string) => {
          const clean = g.trim().toUpperCase();
          if (clean && clean.length > 1) all.add(clean);
        });
      }
    });
    return ['ВСЕ', ...Array.from(all)].sort();
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-[#722f37] animate-pulse uppercase tracking-[0.3em]">Загрузка архива...</div>;

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Архив</h1>
        <p className={s.tagline}>Movie Collection / 2026</p>
      </header>

      <section className={s.controls}>
        <div className={s.fieldWrapper}>
          <label className={s.label}>Поиск</label>
          <input 
            type="text" 
            placeholder="Название или год..." 
            className={s.input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={s.fieldWrapper}>
          <label className={s.label}>Жанр</label>
          <select className={s.select} onChange={(e) => setSelectedGenre(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </section>

      <div className={s.grid}>
        {filtered.map((m, i) => {
          const isWatched = m.status?.toLowerCase() === 'да';
          return (
            <article 
              key={i} 
              className={`${s.card} ${isWatched ? s.cardWatched : s.cardNotWatched}`}
            >
              <span className={s.genreTag}>{m.genre}</span>
              <h2 className={s.movieTitle}>{m.title}</h2>
              <p className={s.description}>{m.desc}</p>
              
              <div className={s.footer}>
                <div className={s.info}>
                  <span>{m.year} ГОД</span><br/>
                  <span className={isWatched ? "font-bold text-[#722f37]" : ""}>
                    {isWatched ? "● ПРОСМОТРЕНО" : "○ В ОЧЕРЕДИ"}
                  </span>
                </div>
                <div className={s.ratingBox}>
                  <span className={s.ratingLabel}>ОЦЕНКА</span>
                  <span className={s.ratingValue}>{m.rating || '—'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
