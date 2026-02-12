import axios from "axios";
import PageHeader from "../components/ui/PageHeader";
import MovieGrid from "../components/ui/MovieGrid";
import HeroCarousel from "../components/feature/HeroCarousel";

export default async function AnimePage() {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        // Fetch Discover TV with genre 16 (Animation) and original language 'ja' (Japanese)
        const res = await axios.get(
            `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=16&with_original_language=ja&page=1`
        );
        const anime = res.data.results;

        return (
            <div className="bg-zinc-950 min-h-screen text-white">
                <HeroCarousel
                    endpoint="discover/tv?with_genres=16&sort_by=popularity.desc&page=1"
                    mediaType="tv"
                />

                <div className="relative z-10 -mt-20">
                    <PageHeader title="Anime" />
                    <MovieGrid items={anime} type="tv" />
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="bg-zinc-950 min-h-screen text-white flex items-center justify-center">
                <p>Failed to load anime.</p>
            </div>
        );
    }
}
