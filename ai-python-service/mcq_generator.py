import subprocess
import json

def generate_mcqs(text: str):
    prompt = f"Generate 3 MCQs from this text:\n{text}"
    
    result = subprocess.run(
        ["ollama", "run", "mistral"],
        input=prompt.encode(),
        capture_output=True
    )
    
    output = result.stdout.decode()
    return output.strip()
