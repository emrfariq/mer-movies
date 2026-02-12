// File: app/search/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import SkeletonCard from './../components/ui/SkeletonCard';
import SearchResultCard from '../components/ui/SearchResultCard';

export default function SearchResults() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (!query || !hasMore) return;
      if (page === 1) setInitialLoading(true);
      setLoading(true);

      try {
        const promises = [];

        // Always fetch TMDB
        promises.push(
          axios.get(`https://api.themoviedb.org/3/search/multi`, {
            params: { api_key: API_KEY, query, page }
          })
        );

        // Fetch Jikan only on first page (Jikan pagination is different, keeping it simple for now)
        if (page === 1) {
          promises.push(axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`));
        }

        const results = await Promise.allSettled(promises);

        let newItems: any[] = [];

        // TMDB Results
        if (results[0].status === 'fulfilled') {
          const tmdbData = results[0].value.data;
          const tmdbItems = tmdbData.results.filter(
            (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          newItems = [...newItems, ...tmdbItems];
          setHasMore(tmdbData.page < tmdbData.total_pages);
        }

        // Jikan Results (prepend to top if page 1)
        if (page === 1 && results[1] && results[1].status === 'fulfilled') {
          const jikanItems = results[1].value.data.data.map((item: any) => ({
            id: item.mal_id,
            title: item.title,
            poster_path: item.images.jpg.image_url,
            vote_average: item.score,
            media_type: 'anime'
          }));
          newItems = [...jikanItems, ...newItems];
        }

        setResults((prev) => [...(page === 1 ? [] : prev), ...newItems]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [query, page, API_KEY, hasMore]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto text-white">
      <h1 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-purple-500">{query}</span>
      </h1>

      {initialLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      )}

      {!initialLoading && (
        <>
          {results.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item: any) => (
                <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </>
      )}

      {!initialLoading && hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded shadow"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}