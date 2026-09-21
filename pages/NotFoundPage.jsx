import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const NotFoundPage = () => {
  const { lang } = useApp();
  const t = {
    zh: { title: '404', msg: '頁面不存在', home: '返回首頁' },
    en: { title: '404', msg: 'Page not found', home: 'Back to Home' },
  }[lang];

  return (
    <>
      <Header />
      <main className="page-message">
        <h1 className="big-404">{t.title}</h1>
        <p>{t.msg}</p>
        <Link to="/" className="btn btn-primary">{t.home}</Link>
      </main>
      <Footer />
    </>
  );
};

export default NotFoundPage;
