# 🎬 Mer Movies — Next.js Streaming App

Welcome to the official repository for **Mer Movies**, a modern movie and TV series streaming application built with [Next.js](https://nextjs.org). Mer Movies offers a sleek, responsive interface with a unique **Kuromi-inspired (Purple & Black)** theme.

## ✨ Features

- **Media Discovery**: Browse the latest Movies, TV Series, and Anime via [TMDB API](https://www.themoviedb.org/).
- **Streaming Integration**: Watch content directly through embedded players with server selection.
- **Search & Filter**: Real-time search with "Live Search" dropdown and genre filtering.
- **Kuromi Theme**: A custom Dark/Purple aesthetic inspired by Kuromi.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- **Anime Section**: Dedicated section for Anime content.
- **User Friendly**: 
  - Skip Intro button.
  - Clickable episode rows for TV Series.
  - Infinite scroll for search results.

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/emrfariq/mer-movies.git
cd mer-movies
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env.local` file in the root directory and add your TMDB API Key:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs)
- **HTTP Client**: Axios

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Add the `NEXT_PUBLIC_TMDB_API_KEY` in Environment Variables.
4. Deploy!

## 👨‍💻 Author

Developed by **Mer Movies Team**.
credits : Alan Alkalifa
