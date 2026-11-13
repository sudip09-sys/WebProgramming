import React from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';

export const courses = [
  { id: 1, title: 'Web Programming', instructor: 'Dr. Toshpulatov', credits: 3, required: true },
  { id: 2, title: 'Database Systems', instructor: 'Dr. Kim', credits: 3, required: true },
  { id: 3, title: 'Mobile App Dev', instructor: 'Dr. Lee', credits: 2, required: false },
];

export function CourseCard({ title, instructor, credits, required }) {
  return (
    <article className="catalog-card course-card">
      <span className={`badge ${required ? 'required' : 'elective'}`}>{required ? '필수 · Required' : '선택 · Elective'}</span>
      <h2>{title}</h2>
      <p className="instructor">{instructor}</p>
      <p className="credits"><strong>{credits}</strong> credits</p>
    </article>
  );
}

export default function CourseCatalog() {
  return (
    <ExerciseLayout title="COURSE CATALOG" description="Three courses from the lecture example. An array becomes a list of components, with a different badge for each course type.">
      <section className="catalog-grid" aria-label="Lecture sample courses">
        {courses.map(course => <CourseCard key={course.id} title={course.title} instructor={course.instructor} credits={course.credits} required={course.required} />)}
      </section>
      <p className="data-note">Instructor names and credits are the supplied lecture example, not a verified university course listing.</p>
    </ExerciseLayout>
  );
}
