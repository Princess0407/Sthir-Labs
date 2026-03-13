import json
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# 1. Load the "Small but Mighty" embedding model
# This fits easily in your 4GB VRAM alongside GLM-OCR
embedder = SentenceTransformer('all-MiniLM-L6-v2')

class LAHRag:
    def __init__(self, json_path):
        with open(json_path, 'r') as f:
            self.data = json.load(f)
        self.nodes = []
        self._flatten_hierarchy()
        
        # 2. Build the Vector Index
        embeddings = embedder.encode([n['text'] for n in self.nodes])
        self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(np.array(embeddings).astype('float32'))

    def _flatten_hierarchy(self):
        """Turns the Tree into searchable 'Context Nodes'"""
        for doc in self.data:
            for sec in doc['hierarchy']['sections']:
                # We link the chunk to its parent title (Hierarchical Awareness)
                for chunk in sec['chunks']:
                    self.nodes.append({
                        "text": f"[{sec['title']}] {chunk}",
                        "doc_id": doc['doc_id'],
                        "metadata": doc['metadata']
                    })

    def search(self, query, top_k=2):
        query_vec = embedder.encode([query]).astype('float32')
        distances, indices = self.index.search(query_vec, top_k)
        return [self.nodes[i] for i in indices[0]]

# Test it locally
if __name__ == "__main__":
    engine = LAHRag("knowledge_base.json")
    results = engine.search("Who is the owner of survey number 42?")
    for r in results:
        print(f"🔍 Found: {r['text']}")