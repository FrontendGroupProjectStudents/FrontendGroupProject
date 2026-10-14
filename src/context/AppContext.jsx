import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userStorage, cartStorage, courseStorage } from '../utils/storage';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('zh'); // 'zh' | 'en'
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ==========【搜尋關鍵字】==========
  // Header 搜尋框寫入，HomePage / CourseSearchPage 讀取
  const [searchQuery, setSearchQuery] = useState('');

  // ==========【我的課程狀態】==========
  const [myCoursesOpen, setMyCoursesOpen] = useState(false);
  // 只讀取目前登入會員的購買紀錄。
  const [purchasedCourses, setPurchasedCourses] = useState(() => {
    const user = userStorage.getCurrentUser();
    return courseStorage.getPurchasedCourses(user?.username);
  });

  // 初始化：購買紀錄必須與目前登入會員一致。
  useEffect(() => {
    const user = userStorage.getCurrentUser();
    setCurrentUser(user);
    setCart(cartStorage.getCart(user?.username));
    setPurchasedCourses(courseStorage.getPurchasedCourses(user?.username));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const setLanguage = useCallback((next) => {
    setLang(next);
  }, []);

  const handleLogin = useCallback((username, password) => {
    const res = userStorage.login(username, password);
    if (res.ok) {
      const user = userStorage.getCurrentUser();
      const ownedCourses = courseStorage.getPurchasedCourses(user?.username);
      cartStorage.transferGuestCartToUser(user?.username, ownedCourses);
      setCurrentUser(user);
      setPurchasedCourses(ownedCourses);
      setCart(cartStorage.getCart(user?.username));
      setCartOpen(false);
    }
    return res;
  }, []);

  const handleRegister = useCallback((username, password, email) => {
    return userStorage.register(username, password, email);
  }, []);

  const handleLogout = useCallback(() => {
    userStorage.logout();
    setCurrentUser(null);
    setPurchasedCourses([]);
    setCart(cartStorage.getCart(null));
    setCartOpen(false);
  }, []);

  const addToCart = useCallback((course) => {
    cartStorage.addToCart(course);
    setCart(cartStorage.getCart());
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((courseId) => {
    cartStorage.removeFromCart(courseId);
    setCart(cartStorage.getCart());
  }, []);

  const clearCart = useCallback(() => {
    cartStorage.clearCart();
    setCart([]);
  }, []);

  const awardPoints = useCallback((amount) => {
    if (!currentUser || amount <= 0) return false;
    userStorage.addPoints(amount);
    setCurrentUser(userStorage.getCurrentUser());
    return true;
  }, [currentUser]);

  // ==========【購買課程】==========
  const purchaseCourse = useCallback((course, callback) => {
    if (!currentUser) {
      if (callback) callback({ ok: false, message: 'NOT_LOGGED_IN' });
      return;
    }
    // 先同步儲存購買紀錄，避免頁面重新載入時丟失。
    const savedCourses = courseStorage.getPurchasedCourses(currentUser.username);
    if (savedCourses.some((item) => item.courseId === course.courseId)) {
      if (callback) callback({ ok: false, message: 'ALREADY_PURCHASED' });
      return;
    }
    const newList = [...savedCourses, course];
    courseStorage.savePurchasedCourses(currentUser.username, newList);
    setPurchasedCourses(newList);

    // 只有首次購買先增加積分
    userStorage.addPoints(course.pointsReward || 0);
    setCurrentUser(userStorage.getCurrentUser());

    if (callback) callback({ ok: true });
  }, [currentUser]);

  const value = {
    lang,
    toggleLang,
    setLanguage,
    currentUser,
    handleLogin,
    handleRegister,
    handleLogout,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    awardPoints,
    purchaseCourse,
    cartOpen,
    setCartOpen,
    myCoursesOpen,
    setMyCoursesOpen,
    purchasedCourses,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
