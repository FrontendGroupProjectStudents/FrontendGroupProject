import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const ContactPage = () => {
  const { lang } = useApp();
  const [sent, setSent] = useState(false);

  const t = {
    zh: {
      title: '聯絡我們',
      name: '姓名',
      email: '電郵地址',
      message: '訊息內容',
      submit: '送出訊息',
      sent: '已收到你的訊息，我們會盡快回覆！',
      placeholders: { name: '你的姓名', email: 'you@example.com', message: '請輸入你的問題或意見…' },
    },
    en: {
      title: 'Contact Us',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send Message',
      sent: 'Message received, we will get back to you soon!',
      placeholders: { name: 'Your name', email: 'you@example.com', message: 'Type your question or feedback…' },
    },
  }[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <h1>{t.title}</h1>
        </section>
        <section className="content-section">
          <div className="contact-form-wrap">
            {sent ? (
              <p className="success-message">{t.sent}</p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-item">
                  <label htmlFor="c-name">{t.name}</label>
                  <input id="c-name" type="text" required placeholder={t.placeholders.name} />
                </div>
                <div className="form-item">
                  <label htmlFor="c-email">{t.email}</label>
                  <input id="c-email" type="email" required placeholder={t.placeholders.email} />
                </div>
                <div className="form-item">
                  <label htmlFor="c-message">{t.message}</label>
                  <textarea id="c-message" rows="5" required placeholder={t.placeholders.message} />
                </div>
                <button type="submit" className="btn btn-primary">{t.submit}</button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
