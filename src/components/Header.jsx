import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LanguageSwitch from './LanguageSwitch';
import CartWidget from './CartWidget';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import MyCoursesWidget from './MyCoursesWidget';

const Header = () => {
  const { lang, toggleLang, currentUser, handleLogout, setMyCoursesOpen } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ========== 下拉選單狀態 ==========
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  // 讀取courses.json取得分類列表
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/courses.json`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
      })
      .catch(err => console.error("讀取分類失敗", err));
  }, []);

  // 點擊頁面空白區關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCourseDropdownOpen(false);
      }
    };
    if(courseDropdownOpen){
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [courseDropdownOpen]);


  const t = {
    zh: {
      site: '思捷網上IT專業培訓',
      home: '首頁',
      courses: '課程',
      myCourses: '我的課程',
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
      myCourses: 'My Courses',
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

            {/* ========== 課程下拉按鈕區域 ========== */}
            <div className="nav-dropdown-wrap" ref={dropdownRef}>
              <button
                className="nav-link nav-dropdown-btn"
                onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
              >
                {t.courses} ▾
              </button>
              {courseDropdownOpen && (
                <div className="nav-dropdown-menu">
                  {categories.map(cat => (
                    <Link
                      key={cat.catId}
                      to={`/category/${cat.catId}`}
                      className="nav-dropdown-item"
                      onClick={() => setCourseDropdownOpen(false)}
                    >
                      {lang === 'zh' ? cat.catName : cat.catNameEn}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <LanguageSwitch lang={lang} onToggle={toggleLang} />
            <Link to="/qna" className="btn btn-ghost btn-sm">
            {/* Benson */}
              Q&A
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={() => setMyCoursesOpen(true)}>
              📚 {t.myCourses}
            </button>
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
      <MyCoursesWidget />
    </>
  );
};

export default Header;
