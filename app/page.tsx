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

        {/* 顶部导航占位（增加页面正式感） */}
        <nav className="w-full p-6 flex justify-between items-center text-white/90 max-w-5xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <CloudSun className="text-white" /> 天气助手
          </div>
          <div className="text-sm font-medium opacity-80 hidden md:block">
            全球实时气象数据支持
          </div>
        </nav>

        <main className="flex-1 w-full max-w-5xl p-4 md:p-6 flex flex-col items-center gap-12">

          {/* ———————————— 核心功能区 (工具卡片) ———————————— */}
          <section className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">

              {/* 搜索头 */}
              <div className="p-6 pb-2">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
                  <span>实时天气查询</span>
                </h1>

                <form onSubmit={handleSearch} className="relative group">
                  <input
                      type="text"
                      placeholder="请输入城市 (如: Beijing, London)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400 shadow-sm group-hover:shadow-md"
                      aria-label="城市搜索"
                  />
                  <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      aria-label="搜索"
                  >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    ) : (
                        <Search size={18} />
                    )}
                  </button>
                </form>
              </div>

              {/* 数据展示区 */}
              <div className="px-6 flex-1 min-h-[300px] flex flex-col">
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-fade-in">
                      ⚠️ {error}
                    </div>
                )}

                {!weather && !loading && !error && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-8">
                      <CloudSun size={64} className="mb-4 opacity-20" />
                      <p>输入城市名称，获取精准天气预报</p>
                    </div>
                )}

                {weather && (
                    <div className="mt-4 space-y-6 animate-fade-in-up pb-4">
                      <div className="text-center relative py-2">
                    <span className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full text-sm text-gray-600 mb-2 shadow-sm border border-white/50">
                      <MapPin size={14} />
                      {weather.name}, {weather.sys.country}
                    </span>
                        <div className="flex flex-col items-center justify-center">
                          <img
                              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                              alt={weather.weather[0].description}
                              className="w-28 h-28 -my-3 drop-shadow-lg filter"
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

                      <div className="grid grid-cols-2 gap-3">
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

          {/* ———————————— SEO 内容增强区 (新增部分) ———————————— */}
          <section className="w-full grid md:grid-cols-2 gap-6 text-white/90">

            {/* 特性介绍 */}
            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-300"/> 为什么选择天气助手？
              </h2>
              <div className="space-y-4 text-sm leading-relaxed opacity-90">
                <div className="flex gap-3">
                  <Globe2 className="shrink-0 text-blue-200" size={20} />
                  <div>
                    <h3 className="font-semibold text-white">全球覆盖</h3>
                    <p className="text-white/70">无论您在纽约、东京还是巴黎，只需输入城市名，即可获取当地实时气象数据。</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-green-200" size={20} />
                  <div>
                    <h3 className="font-semibold text-white">精准数据源</h3>
                    <p className="text-white/70">数据直接接入 OpenWeatherMap 专业气象卫星与基站，确保温度、湿度、风速等信息的准确性。</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="shrink-0 text-pink-200" size={20} />
                  <div>
                    <h3 className="font-semibold text-white">完全免费</h3>
                    <p className="text-white/70">致力于为旅行者、户外爱好者提供无门槛的即时天气查询服务，界面简洁无干扰。</p>
                  </div>
                </div>
              </div>
            </article>

            {/* 常见问题 (FAQ) - 对 SEO 非常友好 */}
            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">常见问题</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-1">如何查询更准确的城市？</h3>
                  <p className="text-white/70">建议使用英文拼音（如 Beijing）或英文名（如 London）。如果是同名城市，可以加上国家代码，例如 "London, UK"。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">显示的温度是什么单位？</h3>
                  <p className="text-white/70">我们默认使用摄氏度 (°C) 作为标准单位，符合大多数地区用户的使用习惯。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">数据多久更新一次？</h3>
                  <p className="text-white/70">我们的数据是实时的。每次您点击“搜索”按钮，系统都会向气象服务器请求最新的观测数据。</p>
                </div>
              </div>
            </article>

          </section>

        </main>

        {/* 页脚 - 增加信任度 */}
        <footer className="w-full py-6 text-center text-white/50 text-xs mt-auto">
          <p>© 2025 天气助手 (Weather Helper). All rights reserved.</p>
          <p className="mt-1">Powered by Next.js & OpenWeatherMap</p>
        </footer>

      </div>
  );
}

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