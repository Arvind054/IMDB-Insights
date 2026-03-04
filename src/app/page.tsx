"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Bot, ThumbsUp, ThumbsDown, Minus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type MovieData = {
  title: string;
  poster: string;
  year: string;
  rating: string;
  plot: string;
  genres: string[];
  cast: { name: string; url: string }[];
};

type SentimentData = {
  summary: string;
  classification: 'Positive' | 'Mixed' | 'Negative';
  isMock: boolean;
};

export default function Home() {
  const [imdbId, setImdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);

  const fetchInsights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId.trim()) return;

    setLoading(true);
    setError(null);
    setMovie(null);
    setSentiment(null);

    try {
      // 1. Fetch Movie
      const movieRes = await fetch(`/api/movie?id=${imdbId}`);
      if (!movieRes.ok) throw new Error('Failed to fetch movie details. Check if the ID is correct.');
      const movieData = await movieRes.json();
      setMovie(movieData);

      // 2. Fetch Reviews
      const reviewsRes = await fetch(`/api/reviews?id=${imdbId}`);
      if (!reviewsRes.ok) throw new Error('Failed to fetch user reviews.');
      const reviewsData = await reviewsRes.json();

      // 3. Analyze Sentiment
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews: reviewsData.reviews }),
      });
      if (!analyzeRes.ok) throw new Error('Failed to analyze sentiment.');
      const analyzeData = await analyzeRes.json();
      setSentiment(analyzeData);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">

      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-xl leading-none">
            i
          </div>
          IMDb<span className="font-light text-primary">Insights</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 sm:mt-24">
        {/* Search Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
            Discover the <span className="text-primary">true</span> verdict.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-inter">
            Enter any valid IMDb Movie ID, and our AI will scrape audience reviews to provide a clear, concise sentiment analysis.
          </p>

          <form onSubmit={fetchInsights} className="max-w-xl mx-auto relative group mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="e.g. tt0133093 (The Matrix)"
              required
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-inter shadow-2xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute inset-y-2 right-2 px-6 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></div>
                  <span>Analyzing</span>
                </div>
              ) : (
                'Insights'
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 mt-4 font-inter text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {movie && sentiment && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-20 space-y-8"
            >
              {/* Movie Header Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="w-full sm:w-48 rounded-xl shadow-lg object-cover bg-black/50 aspect-[2/3]" />
                ) : (
                  <div className="w-full sm:w-48 aspect-[2/3] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">No Poster</div>
                )}

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{movie.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-inter">
                      <span>{movie.year}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-white font-medium">{movie.rating}</span>/10
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-inter py-1">
                    {movie.genres?.map(g => (
                      <span key={g} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-300 font-inter leading-relaxed text-sm sm:text-base">
                    {movie.plot}
                  </p>
                </div>
              </div>

              {/* Cast List */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white px-2">Top Cast</h3>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
                    {movie.cast.map(actor => (
                      <div key={actor.name} className="flex-shrink-0 w-32 glass-panel rounded-2xl p-4 text-center hover:bg-white/5 transition-colors cursor-default">
                        <div className="w-16 h-16 mx-auto bg-white/10 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-gray-500">
                          {actor.name.charAt(0)}
                        </div>
                        <p className="text-sm font-medium text-gray-200 line-clamp-2">{actor.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-white">AI Audience Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={cn(
                    "glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group",
                    sentiment.classification === 'Positive' ? 'bg-green-500/5 hover:bg-green-500/10' :
                      sentiment.classification === 'Negative' ? 'bg-red-500/5 hover:bg-red-500/10' :
                        'bg-yellow-500/5 hover:bg-yellow-500/10'
                  )}>
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110",
                      sentiment.classification === 'Positive' ? 'bg-green-500/20 text-green-400' :
                        sentiment.classification === 'Negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {sentiment.classification === 'Positive' ? <ThumbsUp className="w-8 h-8" /> :
                        sentiment.classification === 'Negative' ? <ThumbsDown className="w-8 h-8" /> :
                          <Minus className="w-8 h-8" />}
                    </div>
                    <div className="text-sm text-gray-400 font-inter uppercase tracking-widest">Overall Sentiment</div>
                    <div className={cn(
                      "text-3xl font-bold",
                      sentiment.classification === 'Positive' ? 'text-green-400' :
                        sentiment.classification === 'Negative' ? 'text-red-400' :
                          'text-yellow-400'
                    )}>
                      {sentiment.classification}
                    </div>
                  </div>

                  <div className="md:col-span-2 glass-panel rounded-3xl p-8 flex flex-col justify-center">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Info className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-gray-300 font-inter leading-relaxed text-lg">
                        {sentiment.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
