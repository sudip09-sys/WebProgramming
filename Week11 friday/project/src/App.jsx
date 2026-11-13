import React from 'react';
import StudentProfileCard from './StudentProfileCard';

function App() {
  return (
    <main className="page" id="main">
      <header className="site-header">
        <a className="brand" href="./"><span className="brand-mark" aria-hidden="true">G</span> Gachon / Class of 2026</a>
        <a className="nav-link" href="./practice.html">Practice exercises <span aria-hidden="true">↗</span></a>
      </header>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">WEB PROGRAMMING · WEEK 11</p>
        <h1 id="page-title">Student Directory<span className="title-dot">.</span></h1>
        <p className="intro-copy">Three classmates. One reusable component.</p>
        <div className="section-label"><span>Meet the class</span><span>03 students</span></div>
      </section>
      <section className="card-grid" aria-label="Student profiles">
        <StudentProfileCard
          name="Sudip Sah"
          studentId="202637610"
          major="Computer Engineering"
          year={1}
          gpa="Not provided"
        />
        <StudentProfileCard
          name="Abinash Lamichhane"
          studentId="Not provided"
          major="Not provided"
          year="Not provided"
          gpa="Not provided"
        />
        <StudentProfileCard
          name="Eric"
          studentId="Not provided"
          major="Not provided"
          year="Not provided"
          gpa="Not provided"
        />
      </section>
      <p className="data-note">Unconfirmed academic details are shown as “Not provided”.</p>
      <footer className="site-footer"><span>Sudip Sah · 202637610</span><span>Task 11-A / React Components &amp; Props</span></footer>
    </main>
  );
}

export default App;
