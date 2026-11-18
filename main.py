from fastapi import FastAPI
from database import Base, engine
import auth
import assessment

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(assessment.router)

@app.get("/")
def home():
    return {"message":"Mental Health Early Detection API Running"}
