from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.question_generator import generate_question
from backend.evaluator import evaluate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    topic: str
    difficulty: str


class EvaluationRequest(BaseModel):
    question: str
    answer: str


@app.get("/")
def home():
    return {"message": "AI Interview Coach API"}


@app.post("/generate")
def create_question(request: QuestionRequest):

    if request.topic not in ["DSA", "SQL"]:
        raise HTTPException(
            status_code=400,
            detail="Topic must be DSA or SQL"
        )

    if request.difficulty not in [
        "Easy", "Medium", "Hard"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid difficulty"
        )

    question = generate_question(
        request.topic,
        request.difficulty
    )

    return {"question": question}


@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    feedback = evaluate_answer(
        request.question,
        request.answer
    )

    return {"feedback": feedback}