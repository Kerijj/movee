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
    // Ссылка на твою таблицу (формат CSV)
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl)
      .then(r => r.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            const data = res.data.map((row: any) => {
              // Функция гибкого поиска колонок (игнорирует пробелы и регистр)
              const getVal = (names: string[]) => {
                const key = Object.keys(row).find(k => 
                  names.some(n => k.toLowerCase().trim() === n.toLowerCase())
                );
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
            }).filter(m => m.title); // Убираем пустые строки

            setMovies(data);
            setLoading(false);
          }
        });
      });
  }, []);

  // Создание уникального списка жанров (дробим "Драма / Боевик")
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
    return ['ВСЕ ЖАНРЫ', ...Array.from(all)].sort();
  }, [movies]);

  // Логика фильтрации и поиска
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
    <div className="min-h-screen flex items-center justify-center bg-[#FDF0E5] text-[#8E443D] font-bold tracking-[0.3em] animate-pulse">
      ЗАГРУЗКА АРХИВА...
    </div>
  );

  return (
    <main className={s.container}>
      <div className={s.wrapper}>
        
        {/* ХЕДЕР (ШАПКА) */}
        <header className={s.header}>
          <h1 className={s.bigTitle}>Архив</h1>
          <p className={s.tagline}>Curated Collection / Vol. 2026</p>
        </header>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ (ФИЛЬТРЫ) */}
        <section className={s.controls}>
          <div className={s.fieldWrapper}>
            <label className={s.label}>Поиск по названию</label>
            <input 
              type="text" 
              placeholder="Найти фильм или год..." 
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

        {/* СЕТКА С КАРТОЧКАМИ */}
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
                
                <div className={s.cardFooter}>
                  <div className={s.badgeStack}>
                    <span className={s.badge}>{m.year} ГОД</span>
                    <span className={s.badge}>
                      {isWatched ? "● ПРОСМОТРЕНО" : "○ В ОЧЕРЕДИ"}
                    </span>
                  </div>
                  <div className={s.ratingGroup}>
                    <span className={s.ratingLabel}>Оценка</span>
                    <span className={s.ratingValue}>{m.rating || '—'}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ФУТЕР САЙТА */}
        <footer className={s.footer}>
          <p className={s.footerText}>
            Личный архив фильмов • 2026 • Всего в базе: {movies.length}
          </p>
        </footer>
        
      </div>
    </main>
  );
}
