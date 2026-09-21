import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LanguageSwitch from './LanguageSwitch';
import CartWidget from './CartWidget';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = () => {
  const { lang, toggleLang, currentUser, handleLogout } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const t = {
    zh: {
      site: '思捷網上IT專業培訓',
      home: '首頁',
      courses: '課程',
      login: '登入',
      register: '註冊',
      logout: '登出',
      points: '積分',
      welcome: '歡迎',
    },
    en: {
      site: 'Sijie Online IT Academy',
      home: 'Home',
      courses: 'Courses',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      points: 'Points',
      welcome: 'Welcome',
    },
  }[lang];

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">思捷</span>
            <span className="logo-text">{t.site}</span>
          </Link>

          <nav className="main-nav" aria-label="主導航">
            <Link to="/" className="nav-link">{t.home}</Link>
            <Link to="/#courses" className="nav-link">{t.courses}</Link>
          </nav>

          <div className="header-actions">
            <LanguageSwitch lang={lang} onToggle={toggleLang} />
            <CartWidget />
            {currentUser ? (
              <div className="user-chip">
                <span className="user-name">
                  {t.welcome}，{currentUser.username}
                </span>
                <span className="user-points">
                  {t.points}：{currentUser.points ?? 0}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  {t.logout}
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-outline" onClick={() => setShowLogin(true)}>
                  {t.login}
                </button>
                <button className="btn btn-primary" onClick={() => setShowRegister(true)}>
                  {t.register}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal closeModal={() => setShowRegister(false)} />}
    </>
  );
};

export default Header;
