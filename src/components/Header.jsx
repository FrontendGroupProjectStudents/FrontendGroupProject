import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LanguageSwitch from './LanguageSwitch';
import CartWidget from './CartWidget';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import MyCoursesWidget from './MyCoursesWidget';

const Header = () => {
  const { lang, toggleLang, currentUser, handleLogout, setMyCoursesOpen, searchQuery, setSearchQuery } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  // ========== 下拉選單狀態 ==========
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  // ========== 搜尋框 ==========
  // 關鍵字存在 AppContext（searchQuery），不需要放在網址
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 在首頁以外的頁面輸入 → 跳回首頁顯示搜尋結果
    // （state.focusSearch 讓新載入的 Header 把焦點放回搜尋框）
    if (pathname !== '/') {
      navigate('/', { state: { focusSearch: true } });
    }
  };

  // 從其他頁面第一次輸入而跳到首頁時，Header 會重新載入，
  // 這裡把焦點放回搜尋框、游標移到最後，讓使用者可以繼續打字
  useEffect(() => {
    if (state?.focusSearch && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 點擊 Logo / 首頁：清空搜尋並回到首頁內容
  // （已在首頁時網址不變，不會觸發換頁，所以要手動清空 searchQuery）
  const handleGoHome = () => {
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  // 離開首頁（例如進入課程詳情、關於我們）時清空搜尋，避免舊關鍵字殘留
  useEffect(() => {
    if (pathname !== '/') setSearchQuery('');
  }, [pathname, setSearchQuery]);

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
      qna: '測驗',  // Benson
      myCourses: '我的課程',
      login: '登入',
      register: '註冊',
      logout: '登出',
      points: '積分',
      welcome: '歡迎',
      searchPlaceholder: '搜尋課程…',
    },
    en: {
      site: 'Sijie Online IT Academy',
      home: 'Home',
      courses: 'Courses',
      qna: 'Quiz',  // Benson
      myCourses: 'My Courses',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      points: 'Points',
      welcome: 'Welcome',
      searchPlaceholder: 'Search courses…',
    },
  }[lang];

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" onClick={handleGoHome}>
            <span className="logo-mark">思捷</span>
          </Link>
          <nav className="main-nav" aria-label="主導航">
            <Link to="/" className="nav-link" onClick={handleGoHome}>{t.home}</Link>

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

          {/* ========== 即時搜尋框（課程與語言切換之間） ========== */}
          <div className="header-search" role="search">
            <svg
              className="header-search-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              className="header-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
          </div>

          <div className="header-actions">
            <LanguageSwitch lang={lang} onToggle={toggleLang} />
            <Link to="/qna" className="btn btn-ghost btn-sm">
            {/* Benson */}
              💡 {t.qna}
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
