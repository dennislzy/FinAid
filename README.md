# FinAid — Smart Case Management System for Financial Social Workers

**An intelligent case management system designed for financial social workers**, integrating speech-to-text, AI subsidy search, and financial data visualization to help social workers efficiently serve disadvantaged cases.

---

## Project Motivation

Financial social workers spend a large amount of time on tedious administrative work when serving disadvantaged cases — manually looking up subsidy information, organizing interview records, and comparing cases' financial situations — which leaves little time for more valuable counseling work.

FinAid uses **AI speech-to-text**, an **intelligent subsidy search bot**, and **financial chart visualization** to shrink tasks that used to take hours down to minutes, letting social workers refocus on what truly matters.

---

## Features

| Feature | Description |
|------|------|
| 📋 Case Management | Create and manage case profiles, financial records, and details on investments/insurance |
| 📊 Financial Visualization | Monthly/yearly income-expense line charts for quickly understanding a case's financial trends |
| 🎙️ Speech-to-Text | Upload interview recordings to automatically generate transcripts and summaries, with PDF export support |
| 🤖 AI Subsidy Search | Automatically matches applicable government and private subsidies based on case data |

---

## Technical Architecture

```
Browser
  │
  ▼
Nginx (Reverse Proxy / CORS handling)
  ├── /          →  Next.js     :3000
  ├── /api/      →  Spring Boot :8080
  └── /ai/       →  Python FastAPI :8000
                           │
                           ▼
                       MySQL 8.0
```

### Tech Stack

**Frontend**
- Next.js 14 / TypeScript
- MUI (Material UI)
- Recharts (financial charts)

**Backend**
- Java Spring Boot 3
- Spring Security (JWT authentication, BCrypt encryption)
- Spring Data JPA

**AI Service**
- Python / FastAPI
- Whisper AI (speech-to-text, WER 8.6%)
- LangChain + OpenAI + RAG (subsidy search bot)

**Infrastructure**
- MySQL 8.0
- Docker / Docker Compose
- Nginx (reverse proxy)
- AWS EC2

---

## Quick Start

### Requirements
- Docker & Docker Compose

### Setup Steps
```bash
# 1. Clone the project
git clone https://github.com/your-username/FinAid.git
cd FinAid

# 2. Configure environment variables
cp .env.example .env
# Edit .env and fill in the MySQL password

# 3. Start all services
docker compose up -d --build

# 4. Open your browser
# http://localhost:3000
```

### Default Account
| Email | Password | Role |
|------|------|------|
| test5@gmail.com | 555 | Frontline Social Worker |

---

## Database Design

13 tables in total, with the core relationships as follows:

```
social_worker
    └── case_info
            ├── household_monthly_financial_records
            ├── household_year_financial_records
            ├── subsidy_list
            ├── insurance_list
            ├── stock_purchase_records
            ├── fund_invest
            ├── bond_list
            ├── bidding_records
            ├── file (audio recordings and transcripts)
```

---

## Project Highlights

- **Solving a real-world problem**: Developed in partnership with an industry company, driven by interviews with several experienced financial social workers to capture actual needs
- **Full-stack development**: Handled frontend, backend, AI services, database design, and cloud deployment end-to-end
- **Whisper AI integration**: Evaluated Whisper, AWS Transcribe, and Microsoft Speech-to-Text, and chose Whisper AI for its highest accuracy (WER 8.6%) at the lowest cost
- **Containerized deployment**: Docker Compose manages multiple services, with Nginx as a unified entry point to solve CORS issues

---

## About This Project

This project is an industry-academia collaboration capstone project from the Department of Information Management, developed together with an industry partner.

**My responsibilities:**
- Partial backend API development (Spring Boot)
- Cloud deployment (AWS EC2 / Docker)
- Database design
- AI feature integration (speech-to-text, subsidy search bot)

---

## License

This project is for academic purposes only. Unauthorized commercial use is prohibited.
