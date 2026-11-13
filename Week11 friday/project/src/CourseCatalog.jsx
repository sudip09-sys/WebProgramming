import React from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';

export const courses = [
  { id: 1, title: 'Web Programming', instructor: 'Web Development Team', credits: 3, required: true },
  { id: 2, title: 'Database Systems', instructor: 'Database Team', credits: 3, required: true },
  { id: 3, title: 'Mobile App Dev', instructor: 'Mobile Development Team', credits: 2, required: false },
  { id: 4, title: 'Operating Systems', instructor: 'Instructor not listed', credits: 3, required: true },
  { id: 5, title: 'Artificial Intelligence', instructor: 'Instructor not listed', credits: 2, required: false },
  { id: 6, title: 'Discrete Mathematics', instructor: 'Instructor not listed', credits: 3, required: true },
  { id: 7, title: 'College English', instructor: 'Instructor not listed', credits: 1, required: false },
];

export function CourseCard({ title, instructor, credits, required }) {
  return (
    <article className="catalog-card course-card">
      <span className={`badge ${required ? 'required' : 'elective'}`}>{required ? '필수 · Required' : '선택 · Elective'}</span>
      <h2>{title}</h2>
      <p className="instructor">{instructor}</p>
      <p className="credits"><strong>{credits}</strong> {credits === 1 ? 'credit' : 'credits'}</p>
    </article>
  );
}

export default function CourseCatalog() {
  return (
    <ExerciseLayout title="COURSE CATALOG" description="A reusable course component, an array of data, and a badge for each course type.">
      <section className="catalog-grid" aria-label="Sample course catalog">
        {courses.map(course => <CourseCard key={course.id} title={course.title} instructor={course.instructor} credits={course.credits} required={course.required} />)}
      </section>
      <p className="data-note">Course names and credits include my provided subjects. Required/elective badges are practice examples, not official course classifications.</p>
    </ExerciseLayout>
  );
}
