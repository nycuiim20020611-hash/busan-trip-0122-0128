# 🇰🇷 Busan Trip Planner (釜山行程規劃)

這是一個專為釜山旅行設計的現代化行程規劃應用程式。
結合 **OpenAI (GPT-4o)** 進行智慧地點翻譯，並整合 **Google Apps Script** 進行雲端資料同步。

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React_|_Vite_|_TypeScript_|_Tailwind-blue)

## ✨ 功能特色

- **📅 智慧行程管理**：視覺化時間軸，支援新增、編輯、刪除行程。
- **🤖 AI 地點翻譯**：
    - 點擊「Naver Map」按鈕，系統自動將中文地點翻譯為韓文。
    - 智慧避開瀏覽器彈窗攔截，提供無縫的跳轉體驗。
- **📝 願望清單**：分類管理美食、景點、購物等願望，並支援快速搜尋。
- **☁️ 雲端同步**：支援與 Google Sheets 同步資料 (需設定 GAS)。

## 🚀 快速開始

### 1. 環境需求
- Node.js (v18 或更高版本)
- npm 或 yarn

### 2. 安裝說明
```bash
# 複製專案
git clone <your-repo-url>
cd busan-trip-planner

# 安裝依賴套件
npm install
```

### 3. 環境變數設定 (.env)
請在專案根目錄建立 `.env` 檔案，並填入以下資訊：

```env
# Google Apps Script Web App URL (用於資料儲存與 AI 翻譯代理)
VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/xxxx/exec
```

> **注意**：
> 1. 本專案已移除前端的 `VITE_OPENAI_API_KEY` 以防止金鑰外洩。
> 2. 請務必參考 `google-apps-script.md` 設定 Google Apps Script，並在 GAS 的 **Script Properties** 中設定 `OPENAI_API_KEY`。

### 4. 啟動開發環境
```bash
npm run dev
```
瀏覽器打開 `http://localhost:5173` 即可看到畫面。

---

## 📦 建置與部署

### 本地建置
若要產生正式版 (Production) 的靜態檔案：
```bash
npm run build
```
產生的檔案會位於 `dist/` 目錄中。

### 自動化部署 (GitHub Pages)
本專案已設定 **GitHub Actions**，只要將程式碼推送到 `main` 分支，即會自動部署。

**設定步驟：**
1. 將專案推送到 GitHub Repository。
2. 進入 Repository 的 **Settings** > **Secrets and variables** > **Actions**。
3. 點擊 **New repository secret**，新增以下 Secret：
    - `VITE_GOOGLE_SHEETS_API_URL`: 填入 GAS URL。
    *注意：不再需要設定 VITE_OPENAI_API_KEY*。
4. 進入 **Settings** > **Pages**，確認 "Build and deployment" 的 Source 選擇 **GitHub Actions**。

---

## 🛠️ 技術細節

### 專案結構
```
src/
├── components/   # React 元件 (Itinerary, Wishlist, etc.)
├── services/     # API 服務 (openai.ts, storage.ts)
├── types/        # TypeScript 型別定義
└── App.tsx       # 主程式入口
```

### 關鍵功能實作
- **AI 翻譯抗阻擋**：使用 `window.open('', '_blank')` 預先開啟分頁，再異步載入 AI 翻譯結果，有效解決瀏覽器 Popup Blocker 問題。
- **TypeScript 型別**：全專案採用 TypeScript 開發，確保程式碼健壯性。

## 📝 授權
MIT License
