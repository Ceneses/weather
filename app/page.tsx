'use client'

import { useState } from "react";
import { getWeather } from "@/actions/getWeather";
import { WeatherData } from "@/types/weather";
import { Search, MapPin, Wind, Droplets, Thermometer } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    const result = await getWeather(city);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setWeather(result.data);
    }

    setLoading(false);
  };

  return (
      <main className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-6">

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            实时天气查询
          </h1>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
                type="text"
                placeholder="输入城市名 (如: Beijing, London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                  <Search size={20} />
              )}
            </button>
          </form>

          {/* 错误提示 */}
          {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p>{error}</p>
              </div>
          )}

          {/* 天气信息展示 */}
          {weather && (
              <div className="space-y-6 animate-fade-in">
                {/* 城市与主要天气 */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <MapPin size={18} />
                    <span className="text-xl font-semibold">{weather.name}, {weather.sys.country}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                        alt={weather.weather[0].description}
                        className="w-24 h-24"
                    />
                    <span className="text-6xl font-bold text-gray-800">
                  {Math.round(weather.main.temp)}°
                </span>
                  </div>
                  <p className="text-lg text-gray-600 capitalize">
                    {weather.weather[0].description}
                  </p>
                </div>

                {/* 详情网格 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                    <Thermometer className="text-blue-500" size={24} />
                    <div>
                      <p className="text-xs text-gray-500">体感温度</p>
                      <p className="font-semibold text-gray-800">{Math.round(weather.main.feels_like)}°C</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                    <Droplets className="text-blue-500" size={24} />
                    <div>
                      <p className="text-xs text-gray-500">湿度</p>
                      <p className="font-semibold text-gray-800">{weather.main.humidity}%</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                    <Wind className="text-blue-500" size={24} />
                    <div>
                      <p className="text-xs text-gray-500">风速</p>
                      <p className="font-semibold text-gray-800">{weather.wind.speed} m/s</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                    <div className="text-blue-500 font-bold text-lg px-1">HI</div>
                    <div>
                      <p className="text-xs text-gray-500">最高温</p>
                      <p className="font-semibold text-gray-800">{Math.round(weather.main.temp_max)}°C</p>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {!weather && !error && !loading && (
              <div className="text-center text-gray-500 mt-10">
                <p>输入城市名称开始查询</p>
              </div>
          )}

        </div>
      </main>
  );
}