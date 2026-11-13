import React from 'react';
import StudentCard from './StudentCard.jsx';

export default function App() {
  return (
    <main className="page">
      <header className="site-header">
        <a className="brand" href="../#coursework">SUDIP<span> / LAB</span></a>
        <nav aria-label="Course navigation"><a href="./">Monday</a><a href="./review.html">Concept checks</a><a href="../Week11%20friday/tasks.html">Friday</a><a href="../#coursework">Coursework</a></nav>
      </header>
      <section className="intro">
        <p className="eyebrow">WEEK 11 MONDAY / FIRST COMPONENT</p>
        <h1>MY FIRST<br /><span className="outline">REACT CARD</span><span className="title-dot">.</span></h1>
        <p className="intro-copy">A function, three props, and a card that is mine.</p>
      </section>
      <section className="monday-lab" aria-label="StudentCard lab result">
        <div className="card-grid">
          <StudentCard name="Sudip Sah" id="202637610" major="Computer Engineering" />
        </div>
        <aside className="explanation">
          <p className="eyebrow">HOW THE DATA GETS HERE</p>
          <h2>Parent passes.<br />Child displays.</h2>
          <p>App sends my name, ID, and major as props. StudentCard receives those values and displays them using JSX.</p>
          <pre><code>{'<StudentCard\n  name="Sudip Sah"\n  id="202637610"\n  major="Computer Engineering"\n/>'}</code></pre>
        </aside>
      </section>
      <p className="data-note">StudentCard receives three read-only props: name, id, and major.</p>
      <footer className="site-footer"><span>Sudip Sah / 202637610</span><a href="./">Back to Monday tasks</a><a href="../Week11%20friday/tasks.html">Continue to Friday</a></footer>
    </main>
  );
}
