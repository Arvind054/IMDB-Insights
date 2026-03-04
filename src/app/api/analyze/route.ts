import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
    try {
        const { reviews } = await request.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return NextResponse.json({
                classification: 'Mixed',
                summary: 'This movie currently has no user reviews on IMDb to analyze.',
                isMock: false
            });
        }

        // Default mock response if no API key is provided
        if (!apiKey) {
            return NextResponse.json({
                classification: 'Mixed',
                summary: "No API key was provided so this is a mock summary. The audience reviews reflect a mix of opinions. Some praised the technical aspects and performances, while others felt the pacing was off or the story lacked depth. Overall, it's a polarizing movie that appeals to specific tastes.",
                isMock: true
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
Analyze the following user reviews for a movie. 
Provide a short, concise summary (around 3 to 4 sentences) of the overall audience sentiment. 
Then, classify the overall sentiment as exactly one of these three words: "Positive", "Mixed", or "Negative".

Reviews:
${reviews.map((r, i) => `[Review ${i + 1}]: ${r}`).join('\n')}

Respond strictly in the following JSON format:
{
  "summary": "Your concise summary here.",
  "classification": "Positive" // or "Mixed" or "Negative"
}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error('No text returned from Gemini API.');
        }

        const result = JSON.parse(text);

        return NextResponse.json({
            summary: result.summary,
            classification: result.classification,
            isMock: false
        });

    } catch (error: any) {
        console.error('Error in /api/analyze:', error);
        return NextResponse.json({ error: error.message || 'An error occurred during analysis.' }, { status: 500 });
    }
}
