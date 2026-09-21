import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userStorage, cartStorage } from '../utils/storage';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('zh'); // 'zh' | 'en'
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // 初始化：讀取本地使用者與購物車
  useEffect(() => {
    setCurrentUser(userStorage.getCurrentUser());
    setCart(cartStorage.getCart());
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  // 在切換語言時同步到全域（供 Header 等呼叫）
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

  // 購買課程：寫入積分（模擬）
  const purchaseCourse = useCallback((course, callback) => {
    if (!currentUser) {
      if (callback) callback({ ok: false, message: 'NOT_LOGGED_IN' });
      return;
    }
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
    purchaseCourse,
    cartOpen,
    setCartOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
