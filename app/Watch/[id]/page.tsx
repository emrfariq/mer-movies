import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WatchPlayer from "../../components/feature/WatchPlayer";
import SkipIntroButton from "../../components/ui/SkipIntroButton";
import SeasonAccordionWithEpisodes from "../../components/ui/SeasonAccordionWithEpisodes";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    season?: string;
    episode?: string;
  }>;
}

export default async function WatchMovie(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = params.id;
  const season = searchParams?.season;
  const episode = searchParams?.episode;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const isTV = season && episode;

  let title = "";
  let overview = "";
  let backUrl = "";
  let tvSeasons = [];

  try {
    if (isTV) {
      const tvRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
      );
      const tv = tvRes.data;
      title = `${tv.name} - Season ${season}, Episode ${episode}`;
      overview = tv.overview;
      backUrl = `/Tv/${id}`;
      tvSeasons = tv.seasons || [];
    } else {
      const movieRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      const movie = movieRes.data;
      title = movie.title;
      overview = movie.overview;
      backUrl = `/Movie/${id}`;
    }
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center">{title}</h1>

        {/* Player */}
        <WatchPlayer
          id={id}
          season={season}
          episode={episode}
          type={isTV ? "tv" : "movie"}
        />

        {/* Controls */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>💬 Subtitle: Auto / English</span>
          <span>🎚️ Quality: Auto</span>
        </div>

        {/* Overview */}
        <div className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
          {overview || "No description available for this content."}
        </div>

        {/* Season Selector for TV Shows */}
        {isTV && tvSeasons.length > 0 && (
          <div className="mt-10 border-t border-zinc-800 pt-10">
            <h2 className="text-2xl font-semibold mb-6">📺 More Episodes</h2>
            <SeasonAccordionWithEpisodes tvId={id} seasons={tvSeasons} />
          </div>
        )}
      </div>
    </div>
  );
}
