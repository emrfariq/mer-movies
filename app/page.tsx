import PopularMovies from "./components/feature/PopularMovies";
import PopularTv from "./components/feature/PopularTv";
import HeroCarousel from "./components/feature/HeroCarousel";

export default function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen pb-10">
      <HeroCarousel mediaType="movie" />
      <div className="relative z-10 space-y-10 -mt-20 md:-mt-32">
        <PopularMovies />
        <PopularTv />
      </div>
    </div>
  );
}
