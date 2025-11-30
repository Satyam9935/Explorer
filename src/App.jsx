import { useState, useEffect } from 'react';

function App() {
  const [photoData, setPhotoData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load favorites from LocalStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nasaFavorites')) || [];
    setFavorites(saved);
  }, []);

  // 2. Fetch logic
  const fetchPhoto = async (dateToFetch) => {
    setLoading(true);
    try {
      // REPLACE 'DEMO_KEY' WITH YOUR ACTUAL KEY
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

  // 3. Fetch when date changes
  useEffect(() => {
    fetchPhoto(date);
  }, [date]);

  // 4. Save/Remove Favorites
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

  if (!photoData) return <div className="p-10 text-center">Booting up telescope...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-8">
      
      {/* LEFT: Main Viewer */}
      <div className="flex-1">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              NASA Time Travel
            </h1>
            <p className="text-gray-400 text-sm">Explore the universe, one day at a time.</p>
          </div>
          
          {/* Date Picker Input */}
          <input 
            type="date" 
            value={date}
            max={new Date().toISOString().split('T')[0]} // Cannot pick future dates
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 text-white p-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </header>

        {/* Image/Video Display Card */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 shadow-2xl backdrop-blur-sm">
          {loading ? (
            <div className="h-96 flex items-center justify-center text-gray-400 animate-pulse">
              Loading space data...
            </div>
          ) : (
            <>
              {photoData.media_type === "video" ? (
                <div className="aspect-video w-full mb-4">
                  <iframe 
                    src={photoData.url} 
                    className="w-full h-full rounded-lg"
                    title="NASA Video"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img 
                  src={photoData.hdurl || photoData.url} 
                  alt={photoData.title} 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4"
                />
              )}

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{photoData.title}</h2>
                  <p className="text-gray-300 leading-relaxed max-w-2xl">{photoData.explanation}</p>
                </div>
                
                {/* Favorite Button */}
                <button 
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full transition-all ${
                    favorites.some(f => f.date === photoData.date)
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                  }`}
                >
                  {favorites.some(f => f.date === photoData.date) ? '♥ Saved' : '♡ Save'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Sidebar (Favorites) */}
      <div className="w-full md:w-80 shrink-0">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 sticky top-4">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Saved Moments</h3>
          {favorites.length === 0 ? (
            <p className="text-gray-500 text-sm">No favorites yet. Go explore!</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav) => (
                <div 
                  key={fav.date}
                  onClick={() => setDate(fav.date)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded cursor-pointer transition-colors border border-transparent hover:border-purple-500/50 group"
                >
                  <div className="text-xs text-blue-400 font-mono mb-1">{fav.date}</div>
                  <div className="font-medium text-sm line-clamp-1 group-hover:text-purple-300">
                    {fav.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;