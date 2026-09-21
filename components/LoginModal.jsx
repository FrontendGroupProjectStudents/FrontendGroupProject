import { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginModal = ({ closeModal }) => {
  const { lang, handleLogin } = useApp();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const t = {
    zh: {
      title: '帳號登入',
      username: '使用者名稱',
      password: '密碼',
      cancel: '取消',
      submit: '登入',
      success: '登入成功！',
      badCreds: '使用者名稱或密碼錯誤',
      fillAll: '請填寫所有欄位',
    },
    en: {
      title: 'Sign In',
      username: 'Username',
      password: 'Password',
      cancel: 'Cancel',
      submit: 'Log In',
      success: 'Login successful!',
      badCreds: 'Incorrect username or password',
      fillAll: 'Please fill in all fields',
    },
  }[lang];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return setError(t.fillAll);
    const res = handleLogin(form.username, form.password);
    if (!res.ok) return setError(t.badCreds);
    alert(t.success);
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{t.title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="login-username">{t.username}</label>
            <input id="login-username" type="text" name="username" value={form.username} onChange={handleChange} />
          </div>
          <div className="form-item">
            <label htmlFor="login-password">{t.password}</label>
            <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-btn-group">
            <button type="button" className="btn btn-outline" onClick={closeModal}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary">{t.submit}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
