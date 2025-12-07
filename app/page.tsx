'use client'

import { useState } from "react";
import { getWeather } from "@/actions/getWeather";
import { WeatherData } from "@/types/weather";
import { Search, MapPin, Wind, Droplets, Thermometer, CloudSun } from "lucide-react";
import AdUnit from "@/components/AdUnit";

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

  // 从环境变量获取 AdSense ID
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";

  return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 md:p-6">

        {/* 主卡片容器：增加了边框发光和更强的毛玻璃效果 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300">

          {/* 顶部区域：标题与搜索 */}
          <div className="p-6 pb-2">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
              <CloudSun className="text-blue-600" />
              <span>天气助手</span>
            </h1>

            <form onSubmit={handleSearch} className="relative group">
              <input
                  type="text"
                  placeholder="请输入城市 (如: Beijing, Shanghai)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400 shadow-sm group-hover:shadow-md"
              />
              <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                ) : (
                    <Search size={18} />
                )}
              </button>
            </form>
          </div>

          {/* 内容区域：根据状态变化 */}
          <div className="px-6 flex-1">
            {/* 错误状态 */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-fade-in">
                  ⚠️ {error}
                </div>
            )}

            {/* 初始空状态 */}
            {!weather && !loading && !error && (
                <div className="py-12 text-center text-gray-400">
                  <CloudSun size={64} className="mx-auto mb-4 opacity-20" />
                  <p>输入城市名称，探索世界天气</p>
                </div>
            )}

            {/* 天气数据展示 */}
            {weather && (
                <div className="mt-4 space-y-6 animate-fade-in-up">

                  {/* 核心天气展示 */}
                  <div className="text-center relative py-4">
                <span className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full text-sm text-gray-600 mb-2 shadow-sm border border-white/50">
                  <MapPin size={14} />
                  {weather.name}, {weather.sys.country}
                </span>

                    <div className="flex flex-col items-center justify-center">
                      <img
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                          alt={weather.weather[0].description}
                          className="w-32 h-32 -my-4 drop-shadow-lg filter"
                      />
                      <div className="relative">
                    <span className="text-7xl font-black text-gray-800 tracking-tighter">
                      {Math.round(weather.main.temp)}°
                    </span>
                      </div>
                      <p className="text-lg font-medium text-gray-500 capitalize mt-1">
                        {weather.weather[0].description}
                      </p>
                    </div>
                  </div>

                  {/* 详细数据卡片网格 */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <WeatherDetailCard
                        icon={<Thermometer size={20} className="text-orange-500" />}
                        label="体感温度"
                        value={`${Math.round(weather.main.feels_like)}°C`}
                    />
                    <WeatherDetailCard
                        icon={<Droplets size={20} className="text-blue-500" />}
                        label="湿度"
                        value={`${weather.main.humidity}%`}
                    />
                    <WeatherDetailCard
                        icon={<Wind size={20} className="text-teal-500" />}
                        label="风速"
                        value={`${weather.wind.speed} m/s`}
                    />
                    <WeatherDetailCard
                        icon={<div className="text-red-500 font-bold text-sm px-1">HI</div>}
                        label="最高温"
                        value={`${Math.round(weather.main.temp_max)}°C`}
                    />
                  </div>
                </div>
            )}
          </div>

          {/* 底部广告区域：整合在卡片内部 */}
          {adClient && adSlot && (
              <div className="bg-gray-50/50 border-t border-gray-100 p-4 mt-auto">
                <div className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-wider">Sponsored</div>
                <div className="min-h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-white/50">
                  <AdUnit
                      client={adClient}
                      slot={adSlot}
                      format="auto" // 放在容器内通常使用 auto 或 fluid
                  />
                </div>
              </div>
          )}
        </div>
      </main>
  );
}

// 提取一个小组件来复用样式，保持代码整洁
function WeatherDetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
      <div className="bg-white/40 border border-white/60 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-white/60 transition-colors">
        <div className="bg-white p-2 rounded-xl shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-sm font-bold text-gray-800">{value}</p>
        </div>
      </div>
  )
}