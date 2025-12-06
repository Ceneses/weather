'use server'

import { WeatherData } from "@/types/weather";

export async function getWeather(city: string): Promise<{ data?: WeatherData; error?: string }> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // 注意：此处不需要修改 .env，Geocoding API 和 Weather API 使用同一个 Key
    // 但我们需要 Geocoding 的 API 地址
    const geoUrlBase = "https://api.openweathermap.org/geo/1.0/direct";
    const weatherUrlBase = "https://api.openweathermap.org/data/2.5/weather";

    if (!city) {
        return { error: "请输入城市名称" };
    }

    try {
        // --- 第一步：通过 Geocoding API 获取经纬度 ---
        // limit=1 表示只取匹配度最高的那一个
        const geoRes = await fetch(
            `${geoUrlBase}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`,
            { cache: 'no-store' }
        );

        if (!geoRes.ok) {
            return { error: "地理位置服务暂时不可用" };
        }

        const geoData = await geoRes.json();

        // 如果数组为空，说明没找到这个中文城市
        if (!geoData || geoData.length === 0) {
            return { error: "未找到该城市，请尝试输入完整的城市名（如：北京市）" };
        }

        // 获取经纬度和英文名（API有时返回local_names，但这里主要取坐标）
        const { lat, lon, local_names, name } = geoData[0];

        // 优先显示中文名，如果没有则显示默认名
        const cityName = local_names?.zh || name;


        // --- 第二步：通过经纬度获取天气数据 ---
        // 使用 lat 和 lon 查询，比直接用名字查询更精准
        const weatherRes = await fetch(
            `${weatherUrlBase}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`,
            { cache: 'no-store' }
        );

        if (!weatherRes.ok) {
            return { error: "获取天气数据失败" };
        }

        const weatherData: WeatherData = await weatherRes.json();

        // 将 Geocoding 获取到的更准确的中文名覆盖回去（可选，为了显示更好看）
        // OpenWeatherMap 的 Weather 接口返回的 name 经常是拼音或英文
        weatherData.name = cityName;

        return { data: weatherData };

    } catch (error) {
        console.error("API Error:", error);
        return { error: "网络连接错误" };
    }
}