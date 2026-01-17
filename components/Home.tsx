import React, { useEffect, useState } from 'react';
import { TabView, WeatherData } from '../types';
import { Calendar, CloudSun, MapPin, ArrowRight, Sun, Cloud, CloudRain, Snowflake, Navigation, ArrowUp, ArrowDown } from 'lucide-react';

interface HomeProps {
  setTab: (tab: TabView) => void;
}

const Home: React.FC<HomeProps> = ({ setTab }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState('釜山廣域市');

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      // Fetch current and daily forecast (3 days)
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`)
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setWeather({
              current: {
                temperature: data.current_weather.temperature,
                weathercode: data.current_weather.weathercode
              },
              daily: data.daily
            });
          }
        })
        .catch(err => console.error("Weather fetch failed", err));
    };

    // Default: Busan
    const busanLat = 35.1796;
    const busanLon = 129.0756;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationName('目前位置');
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation denied or error, using default.", error);
          fetchWeather(busanLat, busanLon);
        }
      );
    } else {
      fetchWeather(busanLat, busanLon);
    }
  }, []);

  const getWeatherIcon = (code: number, className = "mr-2") => {
    if (code <= 1) return <Sun size={16} className={`${className} text-yellow-500`} />;
    if (code <= 3) return <CloudSun size={16} className={`${className} text-slate-400`} />;
    if (code <= 67) return <CloudRain size={16} className={`${className} text-blue-400`} />;
    if (code <= 77) return <Snowflake size={16} className={`${className} text-blue-200`} />;
    return <Cloud size={16} className={`${className} text-slate-400`} />;
  };

  const getWeatherIconWhite = (code: number) => {
    if (code <= 1) return <Sun size={16} className="mr-2 text-yellow-300" />;
    if (code <= 3) return <CloudSun size={16} className="mr-2 text-white" />;
    if (code <= 67) return <CloudRain size={16} className="mr-2 text-blue-200" />;
    if (code <= 77) return <Snowflake size={16} className="mr-2 text-white" />;
    return <Cloud size={16} className="mr-2 text-white" />;
  };

  const getWeatherText = (code: number) => {
    if (code <= 1) return '晴朗';
    if (code <= 3) return '多雲';
    if (code <= 67) return '有雨';
    if (code <= 77) return '降雪';
    return '陰天';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const [exchangeRate, setExchangeRate] = useState<{ rate: number, date: string } | null>(null);
  const [twdAmount, setTwdAmount] = useState<string>('');
  const [krwAmount, setKrwAmount] = useState<string>('');

  useEffect(() => {
    const fetchRate = async () => {
      const { getExchangeRate } = await import('../services/exchange');
      const data = await getExchangeRate();
      if (data) {
        setExchangeRate({ rate: data.rate, date: data.lastUpdate });
      }
    };
    fetchRate();
  }, []);

  const handleTwdChange = (val: string) => {
    setTwdAmount(val);
    if (exchangeRate && val) {
      const krw = (parseFloat(val) * exchangeRate.rate).toFixed(0);
      setKrwAmount(krw);
    } else {
      setKrwAmount('');
    }
  };

  const handleKrwChange = (val: string) => {
    setKrwAmount(val);
    if (exchangeRate && val) {
      const twd = (parseFloat(val) / exchangeRate.rate).toFixed(1);
      setTwdAmount(twd);
    } else {
      setTwdAmount('');
    }
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-3xl p-8 text-white shadow-xl shadow-ocean-200/50 mb-6 relative overflow-hidden transition-all hover:shadow-ocean-300/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <h1 className="text-3xl font-bold mb-2 relative z-10">Busan Trip 2026</h1>
        <p className="text-ocean-50 mb-6 relative z-10 font-medium">1/22 - 1/28 七天六夜釜山行</p>

        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl text-sm flex items-center shadow-sm border border-white/10">
            {weather ? (
              <>
                {getWeatherIconWhite(weather.current.weathercode)}
                <span>{weather.current.temperature}°C {getWeatherText(weather.current.weathercode)}</span>
              </>
            ) : (
              <>
                <CloudSun size={16} className="mr-2" /> 載入氣象...
              </>
            )}
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl text-sm flex items-center shadow-sm border border-white/10">
            {locationName === '目前位置' ? <Navigation size={14} className="mr-2" /> : <MapPin size={16} className="mr-2" />}
            {locationName}
          </div>

        </div>
      </div>

      {/* Currency Converter Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 transition-all hover:shadow-md">
        <h3 className="text-sm font-bold text-ocean-700 mb-3 flex items-center justify-between">
          <span className="flex items-center"><ArrowUp size={16} className="mr-2 rotate-45 text-yellow-500" /> 匯率換算</span>
          {exchangeRate && <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">1 TWD ≈ {exchangeRate.rate} KRW</span>}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-slate-400 font-bold">TWD</label>
            <input
              type="number"
              value={twdAmount}
              onChange={(e) => handleTwdChange(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-ocean-400"
              placeholder="0"
            />
          </div>
          <div className="text-slate-300">
            <ArrowRight size={16} />
          </div>
          <div className="flex-1 relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-slate-400 font-bold">KRW</label>
            <input
              type="number"
              value={krwAmount}
              onChange={(e) => handleKrwChange(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-ocean-400"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      {weather && weather.daily && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-ocean-700 mb-3 flex items-center">
            <CloudSun size={16} className="mr-2" /> 未來預報
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {weather.daily.time.map((time, index) => (
              <div key={time} className="bg-ocean-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-500 mb-1">{index === 0 ? '今天' : formatDate(time)}</span>
                <div className="mb-1">{getWeatherIcon(weather.daily!.weathercode[index], "")}</div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                  <span className="text-rose-500">{Math.round(weather.daily!.temperature_2m_max[index])}°</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-blue-500">{Math.round(weather.daily!.temperature_2m_min[index])}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTab(TabView.ITINERARY)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Calendar size={20} />
          </div>
          <h3 className="font-bold text-slate-800">行程表</h3>
          <p className="text-xs text-slate-400 mt-1">查看每日詳細安排</p>
        </button>

        <button
          onClick={() => setTab(TabView.WISHLIST)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <MapPin size={20} />
          </div>
          <h3 className="font-bold text-slate-800">願望清單</h3>
          <p className="text-xs text-slate-400 mt-1">食衣住行育樂</p>
        </button>

        <div
          className="col-span-2 bg-ocean-50 p-6 rounded-2xl border border-ocean-100 flex items-center justify-between cursor-pointer hover:bg-ocean-100 transition-colors group"
          onClick={() => setTab(TabView.CHECKLIST)}
        >
          <div>
            <h3 className="font-bold text-ocean-800">行李檢查</h3>
            <p className="text-sm text-ocean-600">別忘了護照和釜山 Pass！</p>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-ocean-500 shadow-sm group-hover:translate-x-1 transition-transform">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;