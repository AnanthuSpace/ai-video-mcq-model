import subprocess
import json
import re
import uuid

def generate_mcqs(text: str):
    prompt = (
        "Generate 3 MCQs from this text in valid JSON array format ONLY. "
        "No markdown or explanation, just JSON like this:\n\n"
        '[{"question": "...", "options": ["..."], "answer": "..."}]'
        f"\n\n{text}"
    )

    result = subprocess.run(
        [r"C:\Users\anant\AppData\Local\Programs\Ollama\ollama.exe", "run", "mistral"],
        input=prompt.encode(),
        capture_output=True
    )

    output = result.stdout.decode()

    json_match = re.search(r'\[\s*{.*}\s*\]', output, re.DOTALL)

    try:
        if json_match:
            json_str = json_match.group(0)
            mcqs = json.loads(json_str)

            for question in mcqs:
                question["QuestionId"] = str(uuid.uuid4())
        else:
            raise json.JSONDecodeError("No valid JSON array found", output, 0)
    except json.JSONDecodeError as e:
        mcqs = {"error": "Failed to parse JSON", "raw_output": output}

    return mcqs
