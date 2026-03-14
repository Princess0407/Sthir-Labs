# Sthir Labs: The Immutable Document Provenance Engine

Welcome to Sthir Labs (derived from the Sanskrit word Sthir, meaning "stable" or "permanent"). This project was born out of a terrifying modern reality: with the rise of generative AI, deepfakes, and advanced digital editors, forging a financial document, a legal contract, or an identity card takes seconds. The traditional method of verifying documents—having a human look at them—is fundamentally broken because the human eye cannot detect pixel-level manipulation.

We realized that society is facing a massive "Trust Deficit." We needed a system that doesn't rely on human trust, but on mathematical certainty. Sthir Labs is our answer: a Zero-Trust infrastructure that combines Neural Forensics with Distributed Ledger Consensus to ensure that a document's origin and integrity can never be questioned.

## Our Thought Process

To solve this problem, we couldn't just build a simple scanner. We had to build an ecosystem. Here is how we engineered the solution:
**1. The AIML Layer: The "Digital Detective"**

First, we had to figure out how to actually catch a forgery. Standard OCR just reads text, but it doesn't verify trust.
    How we built it: We designed our Python backend to act as a forensic scientist. Our AI layer looks beyond the visible text to analyze pixel density, compression artifacts, and metadata anomalies.

*The result:* If someone splices a fake signature or alters a date on a PDF, our AI detects the micro-inconsistencies in the digital fabric of the file and generates a Forensic Score. But AI alone gives an opinion, not a permanent record...

## 2. The Blockchain Anchor: The "Immutable Vault"

If the AI determines a document is authentic today, how do we prove it hasn't been tampered with tomorrow? We needed a way to freeze time.
Why Blockchain? Blockchain was the perfect missing puzzle piece because of its core property: absolute immutability.
How it works: We don't store highly sensitive documents on a public ledger (which would be a privacy nightmare). Instead, the system generates a unique cryptographic hash (SHA-256) of the document—its "Digital Fingerprint"—and anchors only that hash to an EVM-compatible Smart Contract. If even a single comma is changed ten years from now, the hash will break, and the system will flag it as fraudulent.

## 3. The Cybersecurity Envelope: The "Zero-Trust Shield"

A system that dictates "Truth" is a massive target for bad actors. We wrapped our AI and Blockchain in a military-grade security envelope.
Aadhar-Linked Identity: A verified document is useless if uploaded by a ghost. By linking the upload process to a 12-digit Aadhar verification (via simulated ZKP/OTP), we ensure a strict Chain of Custody.
Containerized Isolation: Using Docker, we strictly separated our Next.js Frontend from the Python API.
Transient Memory: The document exists in memory just long enough to be hashed and analyzed. Once the blockchain transaction is confirmed, the raw file is discarded.

## The Technology Stack

  Frontend (The Face): Next.js 14, React, Tailwind CSS, Framer Motion (Styled in a premium Warm Alabaster & Pastel Peach UI).
  Backend (The Brain): Python (FastAPI/Flask) containerized via Docker.
  Blockchain (The Soul): Ethereum-compatible Smart Contracts written in Solidity.
 Security: CORS protection, simulated Identity routing, and SHA-256 Hashing.

## Getting Started

If you are a judge or a developer looking to run Sthir Labs locally, follow these steps.
Prerequisites

    Docker & Docker Compose (Highly Recommended for the easiest setup)

    Node.js (v18+)

    Python 3.10+

## Installation 

The most reliable way to spin up the entire ecosystem (Frontend UI + Python Backend) is via Docker Compose:
Bash

## 1. Clone the repository
```
git clone https://github.com/Princess0407/Sthir-Labs.git
cd Sthir-Labs
```
## 2. Build and launch the containers
```
docker-compose up --build
```

*The UI will be live at:*
```
http://localhost:3000
```

*The API will be listening at:*
```
http://localhost:8000
```

 ## Manual Launch 

If you prefer to run the services independently:

1. Start the Backend:
```
Bash
```

```
cd backend
pip install -r requirements.txt
python main.py  # Ensure it runs on Port 8000 so that it can be fetched by the frontend
```
2. Start the Frontend:
```
Bash
```

cd SovereignVault/frontend
npm install
npm run dev
