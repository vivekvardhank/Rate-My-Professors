import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { Buffer } from 'buffer';

const systemPrompt = `Extract the following details from the provided text and format it into JSON:*

1. **Professor Name**: The name of the professor.
2. **Subject**: The department or general subject area the professor teaches (e.g., Computer Science, Physics).
3. **Stars**: A star rating from 1 to 5 based on the review of the professor's teaching quality and impact.
4. **Review**: A brief summary highlighting the professor's teaching style, expertise, and impact on students, including the names of specific courses taught by the professor and also add currently he is working in which school.

*Format:*

json
{
  "Professor": "[Professor Name]",
  "subject": "[Subject]",
  "stars": [Stars],
  "review": "[Brief summary of the professor’s teaching, including specific courses taught.]"
}
`;

export async function POST(request) {
  try {
    const { professorURL, rating, review } = await request.json();

    if (!professorURL) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const command = `python3 ./datascrap.py "${professorURL}"`;

    return new Promise((resolve, reject) => {
      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          resolve(NextResponse.json({ error: 'Error executing Python script' }, { status: 500 }));
        } else if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
          resolve(NextResponse.json({ error: 'Error in Python script', details: stderr }, { status: 500 }));
        } else {
          try {
           // console.log(`Python script output: ${stdout.trim()}`);
            
            const pc = new Pinecone({
              apiKey: process.env.PINECONE_API_KEY,
            });
    
            const index = pc.index('rag');
            const openai = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY,
            });

            const completion = await openai.chat.completions.create({
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `${stdout.trim()},rating:${rating},additional comments: ${review}` },
              ],
              model: 'gpt-4', 
            });

            const response = JSON.parse(completion.choices[0].message.content);
            console.log(response)
            const jsonData = Buffer.from(JSON.stringify(response)).toString('base64');

            const pythonInterpreter = 'c:\\Users\\kvive_qz6f7mf\\anaconda3\\envs\\rag\\python.exe';


            const upsertCommand = `${pythonInterpreter} ./upload.py ${jsonData}`;

            exec(upsertCommand, (upsertError, upsertStdout, upsertStderr) => {
                if (upsertError) {
                  console.error(`Error executing Python upsert script: ${upsertError.message}`);
                  return resolve(NextResponse.json({ error: 'Error executing Python upsert script' }, { status: 500 }));
                } else if (upsertStderr) {
                  console.error(`Python upsert script stderr: ${upsertStderr}`);
                  return resolve(NextResponse.json({ error: 'Error in Python upsert script', details: upsertStderr }, { status: 500 }));
                } else {
                  try {
                    console.log(`Python upsert script output: ${upsertStdout.trim()}`);
                    const jsonResponse = JSON.parse(upsertStdout.trim());
                    return resolve(NextResponse.json({ message: 'Data upserted successfully', result: jsonResponse }));
                  } catch (parseError) {
                    console.error(`Error parsing JSON: ${parseError.message}`);
                    return resolve(NextResponse.json({ error: 'Error parsing Python script output as JSON' }, { status: 500 }));
                  }
                }
              });
              
            
          } catch (error) {
            console.error('Error processing the AI completion:', error);
            resolve(NextResponse.json({ error: 'Error processing the AI completion' }, { status: 500 }));
          }
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
