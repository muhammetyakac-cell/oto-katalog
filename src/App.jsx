import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import { LayoutTemplate, Radio } from 'lucide-react';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuth') === 'true'
  );
  const [selectedStationUrl, setSelectedStationUrl] = useState(STATIONS[0].url);

  const selectedStation = useMemo(
    () => STATIONS.find((station) => station.url === selectedStationUrl) ?? STATIONS[0],
    [selectedStationUrl]
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

        <main className="flex-1 pb-40">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-blue-100 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Radio className="h-4 w-4 text-blue-600" />
              Canlı Radyo
            </div>
            <select
              value={selectedStationUrl}
              onChange={(event) => setSelectedStationUrl(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:max-w-sm"
            >
              {STATIONS.map((station) => (
                <option key={`${station.name}-${station.url}`} value={station.url}>
                  {station.genre ? `${station.name} — ${station.genre}` : station.name}
                </option>
              ))}
            </select>
            <audio key={selectedStation.url} controls preload="none" className="w-full md:flex-1">
              <source src={selectedStation.url} type="audio/mpeg" />
              Tarayıcınız audio oynatmayı desteklemiyor.
            </audio>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
