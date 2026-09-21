import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LanguageSwitch = () => {
  const { lang, toggleLang } = useApp();
  return (
    <button className="btn btn-ghost btn-sm btn-lang" onClick={toggleLang} aria-label="切換語言">
      {lang === 'zh' ? 'English' : '中文'}
    </button>
  );
};

export default LanguageSwitch;
