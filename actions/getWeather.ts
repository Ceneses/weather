'use server'

import { WeatherData } from "@/types/weather";

// 1. 增加 lang 参数，默认 'zh'
export async function getWeather(city: string, lang: string = "zh"): Promise<{ data?: WeatherData; error?: string }> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const geoUrlBase = "https://api.openweathermap.org/geo/1.0/direct";
    const weatherUrlBase = "https://api.openweathermap.org/data/2.5/weather";

    // 辅助变量：是否为中文环境
    const isZh = lang === "zh";

    if (!city) {
        return { error: isZh ? "请输入城市名称" : "Please enter a city name" };
    }

    try {
        // --- 第一步：通过 Geocoding API 获取经纬度 ---
        const geoRes = await fetch(
            `${geoUrlBase}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`,
            { cache: 'no-store' }
        );

        if (!geoRes.ok) {
            return { error: isZh ? "地理位置服务暂时不可用" : "Geocoding service unavailable" };
        }

        const geoData = await geoRes.json();

        // 没找到城市
        if (!geoData || geoData.length === 0) {
            return {
                error: isZh
                    ? "未找到该城市，请尝试输入完整的城市名（如：北京市）"
                    : "City not found, please try the full name (e.g., London)"
            };
        }

        const { lat, lon, local_names, name } = geoData[0];

        // 2. 根据语言选择城市显示名称
        // 如果是中文模式，优先取 zh；如果是英文模式，优先取 en，没有 en 就取默认 name
        let cityName = name;
        if (isZh) {
            cityName = local_names?.zh || name;
        } else {
            cityName = local_names?.en || name;
        }

        // --- 第二步：通过经纬度获取天气数据 ---
        // 3. 转换 API 需要的语言代码 (OpenWeatherMap 中文是 zh_cn, 英文是 en)
        const apiLang = isZh ? "zh_cn" : "en";

        const weatherRes = await fetch(
            `${weatherUrlBase}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${apiLang}`,
            { cache: 'no-store' }
        );

        if (!weatherRes.ok) {
            return { error: isZh ? "获取天气数据失败" : "Failed to fetch weather data" };
        }

        const weatherData: WeatherData = await weatherRes.json();

        // 将 Geocoding 获取到的本地化城市名覆盖回去
        weatherData.name = cityName;

        return { data: weatherData };

    } catch (error) {
        console.error("API Error:", error);
        return { error: isZh ? "网络连接错误" : "Network connection error" };
    }
}