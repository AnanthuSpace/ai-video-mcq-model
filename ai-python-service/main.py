from fastapi import FastAPI, UploadFile, File
from whisper_utils import transcribe_video
from mcq_generator import generate_mcqs
from pydantic import BaseModel

app = FastAPI()

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    file_path = f"temp/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    transcript = transcribe_video(file_path)
    return {"transcript": transcript}

class TextInput(BaseModel):
    text: str

@app.post("/generate-mcq")
def get_mcq(data: TextInput):
    mcqs = generate_mcqs(data.text)
    return {"mcqs": mcqs}
