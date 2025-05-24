import whisper

def transcribe_video(file_path: str):
    model = whisper.load_model("base")
    result = model.transcribe(file_path, verbose=False)

    segments = result["segments"]
    five_min_segments = []
    current_segment = ""
    current_time = 0.0

    for seg in segments:
        if seg["start"] - current_time >= 300: 
            five_min_segments.append(current_segment.strip())
            current_segment = ""
            current_time = seg["start"]
        
        current_segment += " " + seg["text"]

    if current_segment:
        five_min_segments.append(current_segment.strip())

    return five_min_segments
