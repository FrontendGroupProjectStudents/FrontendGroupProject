import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

// 購物車圖示按鈕 + 側邊購物車抽屜
const CartWidget = () => {
  const { lang, cart, cartOpen, setCartOpen, removeFromCart, currentUser, purchaseCourse } = useApp();

  const t = {
    zh: {
      cart: '購物車',
      empty: '購物車目前是空的',
      checkout: '結帳並賺取積分',
      remove: '移除',
      loginPrompt: '請先登入再結帳',
      login: '登入',
      total: '合計',
      purchased: '已完成結帳，獲得 {pts} 積分！',
      continue: '繼續瀏覽',
    },
    en: {
      cart: 'Cart',
      empty: 'Your cart is empty',
      checkout: 'Checkout & Earn Points',
      remove: 'Remove',
      loginPrompt: 'Please log in to checkout',
      login: 'Log in',
      total: 'Total',
      purchased: 'Checkout complete! You earned {pts} points.',
      continue: 'Continue browsing',
    },
  }[lang];

  const total = cart.reduce((sum, c) => sum + (Number(c.price) || 0), 0);

  const handleCheckout = () => {
    if (!currentUser) {
      alert(t.loginPrompt);
      setCartOpen(false);
      return;
    }
    const pointsEarned = cart.reduce((sum, c) => sum + (c.pointsReward || 0), 0);
    // 逐筆課程結帳並累積積分
    cart.forEach((c) => purchaseCourse(c));
    alert(t.purchased.replace('{pts}', pointsEarned));
    // 清空購物車（模擬購買完成）
    localStorage.removeItem('sijie_cart');
    window.location.reload();
  };

  return (
    <>
      <button className="btn btn-ghost btn-sm cart-trigger" onClick={() => setCartOpen(!cartOpen)}>
        🛒 {t.cart}
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </button>

      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="購物車">
            <div className="cart-drawer-head">
              <h3>{t.cart}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <p className="cart-empty">{t.empty}</p>
              ) : (
                <ul className="cart-list">
                  {cart.map((c) => (
                    <li key={c.courseId} className="cart-item">
                      <Link to={`/course/${c.courseId}`} onClick={() => setCartOpen(false)}>
                        <span className="cart-item-title">{c.title}</span>
                      </Link>
                      <div className="cart-item-bottom">
                        <span className="price-now">US${c.price}</span>
                        <button className="btn btn-ghost btn-xs" onClick={() => removeFromCart(c.courseId)}>
                          {t.remove}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-drawer-foot">
                <div className="cart-total">
                  <span>{t.total}</span>
                  <span className="price-now">US${total.toFixed(2)}</span>
                </div>
                {!currentUser && <p className="cart-login-prompt">{t.loginPrompt}</p>}
                <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                  {t.checkout}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
};

export default CartWidget;
