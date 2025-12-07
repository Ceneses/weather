'use client'

import { useState } from "react";
import { getWeather } from "@/actions/getWeather";
import { WeatherData } from "@/types/weather";
import {
  Search, MapPin, Wind, Droplets, Thermometer, CloudSun,
  Globe2, Zap, ShieldCheck, Heart, Languages
} from "lucide-react";
import AdUnit from "@/components/AdUnit";

// ———————————— 1. 定义翻译字典 ————————————
const translations = {
  zh: {
    title: "天气助手",
    subtitle: "全球实时气象数据支持",
    mainTitle: "实时天气查询",
    searchPlaceholder: "请输入城市 (如: Beijing, London)",
    searchButton: "搜索",
    errorEmpty: "请输入城市名",
    introTitle: "输入城市名称，获取精准天气预报",
    sponsored: "广告",
    feelsLike: "体感温度",
    humidity: "湿度",
    windSpeed: "风速",
    highTemp: "最高温",
    whyChoose: "为什么选择天气助手？",
    globalCover: "全球覆盖",
    globalDesc: "无论您在纽约、东京还是巴黎，只需输入城市名，即可获取当地实时气象数据。",
    accurateData: "精准数据源",
    accurateDesc: "数据直接接入 OpenWeatherMap 专业气象卫星与基站，确保数据的准确性。",
    faq: "常见问题",
    faq1Q: "如何查询更准确的城市？",
    faq1A: "建议使用英文拼音（如 Beijing）或英文名。如果是同名城市，可加上国家代码，例如 'London, UK'。",
    faq2Q: "数据多久更新一次？",
    faq2A: "我们的数据是实时的。每次您点击“搜索”按钮，系统都会向气象服务器请求最新的观测数据。",
    footerRights: "© 2025 天气助手. 保留所有权利。",
    footerPower: "由 Next.js & OpenWeatherMap 强力驱动"
  },
  en: {
    title: "Weather Helper",
    subtitle: "Global Real-time Meteorological Support",
    mainTitle: "Real-time Weather",
    searchPlaceholder: "Enter city name (e.g., Beijing, London)",
    searchButton: "Search",
    errorEmpty: "Please enter a city name",
    introTitle: "Enter city to explore global weather",
    sponsored: "Sponsored",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    highTemp: "High Temp",
    whyChoose: "Why Choose Us?",
    globalCover: "Global Coverage",
    globalDesc: "Whether in New York, Tokyo, or Paris, just enter the city name to get local real-time weather.",
    accurateData: "Accurate Source",
    accurateDesc: "Directly connected to OpenWeatherMap satellites and stations to ensure data accuracy.",
    faq: "FAQ",
    faq1Q: "How to search more accurately?",
    faq1A: "Use English names (e.g., Beijing). For cities with same names, add country code, e.g., 'London, UK'.",
    faq2Q: "How often is data updated?",
    faq2A: "Our data is real-time. Every time you click 'Search', we fetch the latest observation data.",
    footerRights: "© 2025 Weather Helper. All rights reserved.",
    footerPower: "Powered by Next.js & OpenWeatherMap"
  }
};

export default function Home() {
  // ———————————— 2. 添加语言状态 ————————————
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const t = translations[lang]; // 当前语言的文本对象

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

    // ———————————— 3. 调用 API 时传入 lang ————————————
    const result = await getWeather(city, lang);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setWeather(result.data);
    }

    setLoading(false);
  };

  // 切换语言的处理函数
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
    // 注意：切换语言后，如果当前已经有天气数据，建议清空或者重新请求（这里选择清空，简单处理）
    setWeather(null);
    setError("");
  };

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center">

        {/* 顶部导航 */}
        <nav className="w-full p-6 flex justify-between items-center text-white/90 max-w-5xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <CloudSun className="text-white" /> {t.title}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium opacity-80 hidden md:block">
              {t.subtitle}
            </div>

            {/* ———————————— 语言切换按钮 ———————————— */}
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm transition-all border border-white/30"
            >
              <Languages size={16} />
              <span className="font-semibold">{lang === 'zh' ? 'English' : '中文'}</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-5xl p-4 md:p-6 flex flex-col items-center gap-8">

          {/* ———————————— 主卡片 ———————————— */}
          <section className="w-full max-w-md md:max-w-4xl transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

              {/* 顶部区域：标题与搜索 */}
              <div className="p-6 md:p-10 pb-2 border-b border-white/20">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-2">
                  <span>{t.mainTitle}</span>
                </h1>

                <form onSubmit={handleSearch} className="relative group w-full">
                  <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-6 pr-14 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400 shadow-sm group-hover:shadow-md text-lg"
                      aria-label="Search city"
                  />
                  <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-3 top-3 bottom-3 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      aria-label={t.searchButton}
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
              <div className="px-6 md:px-10 py-6 flex-1 min-h-[300px] flex flex-col">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-fade-in mb-4">
                      ⚠️ {error}
                    </div>
                )}

                {!weather && !loading && !error && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                      <CloudSun size={100} className="mb-6 opacity-20" />
                      <p className="text-xl">{t.introTitle}</p>
                    </div>
                )}

                {weather && (
                    <div className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-16 pb-4 h-full">

                      {/* 左侧：天气状态 */}
                      <div className="flex flex-col items-center justify-center md:w-5/12 text-center py-4">
                    <span className="inline-flex items-center gap-2 bg-white/50 px-5 py-2 rounded-full text-gray-600 mb-6 shadow-sm border border-white/50">
                      <MapPin size={18} />
                      <span className="font-semibold text-lg">{weather.name}, {weather.sys.country}</span>
                    </span>

                        <div className="relative group cursor-default">
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
                        {/* 天气描述 API 会自动根据 lang 返回对应的语言 */}
                        <p className="text-2xl font-medium text-gray-500 capitalize mt-2">
                          {weather.weather[0].description}
                        </p>
                      </div>

                      {/* 右侧：数据网格 */}
                      <div className="md:w-7/12 w-full flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                          <WeatherDetailCard
                              icon={<Thermometer size={28} className="text-orange-500" />}
                              label={t.feelsLike}
                              value={`${Math.round(weather.main.feels_like)}°C`}
                          />
                          <WeatherDetailCard
                              icon={<Droplets size={28} className="text-blue-500" />}
                              label={t.humidity}
                              value={`${weather.main.humidity}%`}
                          />
                          <WeatherDetailCard
                              icon={<Wind size={28} className="text-teal-500" />}
                              label={t.windSpeed}
                              value={`${weather.wind.speed} m/s`}
                          />
                          <WeatherDetailCard
                              icon={<div className="text-red-500 font-bold text-xl px-1">HI</div>}
                              label={t.highTemp}
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
                    <div className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-wider">{t.sponsored}</div>
                    <div className="min-h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-white/50">
                      <AdUnit client={adClient} slot={adSlot} format="auto" />
                    </div>
                  </div>
              )}
            </div>
          </section>

          {/* ———————————— SEO 内容 ———————————— */}
          <section className="w-full max-w-md md:max-w-4xl grid md:grid-cols-2 gap-6 text-white/90">
            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-300"/> {t.whyChoose}
              </h2>
              <div className="space-y-4 text-sm leading-relaxed opacity-90">
                <div className="flex gap-4">
                  <Globe2 className="shrink-0 text-blue-200 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-white text-base">{t.globalCover}</h3>
                    <p className="text-white/70">{t.globalDesc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="shrink-0 text-green-200 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-white text-base">{t.accurateData}</h3>
                    <p className="text-white/70">{t.accurateDesc}</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
              <h2 className="text-xl font-bold mb-4">{t.faq}</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-1 text-base">{t.faq1Q}</h3>
                  <p className="text-white/70">{t.faq1A}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-base">{t.faq2Q}</h3>
                  <p className="text-white/70">{t.faq2A}</p>
                </div>
              </div>
            </article>
          </section>

        </main>

        <footer className="w-full py-8 text-center text-white/50 text-sm mt-auto">
          <p>{t.footerRights}</p>
          <p className="mt-1">{t.footerPower}</p>
        </footer>

      </div>
  );
}

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