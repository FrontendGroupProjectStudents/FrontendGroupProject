import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

// Layer 3：課程詳情頁（18 門課共用同一模板，內容由 courses.json 按 courseId 讀取）
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { lang, addToCart, cart } = useApp();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/courses.json`)
      .then((res) => res.json())
      .then((data) => {
        let found = null;
        for (const cat of data.categories) {
          const c = cat.courses.find((x) => x.courseId === courseId);
          if (c) { found = c; break; }
        }
        setCourse(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error('載入課程失敗', err);
        setLoading(false);
      });
  }, [courseId]);

  const t = {
    zh: {
      back: '← 返回',
      loading: '課程載入中…',
      notFound: '找不到該課程',
      home: '返回首頁',
      videoTitle: '課程預覽',
      videoPlaceholder: '課程介紹影片（5–10 秒）將於此處播放',
      videoSoon: '短片製作中，敬請期待',
      rating: '評分',
      reviews: '則評價',
      students: '學員',
      duration: '課程時長',
      level: '課程等級',
      priceNote: '限時優惠',
      buyNow: '立即購買',
      addCart: '加入購物車',
      inCart: '已在購物車',
      earnPoints: '購買可賺取積分',
      points: '積分',
      whatLearn: '你將學到',
      outlineTitle: '課程大綱',
      audienceTitle: '適合對象',
      audience: '適合對象',
      overview: '課程簡介',
      added: '已加入購物車！',
    },
    en: {
      back: '← Back',
      loading: 'Loading course…',
      notFound: 'Course not found',
      home: 'Back to Home',
      videoTitle: 'Course Preview',
      videoPlaceholder: 'Course intro video (5-10s) will play here',
      videoSoon: 'Video coming soon',
      rating: 'Rating',
      reviews: 'reviews',
      students: 'students',
      duration: 'Duration',
      level: 'Level',
      priceNote: 'Limited-time offer',
      buyNow: 'Buy Now',
      addCart: 'Add to Cart',
      inCart: 'In Cart',
      earnPoints: 'Earn points by purchasing',
      points: 'points',
      whatLearn: 'What You Will Learn',
      outlineTitle: 'Course Outline',
      audienceTitle: 'Who This Course Is For',
      audience: 'Audience',
      overview: 'Overview',
      added: 'Added to cart!',
    },
  }[lang];

  if (loading) {
    return (
      <>
        <Header />
        <main><p className="page-message">{t.loading}</p></main>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <main className="page-message">
          <h2>{t.notFound}</h2>
          <Link to="/">{t.home}</Link>
        </main>
        <Footer />
      </>
    );
  }

  const inCart = cart.some((c) => c.courseId === course.courseId);

  return (
    <>
      <Header />
      <main className="course-detail-main">
        <Link to={`/category/${'cat'}`} className="back-link" style={{ display: 'none' }}>{t.back}</Link>

        {/* 課程頁頭：左圖右資訊 */}
        <section className="course-detail-hero">
          <div className="course-detail-cover">
            <img src={course.imageUrl} alt={course.title} />
          </div>
          <div className="course-detail-info">
            <h1>{lang === 'zh' ? course.title : course.titleEn}</h1>
            <div className="course-meta-line">
              <span className="meta-rating">⭐ {course.rating} ({course.reviewCount} {t.reviews})</span>
              <span>{t.students}：{course.studentCount.toLocaleString()}</span>
            </div>
            <div className="course-meta-line">
              <span>{t.duration}：{lang === 'zh' ? course.duration : course.durationEn}</span>
              <span>｜ {t.level}：{lang === 'zh' ? course.level : course.levelEn}</span>
            </div>
            <div className="course-price-block">
              <span className="price-note">{t.priceNote}</span>
              <div className="price-row">
                <span className="price-now price-lg">US${course.price}</span>
                <span className="price-original">US${course.originalPrice}</span>
              </div>
              <span className="points-reward">
                🏆 {t.points}：+{course.pointsReward} {t.earnPoints}
              </span>
            </div>
            <div className="course-cta-row">
              {inCart ? (
                <button className="btn btn-disabled" disabled>{t.inCart}</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => { addToCart(course); alert(t.added); }}>
                  {t.addCart}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 影片預覽區（5–10 秒介紹短片，可後續填入 videoUrl） */}
        <section className="course-video-section">
          <h2>{t.videoTitle}</h2>
          {course.videoUrl ? (
            <div className="video-frame">
              <video src={course.videoUrl} controls preload="metadata" width="100%" />
            </div>
          ) : (
            <div className="video-placeholder">
              <span className="video-play-icon">▶</span>
              <p>{t.videoPlaceholder}</p>
              <small>{t.videoSoon}</small>
            </div>
          )}
        </section>

        {/* 課程簡介 */}
        <section className="course-content-section">
          <article className="course-overview">
            <h2>{t.overview}</h2>
            <p>{lang === 'zh' ? course.description : course.descriptionEn}</p>
          </article>
        </section>

        {/* 你將學到 */}
        <section className="course-content-section">
          <h2>{t.whatLearn}</h2>
          <ul className="check-list">
            {(lang === 'zh' ? course.whatYouLearn : course.whatYouLearn).map((item, i) => (
              <li key={i}>✔ {item}</li>
            ))}
          </ul>
        </section>

        {/* 課程大綱 */}
        <section className="course-content-section">
          <h2>{t.outlineTitle}</h2>
          <ol className="outline-list">
            {(lang === 'zh' ? course.outline : course.outline).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </section>

        {/* 適合對象 */}
        <section className="course-content-section">
          <h2>{t.audienceTitle}</h2>
          <p>{course.audience}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CourseDetailPage;
