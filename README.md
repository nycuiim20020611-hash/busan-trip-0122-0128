# 🇰🇷 Busan Trip Planner (釜山行程規劃)

這是一個專為釜山旅行設計的現代化行程規劃應用程式。
結合 **Google Apps Script** 進行雲端資料同步，並設計為可免費託管於 **GitHub Pages**。

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React_|_Vite_|_TypeScript_|_Tailwind-blue)

## ✨ 功能特色

- **📅 智慧行程管理**：視覺化時間軸，支援新增、編輯、刪除行程。
- **📝 願望清單**：分類管理美食、景點、購物等願望。
- **🗺️ 地圖導航**：一鍵開啟 Naver Map 搜尋地點。
- **☁️ 雲端同步**：支援與 Google Sheets 同步資料 (需設定 GAS)。

## 🚀 快速開始

### 1. 安裝專案

確保你的電腦已安裝 Node.js (v18+)。

```bash
# 1. 下載專案
git clone <your-repo-url>
cd busan-trip-planner

# 2. 安裝依賴
npm install

# 3. 啟動本機伺服器
npm run dev
```

瀏覽器打開 `http://localhost:3000` 即可看到畫面。

### 2. 環境變數 (.env)

本專案依賴 Google Apps Script (GAS) 進行後端處理。請在根目錄建立 `.env`：

```env
# Google Apps Script Web App URL
VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/你的GAS-ID/exec
```

> **注意**：絕不要將 `.env` 提交到 GitHub。

---

## ☁️ Google Apps Script (GAS) 設定

為了讓資料同步功能運作，你需要部署一個 GAS 專案：

1.  開啟 Google Drive，建立新的 Google Apps Script。
2.  將本專案提供的 `gas-no-ai.js` (或是你之前的版本) 內容複製進去。
3.  點擊右上方 **部署 (Deploy)** > **新增部署 (New deployment)**。
4.  設定如下：
    *   **類型**：Web App
    *   **執行身分 (Execute as)**：我 (Me)
    *   **誰可以存取 (Who has access)**：**任何人 (Anyone)** (解決 CORS 問題的關鍵)
5.  複製產生的 Web App URL，填入你的 `.env` 和 GitHub Secrets。

---

## 📦 GitHub Pages 自動部署

本專案已設定 GitHub Actions，只要 Push 到 `main` 分支就會自動部署。

### 1. 設定 Secrets
在 GitHub Repo 的 **Settings** > **Secrets and variables** > **Actions** 新增：

*   `VITE_GOOGLE_SHEETS_API_URL`: 你的 GAS Web App URL

### 2. 啟用 Pages
在 **Settings** > **Pages**：
*   **Build and deployment Source**: 選擇 **GitHub Actions**。

### 3. 用戶手動觸發
或是直接 Push 程式碼：
```bash
git add .
git commit -m "Update"
git push origin main
```

---

## 🛠️ 專案結構

```
src/
├── components/   # React 元件 (Itinerary, Wishlist, etc.)
├── services/     # API 服務 (storage.ts, exchange.ts)
├── types/        # TypeScript 型別定義
└── App.tsx       # 主程式入口
```

## 📝 授權
MIT License
