import React from 'react';

// Exercise 1: a default prop supplies a local avatar when avatarUrl is omitted.
export function ProfileCard({ name, role, email, avatarUrl = './avatar.svg' }) {
  return (
    <div className="practice-profile">
      <img src={avatarUrl} alt={`${name}'s profile avatar`} width="64" height="64" />
      <h3>{name}</h3>
      <p>{role}</p>
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  );
}

const notifications = [
  { id: 'profile', type: 'success', message: 'Profile updated successfully' },
  { id: 'password', type: 'warning', message: 'Password expires in 3 days' },
  { id: 'lecture', type: 'info', message: 'New lecture materials available' },
];

// Exercise 2: conditional rendering chooses an icon; stable IDs identify the list items.
export function NotificationItem({ type, message }) {
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  return (
    <li className={`notification notification-${type}`}>
      <span aria-hidden="true">{icon}</span>
      <span><span className="notification-type">{type}: </span>{message}</span>
    </li>
  );
}

export function NotificationList() {
  return (
    <ul className="notifications">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} type={notification.type} message={notification.message} />
      ))}
    </ul>
  );
}

// Exercise 3: the wrapper renders different content through children.
export function Card({ title, children }) {
  return (
    <div className="content-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function Practice() {
  return (
    <main className="page">
      <header className="site-header">
        <a className="brand" href="../#coursework">SUDIP<span> / LAB</span></a>
        <nav aria-label="Course navigation"><a href="./tasks.html">Friday tasks</a><a href="../#coursework">Coursework</a><a href="../week10/portfolio/">Portfolio</a><a className="nav-link" href="./">Directory <span aria-hidden="true">&#8599;</span></a></nav>
      </header>
      <section className="intro practice-intro">
        <p className="eyebrow">WEB PROGRAMMING · WEEK 11</p>
        <h1>SMALL COMPONENTS.<br /><span className="outline">BIG POSSIBILITIES</span><span className="title-dot">.</span></h1>
        <p className="intro-copy">Three exercises in passing data, rendering lists, and composing interfaces.</p>
      </section>
      <div className="practice-grid">
        <section className="exercise" aria-labelledby="exercise-one">
          <div className="exercise-number">EXERCISE 01</div>
          <h2 id="exercise-one">A profile, with defaults.</h2>
          <p>Pass a name, role, and email. The avatar uses its default prop.</p>
          <ProfileCard name="Sudip Sah" role="Computer Engineering Student" email="Sudipsah909@gmail.com" />
        </section>
        <section className="exercise" aria-labelledby="exercise-two">
          <div className="exercise-number">EXERCISE 02</div>
          <h2 id="exercise-two">The right message.</h2>
          <p>Sample notifications rendered from an array, each with an icon for its type.</p>
          <NotificationList />
        </section>
        <section className="exercise" aria-labelledby="exercise-three">
          <div className="exercise-number">EXERCISE 03</div>
          <h2 id="exercise-three">One wrapper, different content.</h2>
          <p>Both boxes use Card. Their titles and children are different.</p>
          <div className="wrapper-grid">
            <Card title="What I am learning">
              <ul><li>Reusable components and props</li><li>Lists with stable keys</li><li>Conditional rendering</li></ul>
            </Card>
            <Card title="My next step">
              <p>Explore the student directory and see how the same component displays three different students.</p>
            </Card>
          </div>
        </section>
      </div>
      <footer className="site-footer"><span>Sudip Sah · 202637610</span><span>Week 11 Friday / Study guide practice</span></footer>
    </main>
  );
}
