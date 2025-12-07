"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
    client: string;
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    responsive?: string;
    layoutKey?: string; // 文章内嵌广告有时需要 layoutKey
}

export default function AdUnit({
                                   client,
                                   slot,
                                   format = "fluid", // 文章内嵌通常使用 fluid
                                   responsive = "true",
                                   layoutKey,
                               }: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        // 确保在客户端执行，并且广告未被初始化过
        try {
            if (typeof window !== "undefined") {
                // 使用 (window as any) 绕过 TypeScript 类型检查
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className="w-full my-6 overflow-hidden text-center min-h-[100px] bg-gray-50/50 rounded-lg">
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-layout={layoutKey ? "in-article" : undefined} // 如果是专门的文章内嵌单元
                data-ad-format={format}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-layout-key={layoutKey}
                data-full-width-responsive={responsive}
            />
            <span className="text-xs text-gray-400">广告 / Advertisement</span>
        </div>
    );
}