import axios from "axios";
import PageHeader from "../components/ui/PageHeader";
import MovieGrid from "../components/ui/MovieGrid";
import HeroCarousel from "../components/feature/HeroCarousel";

export default async function MoviesPage() {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const movies = res.data.results;

        return (
            <div className="bg-zinc-950 min-h-screen text-white">
                <HeroCarousel mediaType="movie" />
                <div className="relative z-10 -mt-20">
                    <PageHeader title="Popular Movies" />
                    <MovieGrid items={movies} type="movie" />
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="bg-zinc-950 min-h-screen text-white flex items-center justify-center">
                <p>Failed to load movies.</p>
            </div>
        );
    }
}
