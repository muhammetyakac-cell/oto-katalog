import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import { LayoutTemplate, Pause, Play, Radio, Volume2 } from 'lucide-react';

const STATIONS = [
  { name: 'Arabesk FM (Arabesk)', url: 'http://anadolu.liderhost.com.tr:6688/;' },
  { name: 'Kafa FM (Pop)', url: 'https://moondigitaledge2.radyotvonline.net/kafaradyo/playlist.m3u8' },
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
  { name: 'Power FM (Arabesk)', url: 'https://listen.powerapp.com.tr/powerfm/abr/powerfm/128/playlist.m3u8' },
  { name: 'Alem FM (Arabesk)', url: 'https://turkmedya.radyotvonline.net/alemfmaac' },
  { name: 'Power Akustik (Arabesk)', url: 'https://listen.powerapp.com.tr/powerturkakustik/abr/powerturkakustik/128/playlist.m3u8' },
  { name: 'Baba Radyo (Arabesk)', url: 'http://37.247.98.7:80/;stream.mp3' },
  { name: 'Pal Nostalji (90lar)', url: 'http://shoutcast.radyogrup.com:1010/;' },
];

function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(currentStation.url);
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.src = currentStation.url;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => console.log('Yükleniyor...'));
  };

  const changeStation = (station) => {
    if (!station) return;

    setCurrentStation(station);
    if (audioRef.current) {
      audioRef.current.src = station.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => console.log('Yükleniyor...'));
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 px-6 flex items-center justify-between z-[9999] shadow-2xl gap-3">
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <div className={`p-2.5 rounded-xl ${isPlaying ? 'bg-blue-600 animate-pulse' : 'bg-slate-800'}`}>
          <Radio className="text-white w-5 h-5" />
        </div>
        <div className="hidden md:block overflow-hidden">
          <p className="text-[10px] text-blue-400 font-black uppercase mb-0.5 tracking-tighter">CANLI MÜZİK</p>
          <p className="text-sm text-white font-bold truncate">{currentStation.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <select
          value={currentStation.name}
          onChange={(e) => changeStation(STATIONS.find((s) => s.name === e.target.value))}
          className="bg-slate-800 text-slate-200 text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg outline-none border border-slate-700 max-w-[170px] md:max-w-none"
        >
          {STATIONS.map((station) => (
            <option key={station.name} value={station.name} className="bg-slate-900">
              {station.name}
            </option>
          ))}
        </select>

        <button
          onClick={togglePlay}
          className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-slate-900" />
          ) : (
            <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
        <Volume2 className="w-4 h-4 text-slate-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume;
            }
          }}
          className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuth') === 'true'
  );

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

        <main className="flex-1 pb-28 md:pb-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <RadioPlayer />
      </div>
    </Router>
  );
}

export default App;
