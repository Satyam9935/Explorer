import { useState, useEffect } from 'react';

function App() {
  const [photoData, setPhotoData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nasaFavorites')) || [];
    setFavorites(saved);
  }, []);

  const fetchPhoto = async (dateToFetch) => {
    setLoading(true);
    try {
      // REPLACE 'DEMO_KEY' WITH YOUR ACTUAL KEY IF NEEDED
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateToFetch}`
      );
      const data = await res.json();
      setPhotoData(data);
    } catch (error) {
      console.error("Error fetching photo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto(date);
  }, [date]);

  const toggleFavorite = () => {
    let newFavorites;
    const isAlreadyFavorite = favorites.some((f) => f.date === photoData.date);
    if (isAlreadyFavorite) {
      newFavorites = favorites.filter((f) => f.date !== photoData.date);
    } else {
      newFavorites = [...favorites, { date: photoData.date, title: photoData.title }];
    }
    setFavorites(newFavorites);
    localStorage.setItem('nasaFavorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      
      {/* GLOW EFFECT BACKGROUND */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-50">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
      </div>

      <header className="w-full max-w-6xl mb-10 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-white drop-shadow-lg">
            COSMOS
          </h1>
          <p className="text-blue-200/80 tracking-widest text-sm mt-2 uppercase">NASA Time Travel Explorer</p>
        </div>
        
        {/* Custom Date Input Styling */}
        <div className="mt-4 md:mt-0 flex flex-col items-end">
            <label className="text-xs text-blue-300 mb-1">SELECT STARDATE</label>
            <input 
              type="date" 
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/10 text-white p-3 rounded-lg border border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-white/20 transition-all text-lg"
            />
        </div>
      </header>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        
        {/* MAIN GLASS CARD */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
          
          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {loading || !photoData ? (
            <div className="h-96 flex flex-col items-center justify-center text-blue-200 animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Aligning Satellite Array...</p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              {/* Image Container with Zoom Effect */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 relative group/image">
                {photoData.media_type === "video" ? (
                  <div className="aspect-video w-full">
                    <iframe 
                      src={photoData.url} 
                      className="w-full h-full"
                      title="NASA Video"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <img 
                      src={photoData.hdurl || photoData.url} 
                      alt={photoData.title} 
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover/image:scale-105"
                    />
                    {/* Copyright badge if it exists */}
                    {photoData.copyright && (
                       <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-xs px-2 py-1 rounded text-white/80">
                         © {photoData.copyright}
                       </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-white leading-tight">{photoData.title}</h2>
                  <p className="text-blue-100/80 leading-relaxed font-light text-lg">{photoData.explanation}</p>
                </div>
                
                <button 
                  onClick={toggleFavorite}
                  className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                    favorites.some(f => f.date === photoData.date)
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white ring-2 ring-red-400/50' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {favorites.some(f => f.date === photoData.date) ? '♥ Saved to Log' : '♡ Add to Log'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR GLASS CARD */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-6 h-[fit-content] max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold mb-6 text-blue-200 border-b border-white/10 pb-4 flex items-center gap-2">
              <span>✦</span> Captain's Log
            </h3>
            
            {favorites.length === 0 ? (
              <div className="text-center py-10 text-white/30 italic border-2 border-dashed border-white/10 rounded-xl">
                No discoveries logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <div 
                    key={fav.date}
                    onClick={() => setDate(fav.date)}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all group relative overflow-hidden"
                  >
                    {/* Hover highlight bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="text-xs text-blue-400 mb-1 font-mono tracking-wider">{fav.date}</div>
                    <div className="font-medium text-white/90 truncate group-hover:text-purple-200 transition-colors">
                      {fav.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;