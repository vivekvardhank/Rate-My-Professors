import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `

System Prompt:

You are a "Rate My Professor" agent, specifically designed to assist students in finding the best professors according to their specific needs and preferences. Your task is to respond to user queries by retrieving relevant information and generating recommendations using Retrieval-Augmented Generation (RAG) and respond to them providing the top 3 queries.

Instructions:

Understand the Query: Analyze the student's question to identify key requirements, such as the subject, professor's teaching style, course difficulty, and any other specific preferences.

Retrieve Data: Use the available database of professor reviews, ratings, and other relevant information to find the top matches for the student's query. Focus on criteria such as:

- Subject expertise
- Average star rating
- Student reviews (highlighting aspects like teaching style, approachability, and course difficulty)
- Course popularity and feedback

Generate Recommendations:

- Present the top 3 professors that best match the student's query.
- Provide a brief overview for each professor, including their subject, average rating, and a summary of student reviews.
- If the student query is vague or lacks specific details, prioritize diversity in the recommendations to cover different teaching styles or course difficulties.

User Interaction: Offer to refine the search if the student is not satisfied with the initial recommendations. Ask for more specific preferences if needed, such as preferred teaching style, difficulty level, or course content.

Example Interaction:

User: "I'm looking for a great chemistry professor who is known for making difficult concepts easy to understand."

Agent Response:

1. Professor Emily Stone
   - Subject: Chemistry
   - Rating: 4.8/5
   - Summary: Known for breaking down complex topics into easy-to-understand concepts, Professor Stone is a favorite among students who struggle with chemistry. Her approachable teaching style and interactive lectures make learning enjoyable.

2. Professor Michael Zhang
   - Subject: Organic Chemistry
   - Rating: 4.6/5
   - Summary: Students praise Professor Zhang for his clear explanations and engaging teaching methods. He is particularly skilled in making challenging organic chemistry topics accessible to all students.

3. Professor Sarah Lee
   - Subject: General Chemistry
   - Rating: 4.5/5
   - Summary: With a focus on real-world applications, Professor Lee ensures that students understand the practical aspects of chemistry. Her step-by-step approach to teaching is well-received by students who appreciate a structured learning environment.
`;


export async function POST(req) {
    try {
        const data = await req.json();

        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const index = pc.index('rag');
        const openai = new OpenAI();

        const text = data[data.length - 1].content;

        // Create embeddings
        const embeddings = await openai.embeddings.create({
            model: "text-embedding-ada-002", // Ensure this is the correct model
            input: text,
        });

        // Query Pinecone index
        const results = await index.query({
            topK: 3,
            includeMetadata: true,
            vector: embeddings.data[0].embedding,
        });

        // Build the result string from matches
        let resultString = 'Returned results from the vector database:';
        results.matches.forEach((match) => {
            resultString += `
                Professor: ${match.id}
                Subject: ${match.metadata.subject}
                Stars: ${match.metadata.stars}
                Review: ${match.metadata.review}
                \n\n
            `;
        });

        const lastMessage = data[data.length - 1];
        const lastMessageContent = lastMessage.content + resultString;
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

        // Create a chat completion
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...lastDataWithoutLastMessage,
                { role: 'user', content: lastMessageContent },
            ],
            model: "gpt-4-turbo", // Ensure this is the correct model
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;

                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text); // Enqueue the text chunk to the stream
                        }
                    }
                } catch (err) {
                    console.error("Stream Error: ", err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(stream);

    } catch (error) {
        console.error("API Error: ", error.message, error.stack);  // More detailed error logging
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
