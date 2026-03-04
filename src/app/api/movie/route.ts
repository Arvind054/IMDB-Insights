import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const IMDB_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`https://www.imdb.com/title/${id}/`, {
            headers: IMDB_HEADERS,
            next: { revalidate: 3600 } // cache for an hour
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch from IMDb' }, { status: res.status });
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // IMDb stores structured data in a `<script type="application/ld+json">` tag
        const jsonLdScript = $('script[type="application/ld+json"]').html();

        if (!jsonLdScript) {
            return NextResponse.json({ error: 'Could not find JSON-LD data on the page' }, { status: 500 });
        }

        const data = JSON.parse(jsonLdScript);

        // Some metadata like genres, cast could be arrays or objects in the structured data
        const title = data.name;
        const poster = data.image;
        // @ts-ignore
        const year = data.datePublished ? data.datePublished.split('-')[0] : 'Unknown';
        const rating = data.aggregateRating ? data.aggregateRating.ratingValue : 'N/A';
        const plot = data.description;

        // Extract cast
        // @ts-ignore
        const cast = (data.actor || []).map(actor => ({
            name: actor.name,
            url: actor.url,
        })).slice(0, 10); // top 10

        return NextResponse.json({
            title,
            poster,
            year,
            rating,
            plot,
            cast,
            genres: data.genre || []
        });

    } catch (error) {
        console.error('Error in /api/movie:', error);
        return NextResponse.json({ error: 'An error occurred while scraping the movie details.' }, { status: 500 });
    }
}
