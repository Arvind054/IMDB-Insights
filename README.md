# IMDb Insights 🎬

**IMDb Insights** is a remarkably responsive, modern web application designed to instantly retrieve deep movie insights. By combining the power of data scraping with Google's Gemini AI, the application takes any IMDb Movie ID, scours the web for authentic audience reviews, and classifies the overarching consumer sentiment dynamically into "Positive", "Mixed", or "Negative" using cutting-edge natural language processing. 

Wrapped in a meticulously designed dark, premium, glassmorphism-inspired UI powered by **Tailwind CSS v4** and **Framer Motion**, IMDb Insights provides a stunningly cinematic experience right in your browser.

![IMDb Insights Architecture](/bg-glow.svg) <!-- *Placeholder for main hero image* -->

## ✨ Features

- **Intelligent Scraping Endpoint**: Operates robust Next.js API Routes (`/api/movie` & `/api/reviews`) utilizing `cheerio` to extract rich movie metadata via IMDb's internal JSON-LD structured data and HTML layouts.
- **AI Sentiment Analysis**: Contextualizes top audience reviews and summarizes the viewer consensus directly using the `@google/genai` model endpoint (`/api/analyze`).
- **Resilient Fallbacks**: If a movie has absolutely 0 user reviews published (e.g. unreleased, highly obscure titles), the application gracefully acknowledges the lack of data without crashing. 
- **Modern UI/UX Aesthetics**: Features rich animations, scrollable horizontal cast lists with hidden scrollbars, dynamic sentiment color-coding, responsive layouts, and meticulous dark-mode text styling (`Inter` and `Outfit` fonts).

---

## 🏗️ Project Structure

The project strictly follows the modern **Next.js 15 App Router** architecture. 

```text
BreAssignment/
│
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── api/                # Backend API Routes
│   │   │   ├── analyze/        # Next.js Route: Gemini AI Sentiment Pipeline
│   │   │   │   └── route.ts
│   │   │   ├── movie/          # Next.js Route: IMDb JSON-LD Details Scraper
│   │   │   │   └── route.ts
│   │   │   └── reviews/        # Next.js Route: IMDb Audience Review Scraper
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css         # Global Tailwind CSS and Tailwind v4 themes
│   │   ├── layout.tsx          # Root HTML Document layout & metadata
│   │   └── page.tsx            # Main Web Application User Interface & state logic
│   │
│   └── lib/                    # Shared utility functions
│       └── utils.ts            # Tailwind Merge / clxs logic for conditional styling
│
├── public/                     # Static assets (images, SVGs, etc.)
├── tailwind.config.ts          # Setup file for Tailwind CSS plugins
├── next.config.ts              # Next.js build compilation configuration
├── package.json                # Project dependencies and script commands
└── .env                        # Local Environment variables (Gemini API Key)
```

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Web Scraping**: [Cheerio](https://cheerio.js.org/)
- **Artificial Intelligence**: [Google Gemini Pro SDK](https://ai.google.dev/) (`@google/genai`)

## 🚀 Getting Started Locally

### 1. Installation
Clone the repository, verify you have Node.js installed, and run:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file at the root of the project and embed your Google Gemini API Key:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Finally, open [`http://localhost:3000`](http://localhost:3000) in your browser and type in a valid IMDb tag (like `tt0133093` for *The Matrix*) to watch the magic happen!
