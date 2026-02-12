import SearchResultCard from "./SearchResultCard";

interface MovieGridProps {
    items: any[];
    type?: 'movie' | 'tv';
}

export default function MovieGrid({ items, type }: MovieGridProps) {
    return (
        <div className="px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((item) => (
                        <SearchResultCard
                            key={item.id}
                            item={{
                                ...item,
                                media_type: type || item.media_type || 'movie', // Default to 'movie' if not specified
                                title: item.title || item.name,
                                poster_path: item.poster_path,
                                vote_average: item.vote_average
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
