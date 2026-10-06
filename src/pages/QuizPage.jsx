import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

const createQuiz = (courses, selectedCourseIds) => {
  const selectedCourses = selectedCourseIds.length
    ? courses.filter((course) => selectedCourseIds.includes(course.courseId))
    : courses;
  const coursePools = shuffle(selectedCourses.map((course) =>
    shuffle(course.questions.map((question, questionIndex) => ({
      ...question,
      id: `${course.courseId}-${questionIndex}`,
      options: shuffle(question.o.map((zh, optionIndex) => ({
        zh,
        en: question.oe?.[optionIndex] ?? zh,
        isCorrect: optionIndex === 0,
      }))),
    })))
  ));

  if (selectedCourseIds.length < 2) {
    return shuffle(coursePools.flat()).slice(0, 10);
  }

  const quiz = [];
  while (quiz.length < 10 && coursePools.some((pool) => pool.length > 0)) {
    coursePools.forEach((pool) => {
      if (quiz.length < 10 && pool.length > 0) quiz.push(pool.pop());
    });
  }
  return shuffle(quiz);
};

const QuizPage = () => {
  const { lang, awardPoints } = useApp();
  const [questionCourses, setQuestionCourses] = useState([]);
  const [courseCatalog, setCourseCatalog] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadJson = (fileName) => fetch(`${import.meta.env.BASE_URL}data/${fileName}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        return response.json();
      });

    Promise.all([loadJson('qna.json'), loadJson('courses.json')])
      .then(([questionData, courseData]) => {
        setQuestionCourses(questionData);
        setCourseCatalog(courseData.categories.flatMap((category) => category.courses));
      })
      .catch((error) => {
        console.error('Failed to load quiz questions', error);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const score = quizQuestions.reduce((total, question) => {
    const selectedOption = question.options[answers[question.id]];
    return total + (selectedOption?.isCorrect ? 1 : 0);
  }, 0);

  const startQuiz = () => {
    setQuizQuestions(createQuiz(questionCourses, selectedCourseIds));
    setAnswers({});
    setSubmitted(false);
    setPointsAwarded(null);
    setHasStartedQuiz(true);
  };

  const toggleCourse = (courseId, checked) => {
    setSelectedCourseIds((selected) => (
      checked
        ? [...selected, courseId]
        : selected.filter((selectedId) => selectedId !== courseId)
    ));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitted) return;
    setPointsAwarded(score >= 5 && awardPoints(10));
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="qna-page">
        <section className="page-hero quiz-page-hero">
          <h1>{lang === 'zh' ? '測驗' : 'Quiz'}</h1>
        </section>
        {isLoading ? (
          <p className="content-section" role="status">
            {lang === 'zh' ? '正在載入題目…' : 'Loading questions…'}
          </p>
        ) : loadError ? (
          <p className="content-section" role="alert">
            {lang === 'zh' ? '題目載入失敗，請稍後再試。' : 'Could not load questions. Please try again later.'}
          </p>
        ) : (
          <>
            <section className="content-section quiz-setup">
              <fieldset className="quiz-course-fieldset">
                <legend>{lang === 'zh' ? '選擇課程' : 'Choose courses'}</legend>
                <p className="quiz-course-hint">
                  {lang === 'zh' ? '不選任何課程，將從全部課程隨機抽題。' : 'Leave all courses unchecked to draw randomly from all courses.'}
                </p>
                <p className="quiz-course-hint">
                  {lang === 'zh' ? '測驗合格即可獲得 10 積分。' : 'Pass the quiz to earn 10 points.'}
                </p>
                <div className="quiz-course-options">
                  {questionCourses.map((course) => {
                    const catalogCourse = courseCatalog.find((item) => item.courseId === course.courseId);
                    const title = lang === 'zh'
                      ? catalogCourse?.title ?? course.courseId
                      : catalogCourse?.titleEn ?? catalogCourse?.title ?? course.courseId;

                    return (
                      <label className="quiz-course-option" key={course.courseId}>
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(course.courseId)}
                          onChange={(event) => toggleCourse(course.courseId, event.target.checked)}
                        />
                        <span>{title}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="qna-actions quiz-start-actions">
                  <button className="btn btn-primary" type="button" onClick={startQuiz}>
                    {lang === 'zh' ? (hasStartedQuiz ? '重新開始測驗' : '開始測驗') : (hasStartedQuiz ? 'Restart Quiz' : 'Start Quiz')}
                  </button>
                </div>
              </fieldset>
            </section>

            {hasStartedQuiz && (
              <form className="content-section qna-quiz" onSubmit={handleSubmit}>
                {quizQuestions.map((question, questionIndex) => (
                  <fieldset className="qna-question" key={question.id} disabled={submitted}>
                    <legend>
                      {questionIndex + 1}. {lang === 'zh' ? question.q : question.qe}
                    </legend>
                    {question.options.map((option, optionIndex) => {
                      const isSelected = answers[question.id] === optionIndex;
                      const resultClass = submitted
                        ? option.isCorrect
                          ? ' is-correct'
                          : isSelected
                            ? ' is-incorrect'
                            : ''
                        : '';

                      return (
                        <label className={`qna-option${resultClass}`} key={optionIndex}>
                          <input
                            type="radio"
                            name={question.id}
                            checked={isSelected}
                            onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })}
                          />
                          <span>{lang === 'zh' ? option.zh : option.en}</span>
                        </label>
                      );
                    })}
                    {submitted && <p className="qna-explanation">{question.a}</p>}
                  </fieldset>
                ))}

                {submitted && (
                  <div className="qna-score" role="status">
                    <p>{lang === 'zh' ? `你的分數：${score} / ${quizQuestions.length}` : `Your score: ${score} / ${quizQuestions.length}`}</p>
                    <p>
                      {score < 5
                        ? (lang === 'zh' ? '未達合格分數，未獲得積分。' : 'You did not pass, so no points were earned.')
                        : pointsAwarded
                          ? (lang === 'zh' ? '合格！獲得積分：10' : 'Passed! Points earned: 10')
                          : (lang === 'zh' ? '合格！登入後才能獲得積分。' : 'Passed! Log in to receive the 10 points.')}
                    </p>
                  </div>
                )}

                <div className="qna-actions quiz-restart-actions">
                  {submitted ? (
                    <button className="btn btn-primary" type="button" onClick={startQuiz}>
                      {lang === 'zh' ? '再測一次' : 'Try Again'}
                    </button>
                  ) : (
                    <button className="btn btn-primary" type="submit">
                      {lang === 'zh' ? '提交答案' : 'Submit Answers'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default QuizPage;