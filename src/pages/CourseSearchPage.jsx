import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useApp } from '../context/AppContext';

// Layer 2：課程搜尋頁（包含即時搜尋功能）
const CourseSearchPage = () => {
  const { lang } = useApp();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/courses.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.categories) {
          setCategory(null);
          setLoading(false);
          return;
        }

        // 直接取出所有類別下的課程並合併成 ALL
        const allCourses = data.categories.flatMap((c) => c.courses || []);

        setCategory({
          catId: 'ALL',
          catName: '所有課程',
          catNameEn: 'All Courses',
          catDesc: '瀏覽思捷網上IT專業培訓提供的所有優質課程。',
          catDescEn: 'Browse all available courses offered by Sijie Online IT Academy.',
          catImage: 'images/courses/genai-cover.jpg',
          courses: allCourses,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('載入分類失敗', err);
        setLoading(false);
      });
  }, []);

  const t = {
    zh: {
      back: '← 返回首頁',
      loading: '載入中…',
      notFound: '找不到此課程分類',
      courseCount: (n) => `共 ${n} 門課程`,
      searchPlaceholder: '搜尋課程編號、名稱、難易度或描述…',
      noSearchResult: '沒有找到符合搜尋條件的課程',
    },
    en: {
      back: '← Back to Home',
      loading: 'Loading…',
      notFound: 'Category not found',
      courseCount: (n) => `${n} courses`,
      searchPlaceholder: 'Search course ID, title, level, or description…',
      noSearchResult: 'No courses found matching your search.',
    },
  }[lang];

  // 即時搜尋過濾邏輯：指定 7 個欄位
  const filteredCourses = (category?.courses || []).filter((course) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const fieldsToSearch = [
      course.courseId,
      course.title,
      course.titleEn,
      course.level,
      course.levelEn,
      course.description,
      course.descriptionEn,
    ];

    return fieldsToSearch.some(
      (field) => field && field.toString().toLowerCase().includes(query)
    );
  });

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
                  {t.courseCount(filteredCourses.length)}
                </span>
              </div>
            </section>

            {/* 即時搜尋輸入框 */}
            <section className="search-bar-section" style={{ padding: '20px 0', textAlign: 'center' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="search-input"
              />
            </section>

            {/* 課程列表 */}
            <section className="course-list-section" aria-label="課程列表">
              {filteredCourses.length === 0 ? (
                <p className="page-message">{t.noSearchResult}</p>
              ) : (
                <div className="course-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard course={course} key={course.courseId} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CourseSearchPage;