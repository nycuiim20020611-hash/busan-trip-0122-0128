# Busan Trip Planner

這是一個專為釜山旅行設計的行程規劃應用程式。

## 功能特色

- **行程管理**：新增、編輯、刪除行程，並支援拖拉排序（未來功能）。
- **日期篩選**：可依照日期檢視特定天的行程。
- **地圖整合**：
    - 點擊行程或願望清單中的「Naver Map」按鈕。
    - 系統會自動將地點名稱從中文翻譯成韓文。
    - 自動開啟 Naver Map 搜尋結果頁面。
- **願望清單**：記錄想去的地點、美食或住宿。

## 安裝與執行

1.  **複製專案**
    ```bash
    git clone <repository-url>
    cd busan-trip-planner
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

3.  **設定環境變數**
    複製 `.env.example` (如果有) 或直接建立 `.env` 檔案，並填入以下內容：
    ```env
    VITE_OPENAI_API_KEY=your_openai_api_key_here
    VITE_GOOGLE_SHEETS_API_URL=your_google_script_web_app_url
    ```
    > **注意**：
    > - `VITE_OPENAI_API_KEY`: 用於地點翻譯 (OpenAI API)。
    > - `VITE_GOOGLE_SHEETS_API_URL`: 用於資料儲存 (Google Apps Script)。請參考 `google-apps-script.md` 進行設定。

4.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

## 部署

本專案已設定 GitHub Actions，推送到 `main` 分支時會自動部署至 GitHub Pages。

### 設定步驟

1.  將專案推送到 GitHub。
2.  在 GitHub Repository 的 **Settings** > **Secrets and variables** > **Actions** 中，新增以下 Repository secrets：
    - `VITE_OPENAI_API_KEY`: 您的 OpenAI API Key
    - `VITE_GOOGLE_SHEETS_API_URL`: 您的 Google Apps Script Web App URL
3.  確保 GitHub Pages 設定 (Settings > Pages) 的 Source 為 `gh-pages` 分支 (第一次部署後會自動建立)。

## 技術堆疊

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenAI API
