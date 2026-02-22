'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { s } from './styles';

export default function MovieArchive() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ВСЕ');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>(''); // Для поиска ошибок

  useEffect(() => {
    // Ссылка на экспорт в CSV
    const csvUrl = "https://docs.google.com/spreadsheets/d/1pge7MWZuBDMc_3gRfNYwnwBUVDDMA-g3emCDbGlZFwc/export?format=csv";
    
    fetch(csvUrl)
      .then(r => r.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            if (res.data.length === 0) {
              setDebugInfo("Таблица пуста");
              setLoading(false);
              return;
            }

            // Выводим заголовки, которые видит код, в консоль (F12)
            console.log("Заголовки таблицы:", Object.keys(res.data[0]));

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
                status: getVal(['смотрели', 'статус', 'status'])
              };
            }).filter(m => m.title && m.title.trim() !== "");

            if (data.length === 0) {
              setDebugInfo("Колонки не найдены. Проверь названия в таблице.");
            }

            setMovies(data);
            setLoading(false);
          },
          error: (err) => {
            setDebugInfo("Ошибка парсинга: " + err.message);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setDebugInfo("Ошибка загрузки: " + err.message);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const all = new Set<string>();
    movies.forEach(m => {
      if (m.genre) {
        m.genre.split(/[\\/;,]/).forEach((g: string) => {
          const clean = g.trim().toUpperCase();
          if (clean) all.add(clean);
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
      const matchesSearch = !search || 
        (m.title && m.title.toLowerCase().includes(q)) || 
        (m.year && m.year.toString().includes(q));
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-[#722f37] bg-[#fdfaf6]">
      <div className="animate-pulse tracking-widest uppercase text-xs">Подключение к архиву...</div>
    </div>
  );

  return (
    <main className={s.container}>
      <header className={s.hero}>
        <h1 className={s.bigTitle}>Архив</h1>
        <p className={s.tagline}>Всего записей: {movies.length}</p>
      </header>

      {/* Если фильмов нет, покажем инфо об ошибке */}
      {movies.length === 0 && (
        <div className="p-10 border border-dashed border-[#722f37]/20 rounded-3xl text-center font-mono text-[10px] text-[#722f37]/50">
          {debugInfo || "Данные не найдены. Проверьте доступ к таблице."}
        </div>
      )}

      {movies.length > 0 && (
        <>
          <section className={s.controls}>
            <div className={s.fieldWrapper}>
              <label className={s.label}>Поиск</label>
              <input 
                type="text" 
                placeholder="Название..." 
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
                      <span className={s.infoItem}>{m.year} ГОД</span>
                      <span className={s.infoItem}>
                        {isWatched ? "● ПРОСМОТРЕНО" : "○ В ОЧЕРЕДИ"}
                      </span>
                    </div>
                    <div className={s.ratingBox}>
                      <span className={s.infoItem}>ОЦЕНКА</span>
                      <span className={s.ratingStars}>{m.rating || '—'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
