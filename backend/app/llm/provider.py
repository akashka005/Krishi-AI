from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_response_stream(query, context_docs):
    context = "\n".join(context_docs)

    prompt = f"""
You are a highly knowledgeable and friendly agricultural expert helping real farmers.

Context:
{context}

Question:
{query}

IMPORTANT:
- Prioritize COMMON real-world causes first (nutrient deficiency, watering issues).
- Give SIMPLE, actionable advice (e.g. fertilizer names, watering tips).
- Avoid overly scientific jargon. Explain things simply.
- Format your response in clean Markdown. Use bolding, bullet points, and headers if appropriate to make it easy to read.
"""

    try:
        stream = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful AI farming assistant."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    except Exception as e:
        print("❌ LLM ERROR:", str(e))
        yield "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."