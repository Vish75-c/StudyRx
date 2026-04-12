# 💊 StudyRx — AI Study Partner for Medical Students

> Upload your notes. Chat with them. Quiz yourself. Score better.

---

## What is StudyRx?

StudyRx is an AI powered study tool built for medical students.

You have hundreds of PDFs, lecture notes, drug manuals and research papers. Finding anything specific inside all of them takes forever. Studying from them is even harder.

StudyRx fixes that.

Upload your study material, ask questions in plain English, and get answers directly from your own notes — not from the internet, not from an AI making things up — from exactly what your professor taught you.

Then test yourself with an AI generated quiz based on your own uploaded content and track how your scores improve over time.

---

## Who is this for?

- MBBS and medical students preparing for exams
- Students who want to study smarter not harder
- Anyone buried under a pile of PDFs they never know how to properly study from

---

## What can you do?

### 📚 Chat with your notes
Upload a PDF of your anatomy textbook, paste a link to a medical article, or add a YouTube lecture. Then ask questions like you would ask a senior student. Get answers with the exact page number the answer came from.

```
You:  "What is the mechanism of action of beta blockers?"
AI:   "According to your Pharmacology notes (Page 47), beta blockers
       work by competitively blocking catecholamines at beta-adrenergic
       receptors, reducing heart rate and blood pressure..."
```

### 🧠 Generate a quiz from your notes
Select any collection and generate 5, 10, 15 or 20 questions. Choose easy, medium or hard difficulty. The AI reads your actual uploaded notes — not generic internet questions.

### ⏱️ Take the quiz with a timer
MCQ format with countdown timer. Navigate between questions, change answers, submit when ready.

### 📊 See your score and learn from mistakes
After submitting, see your percentage, grade, which answers were wrong, and an AI generated explanation for every question — with context pulled directly from your notes.

### 📈 Track your progress
Every attempt is saved. See how your scores improve as exams get closer. Best score, average score, total attempts — all tracked per subject.

### 🗂️ Organise by subject
Create collections for Anatomy, Physiology, Pharmacology, Pathology — upload relevant content to each and keep everything organised.

---

## How it works

```
1. You upload a PDF / URL / YouTube lecture
           ↓
2. AI reads and indexes every page
           ↓
3. You ask a question or start a quiz
           ↓
4. AI finds the most relevant content
           ↓
5. Answer generated from YOUR notes only
           ↓
6. Source + page number shown with every answer
```

The AI never answers from outside your uploaded content. No hallucinations. No random internet facts. Just your syllabus.

---

## Features

- Upload PDFs, website links and YouTube lecture transcripts
- Chat with documents and get source cited answers
- AI generated MCQ quizzes from your own notes
- Easy, medium and hard difficulty levels
- Countdown timer during quiz
- Detailed score with per question explanations
- Full attempt history to track improvement
- Organise content into subject collections
- Secure login so your notes stay private
- Export chat as PDF

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js, MongoDB Atlas |
| AI Service | Python, FastAPI, LangChain |
| Vector Database | Pinecone |
| LLM | LLaMA3 via Groq API |
| Embeddings | HuggingFace Inference API |
| Deployment | Vercel + Render |

---

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.11
- MongoDB Atlas account (free)
- Groq API key (free at groq.com)
- Pinecone account (free at pinecone.io)
- HuggingFace account (free at huggingface.co)

### Setup

```bash
# Clone repo
git clone https://github.com/yourusername/studyrx.git
cd studyrx

# RAG Service
cd rag-service
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in GROQ_API_KEY, PINECONE_API_KEY, HUGGINGFACE_API_KEY
uvicorn main:app --reload --port 8000

# Backend
cd ../backend
npm install
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, RAG_SERVICE_URL
npm run dev

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
RAG_SERVICE_URL=http://localhost:8000
```

### rag-service/.env
```
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=studyrx
HUGGINGFACE_API_KEY=your_hf_token
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| RAG Service | Render | Free |
| Database | MongoDB Atlas | Free |
| Vector DB | Pinecone | Free |
| LLM | Groq API | Free |
| Embeddings | HuggingFace API | Free |

**Total cost: ₹0**

---

## Disclaimer

StudyRx is a study aid only. Always verify important information with your textbooks, professors and clinical supervisors. Not a substitute for medical education or professional advice.

---

Built by a student, for students 💊