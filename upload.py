import os
import sys
import json
import base64
from dotenv import load_dotenv
load_dotenv()

import pinecone
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec


load_dotenv('.env.local')

pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def process_and_upsert(review):
    processed_data = []

    # Generate embeddings and prepare data for upsert
    response = client.embeddings.create(
        input=review['review'],
        model="text-embedding-3-small"
    )

    embedding = response.data[0].embedding
    processed_data.append({
        "values": embedding,
        "id": review["Professor"],
        "metadata": {
            "review": review["review"],
            "subject": review["subject"],
            "stars": review["stars"]
        }
    })

    index = pc.Index('rag')
    
    index.upsert(
        vectors=processed_data,
        namespace="ns1"
    )

    return {"status": "success", "upserted_vectors": len(processed_data)}

if __name__ == "__main__":
    # Decode the Base64-encoded JSON string
    encoded_data = sys.argv[1]
    json_str = base64.b64decode(encoded_data).decode('utf-8')

    # Parse the JSON string
    input_data = json.loads(json_str)

    # Process the data assuming it's a single review
    result = process_and_upsert(input_data)

    # Output the result
    print(json.dumps(result))
