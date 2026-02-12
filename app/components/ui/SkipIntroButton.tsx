'use client';

import { FastForward } from "lucide-react";

export default function SkipIntroButton() {
    return (
        <button
            onClick={() => alert("⏩ Intro skipped!")}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-full shadow transition"
        >
            <FastForward size={16} />
            Skip Intro
        </button>
    );
}
