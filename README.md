# BIS Recommendation Engine & Tender Compliance Platform
> **Smart India Hackathon (SIH) 2026** — Preliminary Round (Institute Level)  
> *Developed at Karnavati University (Unitedworld Institute of Technology × KIIF)*

---

## 📌 Project Overview
An intelligent AI-driven compliance engine and tender management platform designed for the **Bureau of Indian Standards (BIS)**. It accelerates tender specification reviews, checks material standards, and provides real-time clause-level engineering guidance to site engineers, auditors, and contractors across India.

---

## 🚀 Key Features
- **Conversational BIS Assistant:** Ask queries on Indian Standards (e.g., *IS 456, IS 800, IS 1893*) and receive structured **Overview**, **Key Clauses & Parameters**, and **Application** guidelines.
- **Automated Document Compliance Check:** Upload engineering drawings and tender specifications (PDF or DOCX) to automatically verify mandatory BIS codes.
- **Tender Ecosystem:** Live Tenders, Future Tenders, and Past Tender audits categorized by material domain (Roadworks, Concrete, Structural, Piping).
- **Quality Control Timeline:** Real-time visual tracking of material testing milestones from sampling to batch certification.
- **FMCS Directory:** Searchable directory of Foreign Manufacturers Certification Scheme licensees.
- **Resilient AI Cascade:** Deterministic AI model invocation (Temperature `0.2`) with automatic fallback to prevent API rate limit interruptions.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 + Custom Glassmorphism Theme
- **Routing:** React Router v7
- **Markdown:** `marked` (Client-side fast rendering)
- **Canvas:** Interactive 2D constellation particle network of interconnected IS codes

### Backend
- **Framework:** FastAPI (Python 3.12, Asynchronous ASGI)
- **Server:** Uvicorn
- **AI Engine:** Google GenAI SDK (`gemini-3.5-flash-lite` / `gemini-3.6-flash`)
- **Document Ingestion:** PyMuPDF (`fitz`) for PDF stream extraction + `python-docx` for OpenXML documents
- **Data Validation:** Pydantic v2 schemas

---

## 📁 Repository Structure
```
SIH26108/
├── backend/
│   ├── document_parser.py     # PDF & DOCX byte extraction pipeline
│   ├── main.py                # FastAPI endpoints & Gemini fallback cascade
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── pages/             # Home, LiveTenders, Timeline, etc.
│   │   ├── Layout.jsx         # App shell & floating code canvas
│   │   ├── App.jsx            # Route declarations
│   │   ├── main.jsx           # React root mount
│   │   └── index.css          # Design tokens & glassmorphism styles
│   ├── package.json
│   └── vite.config.js         # Vite proxy & Tailwind integration
└── README.md
```

---

## ⚙️ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate venv:
# Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create .env file:
# GEMINI_API_KEY=your_api_key_here

uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
