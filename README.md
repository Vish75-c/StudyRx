# 💊 StudyRx — AI Study Partner for Medical Students

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://study-rx.vercel.app/)

> **Stop drowning in PDFs. Start chatting with your syllabus.**

StudyRx is a specialized Retrieval-Augmented Generation (RAG) platform designed specifically for the rigorous demands of medical education. It transforms static lecture notes, complex drug manuals, and research papers into an interactive, searchable knowledge base.

---

## 🌟 Key Features

* **📚 Precision Chat:** Ask questions in plain English and receive answers grounded *only* in your uploaded materials.
* **📍 Source Citation:** Every answer includes the exact document name and page number for immediate verification.
* **🧠 Intelligent Quiz Engine:** Generate custom MCQ quizzes (5-20 questions) based on your notes with adjustable difficulty (Easy, Medium, Hard).
* **⏱️ Exam Simulation:** Practice under pressure with a countdown timer and structured navigation.
* **📊 Performance Tracking:** Review detailed explanations for every question and track your score improvement over time.
* **🗂️ Subject Organization:** Group your content into dedicated collections like Anatomy, Physiology, or Pharmacology.

---

## 🛠️ Architecture & Tech Stack

The system utilizes a modern decoupled architecture to handle heavy PDF processing and low-latency AI responses.

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | High-performance, responsive UI with Zustand state management. |
| **Backend** | Node.js, Express, MongoDB | User authentication, metadata management, and session tracking. |
| **AI Service** | Python, FastAPI, LangChain | The RAG engine handling document chunking and retrieval logic. |
| **LLM** | LLaMA 3.3 (via Groq) | High-speed inference for natural language understanding. |
| **Vector DB** | Pinecone | Storing and querying high-dimensional embeddings. |
| **Embeddings** | HuggingFace Inference | Converting text into mathematical vectors. |

---

## 🧬 How It Works

1.  **Ingestion:** Documents (PDFs, URLs, or YouTube transcripts) are uploaded.
2.  **Indexing:** The AI shreds the content into manageable chunks and generates vector embeddings.
3.  **Storage:** These vectors are stored in **Pinecone** for semantic search.
4.  **Retrieval:** When you ask a question, the system retrieves the most relevant snippets from your notes.
5.  **Generation:** **LLaMA 3.3** generates a concise answer using the retrieved context—**no hallucinations**, no internet search.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.11
- API Keys: Groq, Pinecone, HuggingFace

### Local Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/studyrx.git
   cd studyrx
   ```

2. **RAG Service (Python)**
   ```bash
   cd rag-service
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Configure .env with API keys
   uvicorn main:app --reload --port 8000
   ```

3. **Backend (Node.js)**
   ```bash
   cd ../backend
   npm install
   # Configure .env with MONGODB_URI & JWT_SECRET
   npm run dev
   ```

4. **Frontend (React)**
   ```bash
   cd ../frontend
   npm install
   # Set VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

---

## 🔑 Environment Variables

### `rag-service/.env`
```env
GROQ_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX=studyrx
HUGGINGFACE_API_KEY=your_token
```

### `backend/.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAG_SERVICE_URL=http://localhost:8000
```

---

## ☁️ Deployment

Optimized for high availability on a ₹0 budget:
- **Frontend:** Vercel
- **Backend/RAG:** Render
- **Database:** MongoDB Atlas & Pinecone Starter

---

## ⚠️ Disclaimer
StudyRx is a study aid. Always verify critical information with primary medical textbooks, faculty, and clinical guidelines.

---
*Built with ❤️ by a student for students.*
