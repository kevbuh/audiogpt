import os
import openai
from dotenv import load_dotenv
from flask import Flask, send_file
import time

from gtts import gTTS
import os
import playsound

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, Wold!"

@app.route("/gpt")
def chatgpt():
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        messages=[{"role": "user", "content": "Tell the world about the ChatGPT API in the style of a pirate. Write less than 10 tokens. "}]
    )
    return completion["choices"][0]["message"]["content"]

@app.route("/whisper")
def whisper():
    file = open("api/LJ025-0076.wav", "rb")
    whisper_transcription = openai.Audio.transcribe("whisper-1", file)
    whisper_text = whisper_transcription["text"]
    return whisper_text

@app.route("/pipeline")
def pipeline():
    st = time.monotonic()

    # file = open("path_to_file", "rb")
    file = open("api/LJ025-0076.wav", "rb")

    file_ext = file.name[len(file.name)-4:]
    valid_exts = [".wav", ".m4a", ".mp3"]
    assert file_ext in valid_exts, f"Invalid file extension: {file_ext}"

    whisper_transcription = openai.Audio.transcribe("whisper-1", file)
    whisper_text = whisper_transcription["text"]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        messages=[{"role": "user", "content": f"Respond in less than 10 words and pretend you're in a conversation with me and respond to: {whisper_text}"}]
    )

    chatgpt_output = completion["choices"][0]["message"]["content"]

    tts = gTTS(text=chatgpt_output, lang='en')

    filename = "abc.mp3"
    tts.save("api/"+filename)
    
    et = time.monotonic() - st

    # playsound.playsound(filename)
    # os.remove(filename) # do we need this?

    # Specify the return type as audio/mp3
    return send_file(filename, mimetype='audio/mp3')

    # return {
    #     "output":chatgpt_output,
    #     "time":f"\n Recording took took: {et*1000:.2f} ms\n"
    #        }


if __name__ == '__main__':
    app.run()