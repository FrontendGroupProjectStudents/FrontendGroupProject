import { useState } from 'react';
import { useApp } from '../context/AppContext';

const RegisterModal = ({ closeModal }) => {
  const { lang, handleRegister, handleLogin } = useApp();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const t = {
    zh: {
      title: '註冊帳號',
      username: '使用者名稱',
      email: '電郵地址',
      password: '密碼',
      confirm: '確認密碼',
      cancel: '取消',
      submit: '註冊',
      success: '註冊成功，已自動登入！',
      userExists: '此使用者名稱已被使用',
      mismatch: '兩次輸入的密碼不一致',
      fillAll: '請填寫所有欄位',
      note: '註冊資料會儲存在此瀏覽器，僅供本站模擬使用。',
    },
    en: {
      title: 'Create Account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirm: 'Confirm Password',
      cancel: 'Cancel',
      submit: 'Register',
      success: 'Registration successful, you are now logged in!',
      userExists: 'This username is already taken',
      mismatch: 'Passwords do not match',
      fillAll: 'Please fill in all fields',
      note: 'Account data is stored in this browser for demo purposes.',
    },
  }[lang];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return setError(t.fillAll);
    if (form.password !== form.confirm) return setError(t.mismatch);
    const res = handleRegister(form.username, form.password, form.email);
    if (!res.ok) return setError(t.userExists);
    handleLogin(form.username, form.password);
    alert(t.success);
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{t.title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="reg-username">{t.username}</label>
            <input id="reg-username" type="text" name="username" value={form.username} onChange={handleChange} />
          </div>
          <div className="form-item">
            <label htmlFor="reg-email">{t.email}</label>
            <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-item">
            <label htmlFor="reg-password">{t.password}</label>
            <input id="reg-password" type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-item">
            <label htmlFor="reg-confirm">{t.confirm}</label>
            <input id="reg-confirm" type="password" name="confirm" value={form.confirm} onChange={handleChange} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <p className="form-note">{t.note}</p>
          <div className="modal-btn-group">
            <button type="button" className="btn btn-outline" onClick={closeModal}>{t.cancel}</button>
            <button type="submit" className="btn btn-primary">{t.submit}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
