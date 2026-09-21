// 本地儲存工具：處理會員、登入、積分、購物車
// 由於 GitHub Pages 沒有後端伺服器，無法把資料寫回 .json 檔案，
// 故使用瀏覽器 localStorage 模擬資料庫持久化（每位訪客各有一份，清除瀏覽資料會遺失）。

const USERS_KEY = 'sijie_users';
const CURRENT_USER_KEY = 'sijie_current_user';
const CART_KEY = 'sijie_cart';

const safeParse = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const userStorage = {
  getUsers() {
    return safeParse(localStorage.getItem(USERS_KEY), []);
  },
  saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  register(username, password, email) {
    const users = userStorage.getUsers();
    if (users.some((u) => u.username === username)) {
      return { ok: false, message: 'USER_EXISTS' };
    }
    users.push({
      username,
      password,
      email,
      points: 0,
      createdAt: new Date().toISOString(),
    });
    userStorage.saveUsers(users);
    return { ok: true };
  },
  login(username, password) {
    const users = userStorage.getUsers();
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return { ok: false, message: 'BAD_CREDENTIALS' };
    // 不把密碼放進目前登入狀態以外的可見欄位，僅存必要資料
    const session = {
      username: user.username,
      email: user.email,
      points: user.points,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
    return { ok: true };
  },
  getCurrentUser() {
    return safeParse(localStorage.getItem(CURRENT_USER_KEY), null);
  },
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  addPoints(amount) {
    const current = userStorage.getCurrentUser();
    if (!current) return;
    const users = userStorage.getUsers();
    const target = users.find((u) => u.username === current.username);
    if (target) {
      target.points += amount;
      userStorage.saveUsers(users);
    }
    // 同步更新目前登入狀態
    const session = userStorage.getCurrentUser();
    if (session) {
      session.points = (session.points || 0) + amount;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
    }
  },
};

export const cartStorage = {
  getCart() {
    return safeParse(localStorage.getItem(CART_KEY), []);
  },
  saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },
  addToCart(course) {
    const cart = cartStorage.getCart();
    if (!cart.some((c) => c.courseId === course.courseId)) {
      cart.push(course);
      cartStorage.saveCart(cart);
    }
  },
  removeFromCart(courseId) {
    const cart = cartStorage.getCart().filter((c) => c.courseId !== courseId);
    cartStorage.saveCart(cart);
  },
  clearCart() {
    localStorage.removeItem(CART_KEY);
  },
};
