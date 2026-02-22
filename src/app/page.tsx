'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

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
                names.some(n => k.toLowerCase().trim() === n.toLowerCase())
              );
              return key ? row[key]?.toString().trim() : "";
            };

            const title = getVal(['название', 'фильм', 'title']);
            const genre = getVal(['жанр', 'genre']);
            const desc = getVal(['описание', 'description']);
            const year = getVal(['год', 'year']);
            const rawStatus = getVal(['смотрели', 'статус', 'status']);
            const rating = getVal(['оценка', 'рейтинг', 'rating']);

            // ЛОГИКА СТАТУСА: 
            // Если в колонке "Смотрели" пусто — значит в очереди.
            // Если там хоть что-то написано — значит просмотрено.
            const isWatched = rawStatus !== ""; 

            return { title, genre, desc, year, isWatched, rating };
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
        m.year.toLowerCase().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, search]);

  if (loading) return (
    <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background:'#FDF0E5', color:'#8E443D', fontFamily:'monospace', letterSpacing:'4px'}}>
      АНАЛИЗ СПИСКА...
    </div>
  );

  return (
    <div style={{background: '#FDF0E5', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', color: '#8E443D'}}>
      <style>{`
        .movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; max-width: 1100px; margin: 0 auto; }
        .card { background: white; padding: 40px; border-radius: 50px; box-shadow: 0 4px 15px rgba(142,68,61,0.05); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; position: relative; border: none; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(142,68,61,0.12); }
        
        /* Цвет для ПРОСМОТРЕННЫХ (Персиковый) */
        .card.watched { background: #F7D8C4; }
        
        /* Цвет для ТЕХ КТО В ОЧЕРЕДИ (Белый) */
        .card.queue { background: #FFFFFF; }

        .search-input { background: white; border: none; border-radius: 25px; padding: 15px 25px; width: 300px; color: #8E443D; outline: none; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .genre-select { background: #E88E7D; color: white; border: none; border-radius: 25px; padding: 15px 25px; font-weight: bold; cursor: pointer; outline: none; box-shadow: 0 4px 15px rgba(232,142,125,0.3); }
        
        .badge { background: rgba(255,255,255,0.5); padding: 6px 14px; border-radius: 20px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .status-tag { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 12px; display: block; text-transform: uppercase; }
        .rating-val { font-size: 64px; font-weight: 900; line-height: 0.8; font-style: italic; letter-spacing: -2px; }
      `}</style>

      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <header style={{textAlign:'center', marginBottom: '60px'}}>
          <h1 style={{fontSize: 'clamp(40px, 8vw, 85px)', fontWeight: '900', textTransform: 'uppercase', margin: '0', letterSpacing: '-5px', lineHeight: 0.9}}>Архив</h1>
          <p style={{fontFamily:'monospace', opacity: 0.4, letterSpacing: '6px', fontSize: '10px', marginTop: '10px'}}>PERSONAL COLLECTION 2026</p>
        </header>

        <div style={{display:'flex', gap:'20px', justifyContent:'center', marginBottom: '60px', flexWrap: 'wrap'}}>
          <input type="text" placeholder="Найти фильм..." className="search-input" onChange={(e) => setSearch(e.target.value)} />
          <select className="genre-select" onChange={(e) => setSelectedGenre(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="movie-grid">
          {filtered.map((m, i) => (
            <article key={i} className={`card ${m.isWatched ? 'watched' : 'queue'}`}>
              <span className="status-tag" style={{ opacity: m.isWatched ? 1 : 0.4 }}>
                {m.isWatched ? '● Смотрели' : '○ В очереди'}
              </span>
              
              <span style={{fontSize:'10px', fontWeight:'900', opacity:0.3, letterSpacing:'2px', marginBottom:'10px'}}>{m.genre}</span>
              <h2 style={{fontSize:'30px', fontWeight:'900', margin:'0 0 15px 0', lineHeight:'1.1'}}>{m.title}</h2>
              <p style={{fontSize:'14px', opacity:0.7, lineHeight:'1.6', marginBottom:'40px', flexGrow: 1}}>{m.desc}</p>
              
              <div style={{marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(142,68,61,0.08)', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                <div>
                  <span className="badge">{m.year}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{fontSize:'9px', fontWeight:'900', opacity:0.2, display:'block', marginBottom: '5px'}}>ОЦЕНКА</span>
                  <span className="rating-val">{m.rating || '—'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <footer style={{marginTop:'80px', paddingBottom:'60px', textAlign:'center', opacity:0.3, fontFamily:'monospace', fontSize:'10px', letterSpacing:'3px'}}>
          БАЗА ДАННЫХ ОБНОВЛЕНА • {filtered.length} ФИЛЬМОВ
        </footer>
      </div>
    </div>
  );
}
