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
        const res = await fetch(`https://www.imdb.com/title/${id}/reviews`, {
            headers: IMDB_HEADERS,
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch reviews from IMDb' }, { status: res.status });
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const reviews: string[] = [];

        // The class names for review content can change slightly, but `.text.show-more__control` is standard as of late.
        $('.text.show-more__control').each((i, el) => {
            if (i < 10) {
                reviews.push($(el).text().trim());
            }
        });

        // If we didn't get any using the first selector, fallback to another generic one just in case IMDb changes classes
        if (reviews.length === 0) {
            $('.ipc-html-content-inner-div').each((i, el) => {
                if (i < 10) {
                    reviews.push($(el).text().trim());
                }
            });
        }

        return NextResponse.json({ reviews });

    } catch (error) {
        console.error('Error in /api/reviews:', error);
        return NextResponse.json({ error: 'An error occurred while scraping reviews.' }, { status: 500 });
    }
}
