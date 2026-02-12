'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Info, Star } from 'lucide-react';

interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
}

export default function HeroSlider({ items }: { items: MediaItem[] }) {
    const [current, setCurrent] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Auto-play logic
    useEffect(() => {
        if (!isAutoPlay) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [current, isAutoPlay, items.length]);

    const handleNext = () => {
        setIsAutoPlay(false);
        setCurrent((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setIsAutoPlay(false);
        setCurrent((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
            {items.map((item, index) => {
                const isActive = index === current;
                const title = item.title || item.name;
                const date = item.release_date || item.first_air_date;
                const year = date ? date.split('-')[0] : '';
                const link = item.media_type === 'tv' || item.first_air_date ? `/Tv/${item.id}` : `/Movie/${item.id}`;

                return (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {item.backdrop_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                                    alt={title || 'Media'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900" />
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-7xl mx-auto px-6 w-full pt-20">
                                <div className="max-w-2xl space-y-6">
                                    <div className="flex items-center gap-3 text-sm font-semibold text-yellow-500">
                                        <span className="bg-yellow-500/20 px-2 py-1 rounded flex items-center gap-1">
                                            <Star size={14} fill="currentColor" /> {item.vote_average.toFixed(1)}
                                        </span>
                                        <span className="text-gray-300">{year}</span>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                        {title}
                                    </h1>

                                    <p className="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-4 drop-shadow-md">
                                        {item.overview}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Link
                                            href={link}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105"
                                        >
                                            <Play size={20} fill="currentColor" /> Watch Now
                                        </Link>
                                        <Link
                                            href={link}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 border border-white/10"
                                        >
                                            <Info size={20} /> More Info
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-purple-600/80 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-purple-600/80 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={28} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setIsAutoPlay(false); setCurrent(idx); }}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-purple-600' : 'w-2 bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
