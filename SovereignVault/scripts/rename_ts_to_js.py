import os
import glob
import re

frontend_dir = "/home/princess/SthirLabs/SovereignVault/frontend"

# 1. Rename files
for root, dirs, files in os.walk(frontend_dir):
    for filename in files:
        if filename.endswith(".tsx") or filename.endswith(".ts"):
            old_path = os.path.join(root, filename)
            
            if filename.endswith(".tsx"):
                new_filename = filename[:-4] + ".jsx"
            else:
                new_filename = filename[:-3] + ".js"
                
            new_path = os.path.join(root, new_filename)
            os.rename(old_path, new_path)
            print(f"Renamed: {old_path} -> {new_path}")

# 2. Update imports in all .js and .jsx files
for root, dirs, files in os.walk(frontend_dir):
    for filename in files:
        if filename.endswith(".jsx") or filename.endswith(".js"):
            file_path = os.path.join(root, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Replace .tsx with .jsx in imports (including dynamic imports)
            # A simple string replacement is mostly safe for this within quotes
            new_content = re.sub(r'([\'"])(.*?)\.tsx\1', r'\1\2.jsx\1', content)
            new_content = re.sub(r'([\'"])(.*?)\.ts\1', r'\1\2.js\1', new_content)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated imports in: {file_path}")
