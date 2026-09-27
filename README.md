# 思捷網上IT專業培訓（Sijie Online IT Academy）

一個以 React + Vite 開發的多頁商業教學網站前端專案，可部署到 GitHub Pages。

## 專案特色

- **25 個頁面**：1 個首頁（Layer 1）+ 6 個課程分類頁（Layer 2）+ 18 個課程詳情頁（Layer 3）+ 輔助頁（關於我們 / 聯絡我們 / 私隱政策 / 404）
- **6 大課程分類**：生成式AI、IT認證、數據科學、ChatGPT商業應用、提示語工程、微軟Excel（每類 3 門課，共 18 門）
- **中英雙語切換**
- **會員系統**：註冊 / 登入 / 登出，帳號資料存於瀏覽器 localStorage（因 GitHub Pages 無後端，無法寫入 .json）
- **購物車與積分**：可將課程加入購物車，結帳後為登入會員累積積分
- **課程詳情頁**：課程簡介、等級、評分、時長、售價、大綱、你將學到、適合對象、影片預覽區
- **語意化 HTML**：正確運用 `<header>` `<nav>` `<main>` `<section>` `<article>` `<aside>` `<footer>`
- **響應式設計**：手機、平板、桌面皆正常顯示

## 專案結構

```
sijie-it-academy/
├── index.html
├── package.json
├── vite.config.js          # base:'./' 支援 GitHub Pages 子路徑部署
├── public/
│   ├── data/
│   │   └── courses.json    # 全部課程資料（課程內容皆由此檔案控制）
│   └── images/
│       └── courses/        # 課程圖片（目前為預留圖，可自行替換同名檔案）
└── src/
    ├── main.jsx
    ├── App.jsx             # 路由設定
    ├── context/AppContext.jsx   # 全域狀態（語言/會員/購物車）
    ├── utils/storage.js    # localStorage 資料操作
    ├── css/styles.css      # 全域樣式
    ├── components/         # Header/Footer/Cards/Modals/Cart/LanguageSwitch
    └── pages/              # HomePage/CategoryPage/CourseDetailPage/輔助頁
```

## 本地開發

```bash
npm install
npm run dev        # 啟動開發伺服器
npm run build      # 建置產出 dist/
npm run preview    # 預覽建置結果
```

## 部署到 GitHub Pages

1. 建立 GitHub 儲存庫，將本專案上傳。
2. `npm run build` 產生 `dist/` 資料夾。
3. 將 `dist/` 內容推送到 `gh-pages` 分支（或啟用 Actions 自動部署），
   並在 Settings → Pages 中設定來源為 `gh-pages`。

> 已設定 `vite.config.js` 的 `base: './'`，可部署於 `https://帳號.github.io/儲存庫名/` 等子路徑。

## 如何新增 / 修改課程

所有課程內容都集中於 `public/data/courses.json`，修改該檔案即可：
- 在分類的 `courses` 陣列中新增物件，指定唯一 `courseId`、標題、售價、評分、大綱、`videoUrl`（可填影片連結）等。
- 圖片放在 `public/images/courses/` 並把檔名填入 `imageUrl`。

## 會員與積分說明（重要）

GitHub Pages 是純靜態託管，**沒有後端伺服器，無法把註冊資料寫回 .json 檔案**。因此：
- 會員帳號、登入狀態、積分、購物車皆儲存於**訪客自己的瀏覽器**（localStorage）。
- 每位訪客各有一份獨立資料；清除瀏覽器資料會遺失。
- 若需跨裝置永久保存會員資料，必須另外架設後端伺服器（如 Node.js API + 資料庫）。

## 技術棧

- HTML5（語意化標籤）
- CSS3（Flexbox / Grid、響應式 Media Query）
- JavaScript（ES6+）
- React 18 + React Router 6
- Vite（建置工具）
