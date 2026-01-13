import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Loader2, Maximize2 } from 'lucide-react';

/**
 * MasonryGallery - 响应式瀑布流相册
 * * 设计重点：
 * 1. 严格保留图片原始宽高比 (aspect-ratio)
 * 2. 宽度由 CSS columns 控制 (响应式)，高度按比例自适应
 * 3. 点击触发沉浸式 Lightbox
 */
export default function MasonryGallery({ images = [] }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // 简单的挂载动画
        setIsLoaded(true);
    }, []);

    // 键盘事件监听
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === -1) return;
            if (e.key === 'Escape') setLightboxIndex(-1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    // 切换 Lightbox 图片
    const navigateLightbox = useCallback((step) => {
        setLightboxIndex((prev) => {
            const next = prev + step;
            if (next < 0) return images.length - 1;
            if (next >= images.length) return 0;
            return next;
        });
    }, [images.length]);

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Masonry 布局核心:
           - columns-1/2/3: 控制列数
           - gap-4: 控制间距
           - space-y-4: 控制垂直间距 (因为 Masonry 是基于流的)
        */}
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-5 space-y-5 mx-auto">
                    {images.map((img, idx) => {
                        // 计算原始比例，确保不裁切
                        // 如果缺少宽高数据，默认给一个 3:2 的占位比例，但在加载后会让 img 撑开
                        const w = img.width;
                        const h = img.height;
                        const hasDimensions = w && h;
                        const aspectRatio = hasDimensions ? `${w} / ${h}` : 'auto';

                        return (
                            <div
                                key={idx}
                                onClick={() => setLightboxIndex(idx)}
                                className="break-inside-avoid relative group cursor-zoom-in rounded-lg bg-ctp-surface0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                // 只有在有明确尺寸时才强制 aspect-ratio，防止布局抖动 (CLS)
                                // 如果没有尺寸，设为 auto 让图片自然撑开 (但这会有 CLS)
                                style={{ aspectRatio }}
                            >
                                {/* 图片层 */}
                                <img
                                    src={img.url}
                                    alt={img.title || `Gallery Image ${idx + 1}`}
                                    className="w-full h-full object-cover block bg-ctp-surface1"
                                    loading="lazy"
                                    decoding="async"
                                />

                                {/* 悬停遮罩层：显示元数据 */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <ZoomIn size={16} />
                                        {img.title && <span className="text-xs font-medium truncate max-w-[120px]">{img.title}</span>}
                                    </div>
                                    {hasDimensions && (
                                        <span className="text-[10px] font-mono text-white/70 bg-black/30 px-1.5 py-0.5 rounded">
                       {w}×{h}
                     </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 沉浸式 Lightbox */}
            {lightboxIndex !== -1 && (
                <div
                    className="fixed inset-0 z-[100] bg-ctp-base/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(-1)}
                >
                    {/* 控制栏 */}
                    <div className="absolute top-4 right-4 z-50 flex gap-3">
                        <div className="px-3 py-1.5 rounded-full bg-black/20 text-ctp-text text-sm font-mono border border-white/10 backdrop-blur-md">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                        <button
                            onClick={() => setLightboxIndex(-1)}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 导航按钮 (桌面端) */}
                    <button onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} className="hidden md:flex absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-50">
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} className="hidden md:flex absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-50">
                        <ChevronRight size={32} />
                    </button>

                    {/* 主图容器 */}
                    <div
                        className="w-full h-full p-4 md:p-12 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // 防止点击图片关闭
                    >
                        <img
                            src={images[lightboxIndex].url}
                            alt={images[lightboxIndex].title}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
                        />
                        {/* 底部标题 */}
                        {images[lightboxIndex].title && (
                            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
                <span className="inline-block bg-black/50 backdrop-blur-md text-white/90 px-4 py-2 rounded-lg text-sm font-medium">
                  {images[lightboxIndex].title}
                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}