import os
import json
def traverse_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.startswith("paper") and file.endswith(".json"):
                file_path = os.path.join(root, file)
                yield file_path

def read_json(file_path):
    with open(file_path, 'r',encoding='utf-8') as f:
        content = json.load(f)
    return content