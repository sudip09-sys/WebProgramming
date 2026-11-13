import React from 'react';

export default function ExerciseLayout({ title, description, children }) {
  return (
    <main className="page">
      <header className="site-header">
        <a className="brand" href="../#coursework">SUDIP<span> / LAB</span></a>
        <nav aria-label="Course navigation"><a href="./tasks.html">Friday tasks</a><a href="./index.html">Directory</a><a href="./gallery.html">Gallery</a><a href="../#coursework">Coursework</a></nav>
      </header>
      <section className="intro exercise-intro">
        <p className="eyebrow">WEB PROGRAMMING / WEEK 11 FRIDAY</p>
        <h1>{title}<span className="title-dot">.</span></h1>
        <p className="intro-copy">{description}</p>
      </section>
      {children}
      <footer className="site-footer"><span>Sudip Sah / 202637610</span><a href="./tasks.html">Back to Friday tasks</a><a href="../Week11%20monday/">Monday tasks</a></footer>
    </main>
  );
}
