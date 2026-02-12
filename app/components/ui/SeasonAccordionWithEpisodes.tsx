"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Season {
  id: number;
  name: string;
  air_date: string;
  overview: string;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
}

interface Props {
  tvId: string;
  seasons: Season[];
}

export default function SeasonAccordionWithEpisodes({ tvId, seasons }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [episodesMap, setEpisodesMap] = useState<Record<number, any[]>>({});

  const toggle = async (season: Season) => {
    const isOpen = openId === season.id;
    setOpenId(isOpen ? null : season.id);

    if (!isOpen && !episodesMap[season.season_number]) {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${season.season_number}?api_key=${API_KEY}`
      );
      setEpisodesMap((prev) => ({
        ...prev,
        [season.season_number]: res.data.episodes || [],
      }));
    }
  };

  return (
    <div className="space-y-4">
      {seasons.map((season) => (
        <div key={season.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(season)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded">
                {season.season_number}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">{season.name}</h3>
                <p className="text-xs text-gray-500">
                  {season.air_date?.split("-")[0] || "TBA"} • {season.episode_count} Episodes
                </p>
              </div>
            </div>

            {/* Placeholder Rating if available, else just chevron */}
            <div className="flex items-center gap-2 text-yellow-500">
              <span className="text-sm font-bold">★ 8</span> {/* Mock rating as API doesn't always provide season rating */}
            </div>
          </button>

          {openId === season.id && (
            <div className="p-4 space-y-4 border-t border-zinc-800 bg-black/20">
              {episodesMap[season.season_number]?.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/Watch/${tvId}?season=${season.season_number}&episode=${ep.episode_number}`}
                  className="flex gap-4 group cursor-pointer hover:bg-zinc-800/50 p-2 rounded-lg transition"
                >
                  <div className="relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-md overflow-hidden bg-zinc-800">
                    {ep.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-xs font-mono">
                        {season.season_number}-{ep.episode_number}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm md:text-base mb-1 truncate group-hover:text-purple-400 transition-colors">
                      {ep.name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        📅 {ep.air_date}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏰ {ep.runtime ? `${ep.runtime}m` : 'N/A'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs line-clamp-2">
                      {ep.overview}
                    </p>
                  </div>
                </Link>
              )) || (
                  <div className="text-center py-4 text-gray-400">Loading episodes...</div>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
