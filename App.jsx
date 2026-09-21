import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Layer 1：首頁 */}
      <Route path="/" element={<HomePage />} />
      {/* Layer 2：6 個課程分類頁（共用模板） */}
      <Route path="/category/:catId" element={<CategoryPage />} />
      {/* Layer 3：18 個課程詳情頁（共用模板） */}
      <Route path="/course/:courseId" element={<CourseDetailPage />} />
      {/* 輔助頁面 */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
