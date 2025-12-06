'use server'

import { WeatherData } from "@/types/weather";

export async function getWeather(city: string): Promise<{ data?: WeatherData; error?: string }> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const baseUrl = process.env.OPENWEATHER_API_URL;

    if (!city) {
        return { error: "请输入城市名称" };
    }

    try {
        // 构建 URL: 设置单位为 metric (摄氏度), 语言为 zh_cn (中文)
        const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=zh_cn`;

        const response = await fetch(url, { cache: 'no-store' }); // 不缓存，保证实时性

        if (!response.ok) {
            if (response.status === 404) {
                return { error: "未找到该城市，请检查拼写" };
            }
            return { error: "获取天气数据失败，请稍后再试" };
        }

        const data: WeatherData = await response.json();
        return { data };

    } catch (error) {
        console.error("API Error:", error);
        return { error: "网络连接错误" };
    }
}