import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_question(topic, difficulty):

    prompt = f"""
    Generate one interview question.

    Topic: {topic}
    Difficulty: {difficulty}

    If topic is DSA:
        Generate a coding problem.

    If topic is SQL:
        Generate a database query problem.

    Include:
    - Problem statement
    - Input example
    - Expected output
    - Constraints

    Do not include the solution.
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You are a technical interviewer."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5
    )

    return response.choices[0].message.content