import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import { LayoutTemplate, Radio, Play, Pause } from 'lucide-react';

const STATIONS = [
  { name: 'Arabesk FM (Arabesk)', genre: 'Arabesk', url: 'http://anadolu.liderhost.com.tr:6688/;' },
  { name: 'Kafa FM (Pop)', genre: 'Pop', url: 'https://moondigitaledge2.radyotvonline.net/kafaradyo/playlist.m3u8' },
  { name: 'Power FM', genre: 'Yabancı Pop', url: 'https://listen.powerapp.com.tr/powerfm/abr/powerfm/128/playlist.m3u8', type: 'm3u8' },
  { name: 'PowerTürk', genre: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturk/abr/powerturk/128/playlist.m3u8', type: 'm3u8' },
  { name: 'Alem FM', genre: 'Türkçe Pop', url: 'https://turkmedya.radyotvonline.net/alemfmaac', type: 'aac' },
  { name: 'PowerTürk Dans', genre: 'Dans', url: 'https://listen.powerapp.com.tr/powerturkdans/abr/powerturkdans/128/playlist.m3u8', type: 'm3u8' },
  { name: 'PowerTürk Akustik', genre: 'Akustik', url: 'https://listen.powerapp.com.tr/powerturkakustik/abr/powerturkakustik/128/playlist.m3u8', type: 'm3u8' },
  { name: 'Akustikland', genre: 'Akustik', url: 'https://moondigitaledge.radyotvonline.net/akustikland/playlist.m3u8', type: 'm3u8' },
  { name: 'Power Smooth Jazz', genre: 'Jazz / Lounge', url: 'https://listen.powerapp.com.tr/powersmoothjazz/abr/powersmoothjazz/128/playlist.m3u8', type: 'm3u8' },
  { name: 'Borusan Klasik', genre: 'Klasik Müzik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK_SC', type: 'mp3' },
  { name: "90'lar", genre: "90'lar", url: 'https://moondigitalmaster.radyotvonline.net/90lar/playlist.m3u8', type: 'm3u8' },
  { name: 'Doksanlar', genre: "90'lar", url: 'https://moondigitaledge.radyotvonline.net/radyolanddoksanlar/playlist.m3u8', type: 'm3u8' },
  { name: 'Arabeskland', genre: 'Arabesk', url: 'https://moondigitalmaster.radyotvonline.net/arabeskland/playlist.m3u8', type: 'm3u8' },
  { name: 'TRT Türkü', genre: 'Türkü / Halk', url: 'https://trkvz-radyolar.ercdn.net/trtturku/playlist.m3u8', type: 'm3u8' },
  { name: 'Power FM (Arabesk)', genre: 'Arabesk', url: 'https://listen.powerapp.com.tr/powerfm/abr/powerfm/128/playlist.m3u8' },
  { name: 'Alem FM (Arabesk)', genre: 'Arabesk', url: 'https://turkmedya.radyotvonline.net/alemfmaac' },
  { name: 'Power Akustik (Arabesk)', genre: 'Arabesk', url: 'https://listen.powerapp.com.tr/powerturkakustik/abr/powerturkakustik/128/playlist.m3u8' },
  { name: 'Baba Radyo (Arabesk)', genre: 'Arabesk', url: 'http://37.247.98.7:80/;stream.mp3' },
  { name: 'Pal Nostalji (90lar)', genre: "90'lar", url: 'http://shoutcast.radyogrup.com:1010/;' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuth') === 'true'
  );
  const [stationIndex, setStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const selectedStation = STATIONS[stationIndex];

  const playRadio = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Radyo başlatılamadı:', error);
    }
  };

  const pauseRadio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleStationChange = async (e) => {
    const nextIndex = Number(e.target.value);
    setStationIndex(nextIndex);

    if (audioRef.current) {
      audioRef.current.src = STATIONS[nextIndex].url;
      if (isPlaying) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Yeni radyo başlatılamadı:', error);
          setIsPlaying(false);
        }
      }
    }
  };

  // Giriş yapılmamışsa sadece Login sayfasını göster
  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2 text-xl font-black text-gray-900">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            DZY Katalog
          </div>
          <button 
            onClick={() => {
              sessionStorage.removeItem('isAuth');
              window.location.reload();
            }}
            className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            GÜVENLİ ÇIKIŞ
          </button>
        </header>
        
        <main className="flex-1 pb-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
              <Radio className="w-4 h-4 text-blue-600" />
              Canlı Radyo
            </div>

            <select
              value={stationIndex}
              onChange={handleStationChange}
              className="flex-1 min-w-[220px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATIONS.map((station, index) => (
                <option key={`${station.name}-${index}`} value={index}>
                  {station.name} {station.genre ? `• ${station.genre}` : ''}
                </option>
              ))}
            </select>

            <button
              onClick={isPlaying ? pauseRadio : playRadio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Duraklat' : 'Oynat'}
            </button>

            <a
              href={selectedStation.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Yayını Yeni Sekmede Aç
            </a>
          </div>
          <audio ref={audioRef} src={selectedStation.url} preload="none" />
        </div>
      </div>
    </Router>
  );
}

export default App;
