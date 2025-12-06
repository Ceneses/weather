// src/app/ads.txt/route.ts

export async function GET() {
    // 从环境变量读取内容，如果没有配置则返回空字符串或默认值
    const adsenseContent = process.env.ADSENSE_CONTENT || '';

    return new Response(adsenseContent, {
        headers: {
            'Content-Type': 'text/plain', // 必须声明为纯文本
        },
    });
}