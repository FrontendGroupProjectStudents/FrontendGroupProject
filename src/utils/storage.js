// 本地儲存工具：處理會員、登入、積分、購物車、我的課程
// 由於 GitHub Pages 沒有後端伺服器，無法把資料寫回 .json 檔案，
// 故使用瀏覽器 localStorage 模擬資料庫持久化（每位訪客各有一份，清除瀏覽資料會遺失）。

const USERS_KEY = 'sijie_users';
const CURRENT_USER_KEY = 'sijie_current_user';
// 舊共用 cart key 保留，但不再自動歸屬任何會員。
const CART_KEY = 'sijie_cart';
const CART_GUEST_KEY = `${CART_KEY}_guest`;
const CART_USER_PREFIX = `${CART_KEY}_user_`;
const getCartKey = (username) => username
  ? `${CART_USER_PREFIX}${encodeURIComponent(username)}`
  : CART_GUEST_KEY;
// 舊版共用購買紀錄保留不動，避免把未能確認擁有者的資料指派給錯誤會員。
const PURCHASED_COURSES_KEY = 'sijie_purchased_courses';
const PURCHASED_COURSES_USER_PREFIX = `${PURCHASED_COURSES_KEY}_user_`;

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

// 會員各自擁有購物車；未登入訪客使用獨立 Guest 購物車。
// username 未傳入時以目前登入使用者為準。
export const cartStorage = {
  getCart(username = userStorage.getCurrentUser()?.username) {
    const cart = safeParse(localStorage.getItem(getCartKey(username)), []);
    return Array.isArray(cart) ? cart : [];
  },
  saveCart(cart, username = userStorage.getCurrentUser()?.username) {
    localStorage.setItem(getCartKey(username), JSON.stringify(cart));
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
  clearCart(username = userStorage.getCurrentUser()?.username) {
    localStorage.removeItem(getCartKey(username));
  },
  // 登入時延續訪客加入購物車的流程；不轉移已經購買或重複課程。
  transferGuestCartToUser(username, purchasedCourses = []) {
    if (!username) return;
    const guestCart = cartStorage.getCart(null);
    if (guestCart.length === 0) return;
    const memberCart = cartStorage.getCart(username);
    const existingIds = new Set(memberCart.map((c) => c.courseId));
    const purchasedIds = new Set(purchasedCourses.map((c) => c.courseId));
    for (const course of guestCart) {
      if (!existingIds.has(course.courseId) && !purchasedIds.has(course.courseId)) {
        memberCart.push(course);
        existingIds.add(course.courseId);
      }
    }
    cartStorage.saveCart(memberCart, username);
    cartStorage.clearCart(null);
  },
};

// 每名會員各自儲存購買紀錄；不自動遷移無法核實擁有者的舊共用資料。
export const courseStorage = {
  getPurchasedCourses(username) {
    if (!username) return [];
    const key = `${PURCHASED_COURSES_USER_PREFIX}${encodeURIComponent(username)}`;
    const courses = safeParse(localStorage.getItem(key), []);
    return Array.isArray(courses) ? courses : [];
  },
  savePurchasedCourses(username, list) {
    if (!username) return;
    const key = `${PURCHASED_COURSES_USER_PREFIX}${encodeURIComponent(username)}`;
    localStorage.setItem(key, JSON.stringify(list));
  },
};
