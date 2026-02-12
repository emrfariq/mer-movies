'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LiveSearchProps {
    className?: string;
    placeholder?: string;
    onClose?: () => void; // Optional callback to close mobile menu
}

export default function LiveSearch({ className, placeholder = "Search...", onClose }: LiveSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 2) {
                setIsLoading(true);
                try {
                    // Multi-search for Movies and TV
                    const res = await axios.get(
                        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
                    );

                    // Filter out people and items without images/titles
                    const filtered = res.data.results
                        .filter((item: any) =>
                            (item.media_type === 'movie' || item.media_type === 'tv') &&
                            (item.poster_path || item.backdrop_path)
                        )
                        .slice(0, 5); // Limit to 5 results

                    setResults(filtered);
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query, API_KEY]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            router.push(`/Search?q=${encodeURIComponent(query.trim())}`);
            setShowDropdown(false);
            if (onClose) onClose();
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-zinc-800 text-sm text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />

                {isLoading ? (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={16} />
                ) : query ? (
                    <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                        <X size={16} />
                    </button>
                ) : null}
            </div>

            {/* Dropdown Results */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="py-2">
                        {results.map((item) => {
                            const title = item.title || item.name;
                            const year = (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A';
                            const type = item.media_type === 'movie' ? 'Movie' : item.media_type === 'anime' ? 'Anime' : 'TV Series';
                            const link = item.media_type === 'movie' ? `/Movie/${item.id}` : item.media_type === 'anime' ? `/anime/${item.id}` : `/Tv/${item.id}`;

                            return (
                                <Link
                                    key={`${item.media_type}-${item.id}`}
                                    href={link}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        if (onClose) onClose();
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition border-b border-zinc-800 last:border-0"
                                >
                                    <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-zinc-700">
                                        {item.poster_path ? (
                                            <img
                                                src={item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                                alt={title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">N/A</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-sm font-medium truncate">{title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <span>{year}</span>
                                            <span>•</span>
                                            <span className={`uppercase px-1.5 py-0.5 rounded text-[10px] font-bold ${item.media_type === 'movie' ? 'bg-blue-600/20 text-blue-400' :
                                                item.media_type === 'anime' ? 'bg-purple-600/20 text-purple-400' :
                                                    'bg-green-600/20 text-green-400'
                                                }`}>
                                                {type}
                                            </span>
                                            <span className="flex items-center gap-1 ml-auto text-yellow-500">
                                                <Star size={10} fill="currentColor" /> {item.vote_average?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => {
                                router.push(`/Search?q=${encodeURIComponent(query.trim())}`);
                                setShowDropdown(false);
                                if (onClose) onClose();
                            }}
                            className="w-full text-center py-2 text-xs text-purple-400 hover:text-purple-300 font-medium border-t border-zinc-800"
                        >
                            See all results for "{query}"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
