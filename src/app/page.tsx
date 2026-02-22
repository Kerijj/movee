'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

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
              const key = Object.keys(row).find(k => 
                names.some(n => k.toLowerCase().trim().includes(n.toLowerCase()))
              );
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
      const matchesGenre = selectedGenre === 'ВСЕ ЖАНРЫ' || 
        (m.genre && m.genre.toUpperCase().includes(selectedGenre));
      const q = search.toLowerCase();
      const matchesSearch = !search || 
        m.title.toLowerCase().includes(q) || 
        m.year.toString().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF0E5] text-[#8E443D] font-mono tracking-widest uppercase">
      Загрузка коллекции...
    </div>
  );

  return (
    <main className={s.container}>
      <div className={s.wrapper}>
        
        <header className={s.header}>
          <h1 className={s.bigTitle}>Архив</h1>
          <p className={s.tagline}>Curated Collection / Vol. 2026</p>
        </header>

        <section className={s.controls}>
          <div className={s.fieldWrapper}>
            <span className={s.label}>Поиск по названию</span>
            <input 
              type="text" 
              placeholder="Введите название или год..." 
              className={s.input} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className={s.fieldWrapper}>
            <span className={s.label}>Выбрать категорию</span>
            <select className={s.select} onChange={(e) => setSelectedGenre(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </section>

        <div className={s.grid}>
          {filtered.map((m, i) => {
            const isWatched = m.status?.toLowerCase() === 'да';
            return (
              <article key={i} className={`${s.card} ${isWatched ? s.cardWatched : s.cardNotWatched}`}>
                <span className={s.genreTag}>{m.genre}</span>
                <h2 className={s.movieTitle}>{m.title}</h2>
                <p className={s.description}>{m.desc}</p>
                
                <div className={s.cardFooter}>
                  <div className={s.badgeStack}>
                    <span className={s.badge}>{m.year} ГОД</span>
                    <span className={s.badge}>{isWatched ? "● ПРОСМОТРЕНО" : "○ В ОЧЕРЕДИ"}</span>
                  </div>
                  <div className={s.ratingGroup}>
                    <span className={s.ratingLabel}>Rating</span>
                    <span className={s.ratingValue}>{m.rating || '0'}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <footer className={s.footer}>
          <p className={s.footerText}>Личный архив • Найдено записей: {filtered.length}</p>
        </footer>
      </div>
    </main>
  );
}
