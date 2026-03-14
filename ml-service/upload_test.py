import requests

# 1. The URL of your running FastAPI server
url = "http://localhost:8000/transliterate"

# 2. The path to the image you want to test
# Make sure this file actually exists in your folder!
image_path = "test_image.jpg" 

with open(image_path, "rb") as f:
    files = {"file": (image_path, f, "image/jpeg")}
    print(f"🚀 Sending {image_path} to Sthir AI Hub...")
    
    response = requests.post(url, files=files)
    
    if response.status_code == 200:
        print("✅ Success!")
        print(response.json())
    else:
        print(f"❌ Failed with status: {response.status_code}")
        print(response.text)