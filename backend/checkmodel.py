import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyBF4Z76Pq5rHjfUqEmnA0lKyUac3uoIsgc")

for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)