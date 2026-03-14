import requests
import os
import json

# The URL of your local FastAPI service
URL = "http://localhost:8000/transliterate"
# The image you want to test (Ensure this exists in your folder!)
IMAGE_PATH = "test.png" 

def test_glm_ocr():
    if not os.path.exists(IMAGE_PATH):
        print(f"❌ Error: Could not find '{IMAGE_PATH}'. Please add an image and try again.")
        return

    print(f"📡 Sending '{IMAGE_PATH}' to GLM-OCR (0.9B)...")
    
    try:
        with open(IMAGE_PATH, "rb") as f:
            files = {"file": f}
            response = requests.post(URL, files=files)
            
            if response.status_code == 200:
                result = response.json()
                transcription = result.get("transcription", "")
                
                print("\n📄 --- AI TRANSCRIPTION START (MARKDOWN) ---")
                print(transcription if transcription else "[No text detected]")
                print("--- END OF TRANSCRIPTION ---\n")
                
                # Check VRAM health after the run
                health_check = requests.get("http://localhost:8000/health").json()
                print(f"📊 VRAM Status: {health_check.get('vram_allocated')} used.")
                
            else:
                print(f"❌ Server Error {response.status_code}: {response.text}")

    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    test_glm_ocr()
    