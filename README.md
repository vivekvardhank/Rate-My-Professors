# Rate My Professor Support Agent

## Overview

This project is an AI-powered support agent designed for students to find and rate professors. Built with modern technologies, the agent leverages Retrieval-Augmented Generation (RAG) to provide personalized professor recommendations based on student queries.

## Technologies Used

- **Frontend**: Next.js, React, MUI (Material-UI), React Markdown
- **Backend**: Node.js, Python
- **AI & Data Handling**: OpenAI, Pinecone, Custom Python Scripts

## Features

- **Interactive Chatbot**: The agent interacts with users to help them find the best professors according to their specific needs and preferences.
- **Rate My Professor Integration**: Allows users to submit professor URLs, and the system automatically scrapes, processes, and stores the data in Pinecone.
- **RAG Pipeline**: Uses Pinecone and OpenAI to retrieve and generate responses based on the professor's data.
- **Dynamic Recommendations**: Provides top 3 professor recommendations based on the user's query.
- **Professor Rating and Review**: Users can rate professors and leave reviews directly through the chatbot interface.

## Setup and Installation

### Prerequisites

- **Node.js** (version 14 or above)
- **Python** (3.8 or above, preferably installed via Conda)
- **Pinecone API Key**
- **OpenAI API Key**

### Environment Variables

Set up the following environment variables in your `.env` file:

```
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Rate-My-Professors.git
cd Rate-My-Professors
```

2. Install the necessary Node.js dependencies:

```bash
npm install
```

3. Create and activate a Python environment using Conda:

```bash
conda create -n rag python=3.8
conda activate rag
```

4. Install Python dependencies within the Conda environment:

```bash
pip install -r requirements.txt
```

### Local Development

1. Start the Next.js development server:

```bash
npm run dev
```

2. Make sure to use the Conda environment (`rag`) for running Python scripts. Ensure that the local Python interpreter is set to the Conda environment in your development environment.

## API Endpoints

### Chat API

- **Endpoint**: `/api/chat`
- **Method**: `POST`
- **Description**: Handles the chat interaction and returns responses based on user input.

### Data API

- **Endpoint**: `/api/data`
- **Method**: `POST`
- **Description**: Processes the professor URL, scrapes the data, and upserts it into Pinecone.

## Running the Python Scripts

The project includes Python scripts that need to be executed during the data processing steps. Ensure that your environment is configured with the appropriate Conda Python interpreter. For instance:

```bash
c:\Users\username\anaconda3\envs\rag\python.exe ./upload.py
```

## System Prompt

The system uses a predefined prompt to guide the AI's responses. This prompt ensures that the AI provides consistent and relevant information based on the student's query.

## Contributing

Feel free to fork this repository and submit pull requests. If you have suggestions or find issues, please create an issue in the repository.
