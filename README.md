# FinAid 智財幫

**專為財務社工設計的智能個案管理系統**，整合語音轉文字、AI 補助查詢與財務視覺化分析，協助社工高效服務弱勢個案。

---

## 專案動機

財務社工在服務弱勢個案時，需耗費大量時間在繁瑣的行政作業，包括手動查詢補助資訊、整理訪談紀錄、比對個案財務狀況等，導致無法將心力投注在更有價值的輔導工作上。

FinAid 透過 **AI 語音轉文字**、**智能補助查詢機器人** 與 **財務圖表視覺化**，將過去需要數小時的作業縮短至數分鐘，讓社工回歸真正重要的事。

---

## 功能特色

| 功能 | 說明 |
|------|------|
| 📋 個案管理 | 建立與管理個案基本資料、財務記錄、投資保險等明細 |
| 📊 財務視覺化 | 月度／年度收支折線圖，快速掌握個案財務趨勢 |
| 🎙️ 語音轉文字 | 上傳訪談錄音，自動生成逐字稿與摘要，支援 PDF 匯出 |
| 🤖 AI 補助查詢 | 根據個案資料自動比對可申請的政府及民間補助 |
---

## 技術架構

```
瀏覽器
  │
  ▼
Nginx（反向代理 / 解決跨域）
  ├── /          →  Next.js     :3000
  ├── /api/      →  Spring Boot :8080
  └── /ai/       →  Python FastAPI :8000
                           │
                           ▼
                       MySQL 8.0
```

### 技術選型

**Frontend**
- Next.js 14 / TypeScript
- MUI（Material UI）
- Recharts（財務圖表）

**Backend**
- Java Spring Boot 3
- Spring Security（JWT 驗證、BCrypt 加密）
- Spring Data JPA

**AI Service**
- Python / FastAPI
- Whisper AI（語音轉文字，WER 8.6%）
- LangChain + OpenAI+RAG（補助查詢機器人）

**Infrastructure**
- MySQL 8.0
- Docker / Docker Compose
- Nginx（反向代理）
- AWS EC2

---

## 快速開始

### 環境需求

- Docker & Docker Compose

### 啟動步驟

```bash
# 1. 複製專案
git clone https://github.com/your-username/FinAid.git
cd FinAid

# 2. 設定環境變數
cp .env.example .env
# 編輯 .env，填入 MySQL 密碼

# 3. 啟動所有服務
docker compose up -d --build

# 4. 開啟瀏覽器
# http://localhost:3000
```

### 預設帳號

| 帳號 | 密碼 | 角色 |
|------|------|------|
| test5@gmail.com | 555 | 基層社工 |

---

---

## 資料庫設計

共 13 張資料表，核心關聯如下：

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
            ├── file（語音檔與逐字稿）
```

---

## 專案亮點

- **解決真實問題**：和產學公司合作，訪談多位資深財務社工，以實際需求驅動開發
- **全端開發**：前端、後端、AI 服務、資料庫設計、雲端部署一手包辦
- **Whisper AI 整合**：評估 Whisper、AWS Transcribe、Microsoft Speech-to-Text 三種服務後，選用準確率最高（WER 8.6%）且成本最低的 Whisper AI
- **容器化部署**：Docker Compose 管理多服務，Nginx 統一入口解決跨域問題

---
## 關於本專案

本專案為資管系產學合作專題，與產學公司共同開發。

**本人負責範疇：**
- 部分後端 API 開發（Spring Boot）
- 雲端部署（AWS EC2 / Docker）
- 資料庫設計
- AI功能（語音轉文字，補助查詢機器人）整合
---

## 授權

本專案為學術用途，未經授權請勿商業使用。