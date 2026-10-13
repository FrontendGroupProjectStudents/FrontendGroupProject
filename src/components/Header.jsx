import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  // ========== 下拉選單狀態 ==========
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  // ========== 搜尋框狀態 ==========
  // 搜尋關鍵字放在網址 ?q=xxx，首頁（/）與 /filter 都會讀取
  const isSearchRoute = pathname === '/' || pathname === '/filter';
  const urlKeyword = isSearchRoute ? searchParams.get('q') || '' : '';
  const [keyword, setKeyword] = useState(urlKeyword);
  const inputRef = useRef(null);
  const composingRef = useRef(false); // 中文輸入法組字中不觸發搜尋

  // 網址的關鍵字改變（例如跳去其他頁）時，同步搜尋框內容
  useEffect(() => {
    if (!composingRef.current) setKeyword(urlKeyword);
  }, [urlKeyword]);

  // 從其他頁面第一次輸入而跳轉到首頁時，Header 會重新載入，
  // 這裡把焦點放回搜尋框，讓使用者可以繼續打字
  useEffect(() => {
    if (urlKeyword && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySearch = (value) => {
    if (value.trim()) {
      // 有內容 → 帶著關鍵字回到首頁（首頁會顯示搜尋結果）
      navigate(
        { pathname: '/', search: `?q=${encodeURIComponent(value)}` },
        { replace: pathname === '/' }
      );
    } else if (isSearchRoute) {
      // 沒有內容 → 顯示原本的首頁
      navigate('/', { replace: true });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (composingRef.current) return;
    applySearch(value);
  };

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
          <Link to="/" className="logo">
            <span className="logo-mark">思捷</span>
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
              value={keyword}
              onChange={handleSearchChange}
              onCompositionStart={() => { composingRef.current = true; }}
              onCompositionEnd={(e) => {
                composingRef.current = false;
                applySearch(e.target.value);
              }}
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
