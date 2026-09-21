import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import './css/styles.css';

// 使用 HashRouter：
// 1) GitHub Pages 無後端重寫規則，Hash 路由不需伺服器設定即可正常導覽；
// 2) 所有路由都掛在同一份 index.html 上，搭配 vite base:'./'，
//    相對路徑讀取 data/courses.json 與圖片在任何頁面都穩定生效。
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
);
