import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Layer2 分類頁內的課程卡片（點擊進入 Layer3 詳情頁）
const CourseCard = ({ course }) => {
  const { lang } = useApp();

  return (
    <Link to={`/course/${course.courseId}`} className="course-card">
      <div className="course-card-img">
        <img src={course.imageUrl} alt={course.title} loading="lazy" />
        {course.popularTag && (
          <span className="tag-popular">{lang === 'zh' ? course.popularTag : course.popularTagEn}</span>
        )}
      </div>
      <div className="course-card-body">
        <h3>{lang === 'zh' ? course.title : course.titleEn}</h3>
        <div className="course-meta">
          <span className="meta-rating">
            ⭐ {course.rating}
            <span className="meta-count">({course.reviewCount})</span>
          </span>
          <span className="meta-level">{lang === 'zh' ? course.level : course.levelEn}</span>
        </div>
        <div className="price-row">
          <span className="price-now">US${course.price}</span>
          <span className="price-original">US${course.originalPrice}</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
