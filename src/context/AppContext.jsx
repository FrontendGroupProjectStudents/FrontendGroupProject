import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userStorage, cartStorage, courseStorage } from '../utils/storage';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('zh'); // 'zh' | 'en'
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ==========【我的課程狀態】==========
  const [myCoursesOpen, setMyCoursesOpen] = useState(false);
  // ✅ 初始值直接呼叫 storage，不再手動 localStorage + safeParse
  const [purchasedCourses, setPurchasedCourses] = useState(() => {
    return courseStorage.getPurchasedCourses();
  });

  // 初始化：讀取本地使用者、購物車、已購課程，風格統一
  useEffect(() => {
    setCurrentUser(userStorage.getCurrentUser());
    setCart(cartStorage.getCart());
    setPurchasedCourses(courseStorage.getPurchasedCourses());
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
      setCurrentUser(userStorage.getCurrentUser());
    }
    return res;
  }, []);

  const handleRegister = useCallback((username, password, email) => {
    return userStorage.register(username, password, email);
  }, []);

  const handleLogout = useCallback(() => {
    userStorage.logout();
    setCurrentUser(null);
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
    // 增加積分
    userStorage.addPoints(course.pointsReward || 0);
    setCurrentUser(userStorage.getCurrentUser());

    setPurchasedCourses((prevList) => {
      const exists = prevList.some(item => item.courseId === course.courseId);
      if (exists) return prevList;
      const newList = [...prevList, course];
      courseStorage.savePurchasedCourses(newList);
      return newList;
    });

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
    awardPoints,
    purchaseCourse,
    cartOpen,
    setCartOpen,
    myCoursesOpen,
    setMyCoursesOpen,
    purchasedCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
