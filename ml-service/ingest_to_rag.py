import json
import re

def markdown_to_hierarchy(doc_id, markdown_text, metadata):
    # Split by headers (# or ##) to find sections
    sections = re.split(r'\n(?=#+ )', markdown_text)
    
    structured_sections = []
    
    for section in sections:
        lines = section.strip().split('\n')
        if not lines: continue
        
        # The first line is usually the Header/Title
        title = lines[0].replace('#', '').strip()
        content = "\n".join(lines[1:])
        
        # Simple heuristic: if it contains '|', it's likely a table layout
        layout_type = "table_grid" if "|" in content else "paragraph_block"
        
        # Hierarchical Chunking: Break section into small, meaningful sentences
        chunks = [line.strip() for line in lines[1:] if len(line.strip()) > 5]
        
        structured_sections.append({
            "title": title,
            "layout": layout_type,
            "content": content[:200], # Summary
            "chunks": chunks
        })
        
    return {
        "doc_id": doc_id,
        "metadata": metadata,
        "hierarchy": {
            "level": "root",
            "sections": structured_sections
        }
    }

# Example usage (to be called by main.py)
def save_to_knowledge_base(new_entry):
    try:
        with open("knowledge_base.json", "r+") as f:
            data = json.load(f)
            data.append(new_entry)
            f.seek(0)
            json.dump(data, f, indent=2)
    except FileNotFoundError:
        with open("knowledge_base.json", "w") as f:
            json.dump([new_entry], f, indent=2)