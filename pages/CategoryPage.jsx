import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useApp } from '../context/AppContext';

// Layer 2：課程分類頁（6 個分類共用同一模板，內容由 courses.json 提供）
const CategoryPage = () => {
  const { catId } = useParams();
  const { lang } = useApp();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/courses.json`)
      .then((res) => res.json())
      .then((data) => {
        const target = data.categories.find((c) => c.catId === catId);
        setCategory(target || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('載入分類失敗', err);
        setLoading(false);
      });
  }, [catId]);

  const t = {
    zh: {
      back: '← 返回首頁',
      loading: '載入中…',
      notFound: '找不到此課程分類',
      courseCount: (n) => `共 ${n} 門課程`,
    },
    en: {
      back: '← Back to Home',
      loading: 'Loading…',
      notFound: 'Category not found',
      courseCount: (n) => `${n} courses`,
    },
  }[lang];

  return (
    <>
      <Header />
      <main>
        {loading ? (
          <p className="page-message">{t.loading}</p>
        ) : !category ? (
          <p className="page-message">{t.notFound}</p>
        ) : (
          <>
            {/* 分類頁頭 */}
            <section className="category-page-head">
              <div className="category-page-cover">
                <img src={category.catImage} alt={category.catName} />
              </div>
              <div className="category-page-info">
                <h1>{lang === 'zh' ? category.catName : category.catNameEn}</h1>
                <p>{lang === 'zh' ? category.catDesc : category.catDescEn}</p>
                <span className="course-count">
                  {t.courseCount(category.courses.length)}
                </span>
              </div>
            </section>

            {/* 課程列表 */}
            <section className="course-list-section" aria-label="課程列表">
              <div className="course-grid">
                {category.courses.map((course) => (
                  <CourseCard course={course} key={course.courseId} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
