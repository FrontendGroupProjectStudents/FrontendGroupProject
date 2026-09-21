import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// 首頁的 6 大分類卡片
const CategoryCard = ({ category }) => {
  const { lang } = useApp();

  return (
    <Link to={`/category/${category.catId}`} className="category-card">
      <div className="category-card-img">
        <img src={category.catImage} alt={category.catName} loading="lazy" />
      </div>
      <div className="category-card-body">
        <h3>{lang === 'zh' ? category.catName : category.catNameEn}</h3>
        <p>{lang === 'zh' ? category.catDesc : category.catDescEn}</p>
        <span className="link-more">
          {lang === 'zh' ? '查看課程 →' : 'View courses →'}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
