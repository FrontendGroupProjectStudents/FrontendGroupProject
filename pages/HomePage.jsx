import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { lang } = useApp();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/courses.json`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error('載入分類失敗', err));
  }, []);

  const t = {
    zh: {
      heroTitle: '思捷網上IT專業培訓',
      heroSub: '一站式線上IT學習平台，涵蓋生成式AI、IT認證、數據科學等熱門領域，助你掌握未來技能。',
      heroCta: '瀏覽課程',
      featuresTitle: '為何選擇我們',
      features: [
        { icon: '🎓', title: '專業課程', desc: '由業界專家精心設計，內容實用、貼近職場需求。' },
        { icon: '⏱️', title: '自主學習', desc: '隨時隨地觀看課程，自由安排學習進度。' },
        { icon: '🛡️', title: '認證導向', desc: '針對國際認證設計，助你考取專業證照。' },
        { icon: '🏆', title: '積分獎勵', desc: '購課與測驗合格可賺取積分，累積學習成就。' },
      ],
      coursesTitle: '課程分類',
      coursesSub: '點擊分類，探索各領域的專業課程',
    },
    en: {
      heroTitle: 'Sijie Online IT Academy',
      heroSub: 'One-stop online IT learning platform covering Generative AI, IT Certification, Data Science and more.',
      heroCta: 'Browse Courses',
      featuresTitle: 'Why Choose Us',
      features: [
        { icon: '🎓', title: 'Professional Courses', desc: 'Designed by industry experts, practical and job-ready.' },
        { icon: '⏱️', title: 'Self-Paced', desc: 'Learn anytime, anywhere at your own pace.' },
        { icon: '🛡️', title: 'Certification-Focused', desc: 'Built for international certifications to boost your career.' },
        { icon: '🏆', title: 'Points Rewards', desc: 'Earn points by purchasing courses and passing quizzes.' },
      ],
      coursesTitle: 'Course Categories',
      coursesSub: 'Click a category to explore our courses',
    },
  }[lang];

  return (
    <>
      <Header />
      <main>
        {/* Hero 區 */}
        <section className="hero">
          <div className="hero-inner">
            <h1 className="hero-title">{t.heroTitle}</h1>
            <p className="hero-sub">{t.heroSub}</p>
            <a href="#courses" className="btn btn-primary btn-lg">{t.heroCta}</a>
          </div>
        </section>

        {/* 特色區 */}
        <section className="features" aria-label="網站特色">
          <div className="features-grid">
            {t.features.map((f) => (
              <article className="feature-card" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 課程分類區（6 大分類） */}
        <section className="category-section" id="courses">
          <div className="section-head">
            <h2 className="section-title">{t.coursesTitle}</h2>
            <p className="section-sub">{t.coursesSub}</p>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard category={cat} key={cat.catId} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
