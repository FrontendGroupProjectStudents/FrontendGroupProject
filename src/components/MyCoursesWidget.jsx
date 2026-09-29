import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const MyCoursesWidget = () => {
  const { lang, myCoursesOpen, setMyCoursesOpen, currentUser, purchasedCourses } = useApp();
  const navigate = useNavigate();

  // 多語言文字（繁體中文）
  const t = {
    zh: {
      title: "我的課程",
      needLogin: "用戶需登入後才能查詢已購買課程內容",
      empty: "您尚未購買任何課程",
      viewCourse: "進入課程",
    },
    en: {
      title: "My Courses",
      needLogin: "Please login to view your purchased courses",
      empty: "You have not purchased any courses",
      viewCourse: "Open Course",
    }
  }[lang];

  // 點擊課程，跳轉詳情並關閉抽屜
  const openCourse = (course) => {
    navigate(`/course/${course.courseId}`);
    setMyCoursesOpen(false);
  };

  if (!myCoursesOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={() => setMyCoursesOpen(false)} />
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label={t.title}>
        <div className="cart-drawer-head">
          <h3>{t.title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setMyCoursesOpen(false)}>✕</button>
        </div>
        <div className="cart-drawer-body">
          {!currentUser ? (
            <p className="cart-empty">{t.needLogin}</p>
          ) : (
            <>
              {purchasedCourses.length === 0 ? (
                <p className="cart-empty">{t.empty}</p>
              ) : (
                <ul className="cart-list">
                  {purchasedCourses.map(course => (
                    <li key={course.courseId} className="cart-item">
                      <div
                        style={{cursor:"pointer"}}
                        onClick={() => openCourse(course)}
                      >
                        <span className="cart-item-title">
                          {lang === "zh" ? course.title : course.titleEn}
                        </span>
                        <div className="cart-item-bottom">
                          <span className="meta-text">{t.viewCourse}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default MyCoursesWidget;
