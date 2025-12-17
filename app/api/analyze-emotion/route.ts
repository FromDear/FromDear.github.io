import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Helper: Simple keyword-based analysis fallback
function analyzeLocally(text: string) {
    const keywords: Record<string, string[]> = {
        "사랑": ["사랑", "love", "러브", "좋아", "하트", "heart"],
        "감사": ["고마", "감사", "땡큐", "thanks"],
        "응원": ["화이팅", "파이팅", "힘내", "응원", "할수있어"],
        "축하": ["축하", "메리", "크리스마스", "해피", "happy", "merry"],
        "설렘": ["기대", "두근", "설레", "보고싶"],
        "위로": ["수고", "고생", "괜찮", "토닥"]
    };

    let scores: Record<string, number> = {};
    let totalScore = 0;

    // 1. Scoring based on keywords
    Object.entries(keywords).forEach(([emotion, words]) => {
        words.forEach(word => {
            if (text.toLowerCase().includes(word.toLowerCase())) { // Case-insensitive check
                scores[emotion] = (scores[emotion] || 0) + 1;
                totalScore++;
            }
        });
    });

    // 2. Fallback if no keywords found
    if (totalScore === 0) {
        return { "따뜻한 마음": 100 };
    }

    // 3. Convert to percentages
    const result: Record<string, number> = {};
    let currentSum = 0;
    const entries = Object.entries(scores);

    // Add some randomness to scores to make it less deterministic
    const randomFactor = Math.random() * 0.2 - 0.1; // -0.1 to 0.1

    entries.forEach(([emotion, score], index) => {
        let percent = Math.round((score / totalScore) * 100);

        // Apply randomness, ensuring it doesn't go below 0
        percent = Math.max(0, percent + Math.round(percent * randomFactor));

        result[emotion] = percent;
        currentSum += percent;
    });

    // Adjust the last item to ensure sum is 100%
    if (entries.length > 0) {
        const lastEmotion = entries[entries.length - 1][0];
        result[lastEmotion] = result[lastEmotion] + (100 - currentSum);
    } else {
        // If no keywords, this case should be handled by totalScore === 0, but as a safeguard
        return { "따뜻한 마음": 100 };
    }

    // Filter out emotions with 0% unless it's the only one
    const finalResult: Record<string, number> = {};
    const filteredEntries = Object.entries(result).filter(([, value]) => value > 0);
    if (filteredEntries.length === 0) {
        return { "따뜻한 마음": 100 };
    } else if (filteredEntries.length === 1) {
        finalResult[filteredEntries[0][0]] = 100;
    } else {
        let sum = 0;
        filteredEntries.forEach(([emotion, value], index) => {
            if (index === filteredEntries.length - 1) {
                finalResult[emotion] = 100 - sum;
            } else {
                finalResult[emotion] = value;
                sum += value;
            }
        });
    }

    return finalResult;
}

export async function POST(request: Request) {
    console.log('DEBUG: Route called');
    console.log('DEBUG: API Key loaded:', apiKey ? 'YES' : 'NO', apiKey ? `Length: ${apiKey.length}` : '');

    let content = ''; // Store content for fallback use

    if (!apiKey) {
        console.error('Gemini API Key is missing. Check .env');
        return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    try {
        const body = await request.json();
        content = body.content || '';

        const genAI = new GoogleGenerativeAI(apiKey);
        // User has access to 2.0 models
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Force JSON response for structured data
        const prompt = `
        Analyze the sentiment of the following Christmas message.
        Return ONLY a JSON object with 3-4 distinct emotions and their percentage (summing to approx 100%).
        Translate emotion names to Korean (e.g., 사랑, 감동, 설렘, 응원, 위로, 감사, 행복).

        Message: "${content}"

        Example format:
        {
            "사랑": 50,
            "설렘": 30,
            "감사": 20
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Raw Text:', text); // Debug log

        // Simple cleanup to ensure valid JSON (remove markdown code blocks if present)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonString);

        return NextResponse.json(analysis);

    } catch (error: any) {
        // Handle Rate Limiting (429) gracefully without loud errors
        if (String(error).includes('429') || String(error).includes('Quota')) {
            console.warn('⚠️ AI Quota Exceeded. Using Smart Fallback.');
            return NextResponse.json(analyzeLocally(content));
        }

        console.error('AI Analysis Logic Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
