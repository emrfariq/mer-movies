// File: components/Navbar.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Film, Tv, Folder, CalendarDays, Search, ChevronDown, Play } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import LiveSearch from '../feature/LiveSearch';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const router = useRouter();

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(res.data.genres);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    }
    fetchGenres();
  }, [API_KEY]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <header className="bg-zinc-950 text-white px-6 py-4 shadow-md relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tighter hover:scale-105 transition-transform">
            MERMOVIES
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="/movies" className="flex items-center gap-1 hover:text-white transition">
              <Film size={16} /> Movies
            </Link>
            <Link href="/Tv" className="flex items-center gap-1 hover:text-white transition">
              <Tv size={16} /> TV Series
            </Link>
            <Link href="/anime" className="flex items-center gap-1 hover:text-white transition">
              <Play size={16} /> Anime
            </Link>

            {/* Desktop Genre Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-white transition">
                <Folder size={16} /> Genre <ChevronDown size={14} />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block pt-2 w-48 z-50">
                <div className="bg-zinc-800 text-sm rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genre/${genre.id}`}
                      className="block px-4 py-2 hover:bg-zinc-700 rounded"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>


          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block w-72">
          <LiveSearch />
        </div>

        {/* Mobile Menu Button */}
        {/* ... */}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 space-y-3">
          <Link href="/movies" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <Film size={16} /> Movies
          </Link>
          <Link href="/Tv" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <Tv size={16} /> TV Series
          </Link>
          <Link href="/anime" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <Play size={16} /> Anime
          </Link>

          {/* Collapsible Genre List */}
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <Folder size={16} /> Genre <ChevronDown size={14} className={genreOpen ? 'rotate-180' : ''} />
          </button>
          {genreOpen && (
            <div className="ml-4 space-y-1">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="block text-sm text-gray-400 hover:text-white"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Search */}
          <div className="mt-3 pb-4">
            <LiveSearch onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}