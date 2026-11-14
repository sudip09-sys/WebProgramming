import React from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';
import { Card } from './practice.jsx';

export function Greeting({ name }) {
  return <p>Hello, {name}!</p>;
}

export function Alert({ type, message }) {
  if (!message) return null;
  return (
    <p className={`notification notification-${type}`}>
      {type === 'warning' ? 'Warning: ' : 'Update: '}
      {message}
    </p>
  );
}

export function GradeCard({ student }) {
  const passed = student.score >= 60;
  return (
    <article className="content-card">
      <h3>{student.name}</h3>
      <p>Demo ID: {student.id}</p>
      <p>Score: {student.score}</p>
      <span className={`badge ${passed ? 'available' : 'unavailable'}`}>
        {passed ? 'Pass' : 'Fail'}
      </span>
    </article>
  );
}

export const roster = [
  { id: 'demo-01', name: 'Sample learner A', score: 88 },
  { id: 'demo-02', name: 'Sample learner B', score: 45 },
];

export function GradeBoard() {
  return (
    <div className="wrapper-grid">
      {roster.map((student) => (
        <GradeCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export function StudentList() {
  const students = [
    { id: '202637610', name: 'Sudip Sah' },
    { id: '202637724', name: 'Abinash Lamichhane' },
    { id: '202637684', name: 'Eric' },
  ];
  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          {student.name} · {student.id}
        </li>
      ))}
    </ul>
  );
}

export default function Examples() {
  return (
    <ExerciseLayout
      title="COMPONENT LAB"
      description="Small components demonstrate reuse, list rendering, conditional output, and composition."
    >
      <div className="practice-grid">
        <section className="exercise">
          <div className="exercise-number">01 / FUNCTIONAL COMPONENTS</div>
          <h2>Same greeting. Different props.</h2>
          <Greeting name="Sudip" />
          <Greeting name="Abinash" />
          <Greeting name="Eric" />
        </section>
        <section className="exercise">
          <div className="exercise-number">02 / LISTS &amp; KEYS</div>
          <h2>Turn an array into a list.</h2>
          <Card title="Student list">
            <StudentList />
          </Card>
        </section>
        <section className="exercise">
          <div className="exercise-number">03 / CONDITIONAL RENDERING</div>
          <h2>Show the right message.</h2>
          <Alert type="info" message="Your work is ready to review." />
          <Alert type="warning" message="Save your changes before closing." />
          <Alert type="info" message="" />
          <p>The empty message returns null and displays nothing.</p>
        </section>
        <section className="exercise">
          <div className="exercise-number">04 / COMPOSITION</div>
          <h2>A pass-or-fail board.</h2>
          <p>Demo scores show how the pass threshold of 60 changes each badge.</p>
          <GradeBoard />
        </section>
      </div>
    </ExerciseLayout>
  );
}
