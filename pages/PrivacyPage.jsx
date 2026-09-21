import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const PrivacyPage = () => {
  const { lang } = useApp();

  const t = {
    zh: {
      title: '私隱政策',
      intro: '本網站重視你的私隱。以下說明我們如何處理資料。',
      items: [
        { h: '資料儲存', p: '會員註冊資料與積分僅儲存於你的瀏覽器（localStorage）內，用於示範用途；我們不會收集或上傳任何個人資料至伺服器。' },
        { h: 'Cookie', p: '本網站不會使用第三方追蹤 Cookie。' },
        { h: '第三方連結', p: '網站可能包含外部連結，我們對外部網站的私隱做法概不負責。' },
        { h: '聯絡', p: '如有任何私隱相關疑問，歡迎透過「聯絡我們」頁面與我們聯繫。' },
      ],
    },
    en: {
      title: 'Privacy Policy',
      intro: 'We value your privacy. Here is how we handle your data.',
      items: [
        { h: 'Data Storage', p: 'Account data and points are stored only in your browser (localStorage) for demo purposes. We do not collect or upload personal data to any server.' },
        { h: 'Cookies', p: 'This site does not use third-party tracking cookies.' },
        { h: 'Third-party Links', p: 'The site may contain external links; we are not responsible for their privacy practices.' },
        { h: 'Contact', p: 'For any privacy questions, please reach out via the Contact page.' },
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
          <p>{t.intro}</p>
          {t.items.map((item) => (
            <article key={item.h} className="privacy-item">
              <h3>{item.h}</h3>
              <p>{item.p}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPage;
