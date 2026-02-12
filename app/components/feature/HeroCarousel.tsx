import axios from "axios";
import HeroSlider from "./HeroSlider";

interface HeroCarouselProps {
    endpoint?: string;
    mediaType?: 'movie' | 'tv';
}

export default async function HeroCarousel({ endpoint, mediaType }: HeroCarouselProps) {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = endpoint
        ? `https://api.themoviedb.org/3/${endpoint}&api_key=${API_KEY}`
        : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;

    try {
        const response = await axios.get(url);

        // Take top movies/shows that have a backdrop image
        const results = response.data.results
            .filter((item: any) => item.backdrop_path)
            .slice(0, 8)
            .map((item: any) => ({
                ...item,
                media_type: mediaType || (item.name ? 'tv' : 'movie') // fallback detection
            }));

        return <HeroSlider items={results} />;
    } catch (error) {
        console.error("Failed to fetch hero items:", error);
        return null;
    }
}
