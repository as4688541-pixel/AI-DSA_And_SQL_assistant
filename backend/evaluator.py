import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def evaluate_answer(question, answer):

    prompt = f"""
    Evaluate the candidate's answer.

    Question:
    {question}

    Candidate's answer:
    {answer}

    Provide:
    1. What is correct
    2. What is incorrect or missing
    3. Suggestions for improvement
    4. A score from 0 to 10

    Be fair and explain the score.
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful technical interviewer."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content