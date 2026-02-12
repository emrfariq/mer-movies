"use client";

import { useState } from "react";

interface WatchPlayerProps {
    id: string;
    season?: string;
    episode?: string;
    type: "movie" | "tv";
}

const SERVERS = [
    { name: "Server 1", url: "https://vidsrc-embed.ru/embed" },
    { name: "Server 2", url: "https://vidsrc-embed.su/embed" },
];

export default function WatchPlayer({ id, season, episode, type }: WatchPlayerProps) {
    const [selectedServer, setSelectedServer] = useState(SERVERS[0]);

    const getEmbedUrl = (serverUrl: string) => {
        if (type === "tv") {
            return `${serverUrl}/tv/${id}/${season}/${episode}`;
        } else {
            return `${serverUrl}/movie/${id}`;
        }
    };

    return (
        <div className="space-y-4">
            {/* Server Selector */}
            <div className="flex flex-wrap gap-2 justify-center">
                {SERVERS.map((server) => (
                    <button
                        key={server.name}
                        onClick={() => setSelectedServer(server)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedServer.name === server.name
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
                            }`}
                    >
                        {server.name}
                    </button>
                ))}
            </div>

            {/* Player */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-zinc-800 bg-black relative">
                <iframe
                    key={selectedServer.name} // Force re-render on server change
                    src={getEmbedUrl(selectedServer.url)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    referrerPolicy="origin"
                    loading="lazy"
                    title={`Player ${selectedServer.name}`}
                />
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
                *If the player doesn't load or has too many ads, try switching servers.
            </p>
        </div>
    );
}
