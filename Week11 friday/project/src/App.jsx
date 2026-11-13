import React from 'react';
import StudentProfileCard from './StudentProfileCard';

function App() {
  return (
    <main className="page" id="main">
      <header className="site-header">
        <a className="brand" href="../#coursework">SUDIP<span> / LAB</span></a>
        <nav aria-label="Course navigation"><a href="./tasks.html">Friday tasks</a><a href="../#coursework">Coursework</a><a href="../week10/portfolio/">Portfolio</a><a className="nav-link" href="./practice.html">Practice <span aria-hidden="true">&#8599;</span></a></nav>
      </header>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">WEB PROGRAMMING · WEEK 11</p>
        <div className="hero-layout"><div><h1 id="page-title">STUDENT<br /><span className="outline">DIRECTORY</span><span className="title-dot">.</span></h1>
        <p className="intro-copy">Three classmates. One reusable component.<br />Built together, rendered differently.</p></div><aside className="hero-panel" aria-label="About this assignment"><span className="panel-kicker">11 / REACT &amp; PROPS</span><div className="hero-symbol" aria-hidden="true">&#123; <span>03</span> &#125;</div><p>Same structure.<br /><strong>Different people.</strong></p><a href="./practice.html">Explore the practice exercises <span aria-hidden="true">&#8599;</span></a></aside></div>
        <div className="section-label"><span><span className="red">01 / </span> MEET THE CLASS</span><span>GACHON UNIVERSITY · YEAR 1</span></div>
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
          studentId="202637724"
          major="Computer Engineering"
          year={1}
          gpa="Not provided"
        />
        <StudentProfileCard
          name="Eric"
          studentId="202637684"
          major="Computer Engineering"
          year={1}
          gpa="Not provided"
        />
      </section>
      <p className="data-note">University GPAs have not been provided.</p>
      <footer className="site-footer"><span>Sudip Sah · 202637610</span><a href="../#coursework">Back to coursework &#8599;</a><span>Task 11-A / React Components &amp; Props</span></footer>
    </main>
  );
}

export default App;
