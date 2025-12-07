'use client'

import { useState } from "react";
import { getWeather } from "@/actions/getWeather";
import { WeatherData } from "@/types/weather";
import {
  Search, MapPin, Wind, Droplets, Thermometer, CloudSun,
  Globe2, Zap, ShieldCheck, Heart
} from "lucide-react";
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

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center">

        {/* 顶部导航 */}
        <nav className="w-full p-6 flex justify-between items-center text-white/90 max-w-5xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <CloudSun className="text-white" /> 天气助手
          </div>
          <div className="text-sm font-medium opacity-80 hidden md:block">
            全球实时气象数据支持
          </div>
        </nav>

        <main className="flex-1 w-full max-w-5xl p-4 md:p-6 flex flex-col items-center gap-8">

          {/* ———————————— 主卡片 ———————————— */}
          {/* 修改点1: max-w-4xl 让桌面端更宽敞 */}
          <section className="w-full max-w-md md:max-w-4xl transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

              {/* 顶部区域：标题与搜索 */}
              {/* 修改点2: 统一 Padding 为 p-6 md:p-10，确保上下对齐 */}
              <div className="p-6 md:p-10 pb-2 border-b border-white/20">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-2">
                  <span>实时天气查询</span>
                </h1>

                {/* 修改点3: 删除 max-w-xl mx-auto，改为 w-full，使其与下方内容边缘对齐 */}
                <form onSubmit={handleSearch} className="relative group w-full">
                  <input
                      type="text"
                      placeholder="请输入城市 (如: Beijing, London)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-6 pr-14 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400 shadow-sm group-hover:shadow-md text-lg"
                      aria-label="城市搜索"
                  />
                  <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-3 top-3 bottom-3 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      aria-label="搜索"
                  >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    ) : (
                        <Search size={22} />
                    )}
                  </button>
                </form>
              </div>

              {/* 内容区域 */}
              {/* 修改点4: Padding 保持与顶部一致 px-6 md:px-10 */}
              <div className="px-6 md:px-10 py-6 flex-1 min-h-[300px] flex flex-col">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-fade-in mb-4">
                      ⚠️ {error}
                    </div>
                )}

                {!weather && !loading && !error && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                      <CloudSun size={100} className="mb-6 opacity-20" />
                      <p className="text-xl">输入城市名称，获取精准天气预报</p>
                    </div>
                )}

                {weather && (
                    // 桌面端布局：左侧信息，右侧网格，中间 gap 加大
                    <div className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-16 pb-4 h-full">

                      {/* 左侧：天气状态 (视觉居中) */}
                      <div className="flex flex-col items-center justify-center md:w-5/12 text-center py-4">
                    <span className="inline-flex items-center gap-2 bg-white/50 px-5 py-2 rounded-full text-gray-600 mb-6 shadow-sm border border-white/50">
                      <MapPin size={18} />
                      <span className="font-semibold text-lg">{weather.name}, {weather.sys.country}</span>
                    </span>

                        <div className="relative group cursor-default">
                          {/* 增加 hover 浮动效果 */}
                          <img
                              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                              alt={weather.weather[0].description}
                              className="w-40 h-40 -my-6 drop-shadow-2xl filter transform group-hover:-translate-y-2 transition-transform duration-500"
                          />
                        </div>

                        <div className="relative mt-2">
                      <span className="text-9xl font-black text-gray-800 tracking-tighter drop-shadow-sm">
                        {Math.round(weather.main.temp)}°
                      </span>
                        </div>
                        <p className="text-2xl font-medium text-gray-500 capitalize mt-2">
                          {weather.weather[0].description}
                        </p>
                      </div>

                      {/* 右侧：数据网格 (填满剩余空间，边缘与搜索框对齐) */}
                      <div className="md:w-7/12 w-full flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                          <WeatherDetailCard
                              icon={<Thermometer size={28} className="text-orange-500" />}
                              label="体感温度"
                              value={`${Math.round(weather.main.feels_like)}°C`}
                          />
                          <WeatherDetailCard
                              icon={<Droplets size={28} className="text-blue-500" />}
                              label="湿度"
                              value={`${weather.main.humidity}%`}
                          />
                          <WeatherDetailCard
                              icon={<Wind size={28} className="text-teal-500" />}
                              label="风速"
                              value={`${weather.wind.speed} m/s`}
                          />
                          <WeatherDetailCard
                              icon={<div className="text-red-500 font-bold text-xl px-1">HI</div>}
                              label="最高温"
                              value={`${Math.round(weather.main.temp_max)}°C`}
                          />
                        </div>
                      </div>

                    </div>
                )}
              </div>

              {/* 广告区域 */}
              {adClient && adSlot && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-4 mt-auto">
                    <div className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-wider">Sponsored</div>
                    <div className="min-h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-white/50">
                      <AdUnit client={adClient} slot={adSlot} format="auto" />
                    </div>
                  </div>
              )}
            </div>
          </section>

          {/* ———————————— SEO 内容 (宽度与主卡片保持一致) ———————————— */}
          <section className="w-full max-w-md md:max-w-4xl grid md:grid-cols-2 gap-6 text-white/90">
            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-300"/> 为什么选择天气助手？
              </h2>
              <div className="space-y-4 text-sm leading-relaxed opacity-90">
                <div className="flex gap-4">
                  <Globe2 className="shrink-0 text-blue-200 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-white text-base">全球覆盖</h3>
                    <p className="text-white/70">无论您在纽约、东京还是巴黎，只需输入城市名，即可获取当地实时气象数据。</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="shrink-0 text-green-200 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-white text-base">精准数据源</h3>
                    <p className="text-white/70">数据直接接入 OpenWeatherMap 专业气象卫星与基站，确保数据的准确性。</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
              <h2 className="text-xl font-bold mb-4">常见问题</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-1 text-base">如何查询更准确的城市？</h3>
                  <p className="text-white/70">建议使用英文拼音（如 Beijing）或英文名。如果是同名城市，可加上国家代码，例如 "London, UK"。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-base">数据多久更新一次？</h3>
                  <p className="text-white/70">我们的数据是实时的。每次您点击“搜索”按钮，系统都会向气象服务器请求最新的观测数据。</p>
                </div>
              </div>
            </article>
          </section>

        </main>

        <footer className="w-full py-8 text-center text-white/50 text-sm mt-auto">
          <p>© 2025 天气助手 (Weather Helper). All rights reserved.</p>
          <p className="mt-1">Powered by Next.js & OpenWeatherMap</p>
        </footer>

      </div>
  );
}

// 组件样式微调：更舒展
function WeatherDetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
      <div className="bg-white/40 border border-white/60 p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:bg-white/60 transition-colors h-full">
        <div className="bg-white p-3.5 rounded-xl shadow-sm shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-0.5">{label}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
  )
}