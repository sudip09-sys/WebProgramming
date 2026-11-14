import React, { useState } from 'react';

export const questions = [
  {
    id: 'react',
    question: 'What is React?',
    options: [
      'A programming language',
      'A JavaScript library for building user interfaces',
      'A web server',
      'A CSS framework',
    ],
    correct: 1,
    explanation:
      'React is a JavaScript library. It helps build interfaces from reusable components.',
  },
  {
    id: 'component',
    question: 'Which component definition is valid?',
    options: [
      'function myCard() { return <div>Hi</div>; }',
      'function MyCard() { return <div>Hi</div>; }',
      'function MyCard() { return <div>A</div><p>B</p>; }',
      'function MyCard { return <div>Hi</div>; }',
    ],
    correct: 1,
    explanation:
      'MyCard starts with a capital letter, has valid function syntax, and returns one root element.',
  },
  {
    id: 'props',
    question: 'How can Card read count from <Card count={42} />?',
    options: [
      'this.count',
      'Destructure { count } in its parameter, or use props.count',
      'Card.count',
      'useState(count)',
    ],
    correct: 1,
    explanation:
      'The parent passes props to the child. A function component receives them as an object, which can be destructured.',
  },
];

export default function Review() {
  const [answers, setAnswers] = useState({});
  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  return (
    <main className="page">
      <header className="site-header">
        <a className="brand" href="../#coursework">
          SUDIP<span> / LAB</span>
        </a>
        <nav aria-label="Course navigation">
          <a href="./">Monday</a>
          <a href="./lab.html">StudentCard</a>
          <a href="../Week11%20friday/tasks.html">Friday</a>
        </nav>
      </header>
      <section className="intro">
        <p className="eyebrow">WEEK 11 MONDAY / REACT FOUNDATIONS</p>
        <h1>
          THINK IN
          <br />
          <span className="outline">COMPONENTS</span>
          <span className="title-dot">.</span>
        </h1>
        <p className="intro-copy">Three concept checks with immediate feedback.</p>
      </section>
      <p className="quiz-score" role="status" aria-live="polite">
        Practice score: {score} / {questions.length} · {Object.keys(answers).length} answered
      </p>
      <section className="quiz-list" aria-label="React concept checks">
        {questions.map((q, index) => (
          <fieldset className="quiz-card" key={q.id}>
            <legend>
              {String(index + 1).padStart(2, '0')} / {q.question}
            </legend>
            <div className="quiz-options">
              {q.options.map((option, i) => (
                <label className="quiz-option" key={option}>
                  <input
                    type="radio"
                    name={q.id}
                    value={i}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers({ ...answers, [q.id]: i })}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {answers[q.id] !== undefined && (
              <p className={`quiz-feedback ${answers[q.id] === q.correct ? 'correct' : 'retry'}`}>
                {answers[q.id] === q.correct ? 'Correct. ' : 'Try again. '}
                {q.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </section>
      <div className="quiz-actions">
        <button type="button" onClick={() => setAnswers({})}>
          Reset practice
        </button>
        <a href="./lab.html">Open the StudentCard lab &#8599;</a>
      </div>
      <p className="data-note">
        This is an interactive practice exercise. Its score is not an attendance code or an official
        grade.
      </p>
      <footer className="site-footer">
        <span>Sudip Sah / 202637610</span>
        <a href="./">Monday submission</a>
      </footer>
    </main>
  );
}
