import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { lang } = useApp();

  const t = {
    zh: {
      site: '思捷網上IT專業培訓',
      about: '關於我們',
      desc: '提供生成式AI、IT認證、數據科學、ChatGPT商業應用、提示語工程與微軟Excel等優質線上課程，讓你隨時隨地自主學習、提升專業技能。',
      nav: '快速導覽',
      home: '首頁',
      genai: '生成式AI課程',
      itcert: 'IT認證課程',
      datascience: '數據科學',
      info: '網站資訊',
      privacy: '私隱政策',
      contact: '聯絡我們',
      rights: '版權所有',
    },
    en: {
      site: 'Sijie Online IT Academy',
      about: 'About Us',
      desc: 'Quality online courses in Generative AI, IT Certification, Data Science, ChatGPT for Business, Prompt Engineering and Microsoft Excel.',
      nav: 'Quick Links',
      home: 'Home',
      genai: 'Generative AI',
      itcert: 'IT Certification',
      datascience: 'Data Science',
      info: 'Information',
      privacy: 'Privacy Policy',
      contact: 'Contact Us',
      rights: 'All rights reserved',
    },
  }[lang];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col footer-about">
          <h4>{t.site}</h4>
          <p>{t.desc}</p>
        </div>
        <div className="footer-col">
          <h4>{t.nav}</h4>
          <ul>
            <li><Link to="/">{t.home}</Link></li>
            <li><Link to="/category/gen-ai">{t.genai}</Link></li>
            <li><Link to="/category/it-cert">{t.itcert}</Link></li>
            <li><Link to="/category/data-science">{t.datascience}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t.info}</h4>
          <ul>
            <li><Link to="/about">{t.about}</Link></li>
            <li><Link to="/privacy">{t.privacy}</Link></li>
            <li><Link to="/contact">{t.contact}</Link></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} {t.site} ｜ {t.rights}
      </div>
    </footer>
  );
};

export default Footer;
