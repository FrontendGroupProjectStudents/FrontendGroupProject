import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const AboutPage = () => {
  const { lang } = useApp();

  const t = {
    zh: {
      title: '關於我們',
      p1: '思捷網上IT專業培訓是一所專注於資訊科技與數位技能培訓的線上學習平台，致力為職場人士與學生提供高品質、可負擔且實用的專業課程。',
      p2: '我們的課程涵蓋生成式AI、IT認證、數據科學、ChatGPT商業應用、提示語工程與微軟Excel等熱門領域，全部由具實戰經驗的導師設計與教授。',
      p3: '我們相信學習不應受到時間與地點的限制，因此所有課程均支援自主進度學習，讓每位學員都能按照自己的節奏掌握技能。',
      values: [
        { icon: '🎯', title: '實用導向', desc: '內容緊貼職場需求，學完即用。' },
        { icon: '🧑‍🏫', title: '專業導師', desc: '導師均具豐富業界經驗。' },
        { icon: '🌍', title: '自主學習', desc: '24/7 隨時隨地學習。' },
      ],
    },
    en: {
      title: 'About Us',
      p1: 'Sijie Online IT Academy is an online learning platform focused on IT and digital skills, providing quality, affordable and practical courses for professionals and students.',
      p2: 'Our courses cover Generative AI, IT Certification, Data Science, ChatGPT for Business, Prompt Engineering and Microsoft Excel, all taught by experienced practitioners.',
      p3: 'We believe learning should not be limited by time or location, so all courses support self-paced learning.',
      values: [
        { icon: '🎯', title: 'Practical', desc: 'Job-ready content you can apply immediately.' },
        { icon: '🧑‍🏫', title: 'Expert Instructors', desc: 'Instructors with real industry experience.' },
        { icon: '🌍', title: 'Self-Paced', desc: 'Learn anywhere, anytime.' },
      ],
    },
  }[lang];

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <h1>{t.title}</h1>
        </section>
        <section className="content-section page-text">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
        </section>
        <section className="content-section">
          <div className="features-grid">
            {t.values.map((v) => (
              <article className="feature-card" key={v.title}>
                <span className="feature-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
