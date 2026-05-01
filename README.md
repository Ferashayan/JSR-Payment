<div align="center">
  <img width="1200" height="475" alt="JSR Payment Banner" src="profile_image.jpg" />

  # JSR FinTech Payroll Platform 💳

  **Building the future of payment for companies in Jordan and the Middle East, making it easy, fast, and secure.**
</div>

---

## 📖 Overview

**JSR Payment** is a comprehensive B2B SaaS payroll and financial management platform. It combines a modern, premium Next.js frontend with an intelligent, AI-powered FastAPI backend (JSR Payment Agent) to streamline salary distributions, contract management, and employee self-service.

## ✨ Key Features

- **📊 Modern Dashboard**: Comprehensive insights into company balance, active employees, and recent transactions.
- **💸 Bulk Pay (مسير الرواتب)**: Upload CSV files to process mass payrolls. Auto-calculates base salary, housing (25%), transport (10%), and GOSI deductions (9.75%).
- **📄 Smart Contracts**: Auto-generated, professional Arabic employment contracts that are print-ready and fully compliant.
- **💼 Digital Wallets**: Multi-currency wallets for employees (SAR, AED, USD, etc.) with real-time transaction tracking.
- **🤖 AI Assistant (JSR Agent)**: Built-in LangChain + Gemini 2.5 AI agent to assist HR and employees with queries related to payroll, GOSI, Mudad systems, and company policies.

## 🛠️ Technology Stack

### Frontend (Web App)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 (Glassmorphism, Dark Mode)
- **Typography**: IBM Plex Sans Arabic (Primary) & Inter (Numbers/En)

### Backend (AI Agent)
- **Framework**: FastAPI (Python 3.10+)
- **AI / LLM**: LangChain 0.3 + Google Gemini 2.5 Flash
- **Data Validation**: Pydantic v2
- **Streaming**: SSE via `sse-starlette`

---

## 📁 Repository Structure

```text
JSR/
├── app/                  # Next.js App Router (Frontend Pages)
├── components/           # React UI Components (AppShell, ChatPanel, etc.)
├── agent/                # FastAPI Backend (JSR Payment Agent)
│   ├── app/              # Python FastAPI Application
│   │   ├── api/          # Endpoints
│   │   └── agent/        # LangChain tools and prompts
│   ├── data/             # Mock data for AI context
│   └── requirements.txt  # Python dependencies
├── public/               # Static assets
└── package.json          # Node.js dependencies
```

---

## 🚀 Run Locally

To run the full stack locally, you need to start **both** the FastAPI backend and the Next.js frontend.

### 1️⃣ Start the AI Backend (Agent)

Open a terminal and navigate to the `agent` directory:

```bash
cd agent
```

**Create a virtual environment and activate it:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Configure environment variables:**
Duplicate `.env.example` to `.env` and add your Google Gemini API key:
```bash
cp .env.example .env
# Edit .env and set GOOGLE_API_KEY=your_api_key_here
```

**Run the FastAPI server:**
```bash
uvicorn app.main:app --reload --port 8000
```
*The backend API and Swagger Docs will be available at `http://localhost:8000/docs`.*

---

### 2️⃣ Start the Frontend (Next.js)

Open a **new** terminal in the root `JSR` directory:

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**
Ensure your `.env.local` file has the following:
```env
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000
# Add your GEMINI_API_KEY if needed by the frontend directly
```

**Run the Next.js development server:**
```bash
npm run dev
```
*The web app will be available at `http://localhost:3000`.*

---

## 🤝 Contributing

This project is maintained by the JSR Technology Solutions team. Ensure you test both the UI interactions and the AI agent responses when submitting pull requests.

## 📄 License

Private — JSR Technology Solutions
