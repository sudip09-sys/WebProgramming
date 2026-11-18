import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './state.css';

function Exercise({ title, concept, children }) {
  return (
    <article className="exercise">
      <h2>{title}</h2>
      <p>{concept}</p>
      {children}
    </article>
  );
}

function Counter({ count, setCount }) {
  return (
    <Exercise title="1. Count practice rounds" concept="Functional updates use the previous count.">
      <p role="status">Rounds: {count}</p>
      <div className="controls">
        <button onClick={() => setCount(value => value - 1)}>Decrease</button>
        <button onClick={() => setCount(value => value + 1)}>Increase</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </Exercise>
  );
}

function Greeting({ name, setName }) {
  return (
    <Exercise title="2. Name your session" concept="A controlled input keeps its value in React state.">
      <label>Display name <input value={name} onChange={event => setName(event.target.value)} /></label>
      <p>Ready to study, {name.trim() || 'student'}!</p>
    </Exercise>
  );
}

function TaskList() {
  const [draft, setDraft] = useState('');
  const [tasks, setTasks] = useState([]);
  function addTask(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const task = { id: crypto.randomUUID(), title };
    setTasks(items => [...items, task]);
    setDraft('');
  }

  return (
    <Exercise title="3. Study queue" concept="Add and remove items without mutating the array.">
      <form onSubmit={addTask}>
        <label>New study task <input value={draft} onChange={event => setDraft(event.target.value)} /></label>
        <button disabled={!draft.trim()}>Add task</button>
      </form>
      {tasks.length === 0 && <p>Your study queue is empty.</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} <button aria-label={'Remove ' + task.title} onClick={() => setTasks(items => items.filter(item => item.id !== task.id))}>Remove</button>
          </li>
        ))}
      </ul>
    </Exercise>
  );
}

function Toggle() {
  const [open, setOpen] = useState(false);
  return (
    <Exercise title="4. Quick React tip" concept="A boolean controls whether the hint is visible.">
      <button aria-expanded={open} aria-controls="state-hint" onClick={() => setOpen(value => !value)}>
        {open ? 'Hide hint' : 'Show hint'}
      </button>
      <p id="state-hint" hidden={!open}>Try adding a task without refreshing. React updates the queue as soon as its state changes.</p>
    </Exercise>
  );
}

const initialChecklist = [
    { id: 'notes', title: 'Review the props examples', done: false },
    { id: 'demo', title: 'Try the Memory Match demo', done: false },
    { id: 'props', title: 'Finish the StudentCard lab', done: true },
];

function Checklist({ items, setItems, clearCompleted }) {
  const [filter, setFilter] = useState('All');
  const visible = items.filter(item => filter === 'All' || item.done === (filter === 'Done'));

  function toggleItem(id) {
    setItems(current => current.map(item => item.id === id ? { ...item, done: !item.done } : item));
  }

  return (
    <Exercise title="5. Submission checklist" concept="Update one item with map, then filter by status.">
      <div className="controls" role="group" aria-label="Task status">
        {['All', 'Active', 'Done'].map(option => (
          <button key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>
        ))}
      </div>
      {visible.length === 0 && <p>No matching tasks.</p>}
      <ul>
        {visible.map(item => (
          <li key={item.id}>
            <label><input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} /> {item.title}</label>
          </li>
        ))}
      </ul>
      <button disabled={!items.some(item => item.done)} onClick={clearCompleted}>Clear completed</button>
    </Exercise>
  );
}

function ProfileForm() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [feedback, setFeedback] = useState('');
  function update(event) {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
    setFeedback('');
  }
  function submit(event) {
    event.preventDefault();
    if (!profile.name.trim()) {
      setFeedback('Enter your name.');
    } else if (!event.currentTarget.elements.email.validity.valid) {
      setFeedback('Enter a valid email address.');
    } else {
      setFeedback('Profile details validated for ' + profile.name.trim() + '.');
    }
  }
  return (
    <Exercise title="6. Check your lab profile" concept="Keep two controlled fields together in an object.">
      <form onSubmit={submit} noValidate>
        <label>Name <input name="name" required value={profile.name} onChange={update} /></label>
        <label>Email <input name="email" type="email" required value={profile.email} onChange={update} /></label>
        <button>Check profile</button>
      </form>
      <p role="status">{feedback}</p>
    </Exercise>
  );
}

const noteKey = 'sudip-week11-monday-note';

function SavedNote() {
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem(noteKey) ?? '';
    } catch {
      return '';
    }
  });
  const [status, setStatus] = useState('');
  useEffect(() => {
    try {
      if (note) localStorage.setItem(noteKey, note);
      else localStorage.removeItem(noteKey);
      setStatus(note ? 'Saved in this browser.' : 'No note saved.');
    } catch {
      setStatus('Browser storage is unavailable.');
    }
  }, [note]);

  return (
    <Exercise title="7. Leave yourself a note" concept="An effect saves your note whenever it changes.">
      <label>Note <textarea rows={4} value={note} onChange={event => setNote(event.target.value)} /></label>
      <button disabled={!note} onClick={() => setNote('')}>Clear note</button>
      <p role="status">{status}</p>
    </Exercise>
  );
}

function StateLab() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [items, setItems] = useState(initialChecklist);
  const [archived, setArchived] = useState(0);
  const completed = archived + items.filter(item => item.done).length;
  const total = archived + items.length;

  function clearCompleted() {
    setArchived(completed);
    setItems(items.filter(item => !item.done));
  }

  return (
    <div className="page state-lab">
      <header className="site-header">
        <a className="brand" href="../#coursework">SUDIP<span> / LAB</span></a>
        <nav aria-label="Course navigation"><a href="./index.html">Monday submission</a></nav>
      </header>
      <main>
        <section className="intro practice-intro">
          <p className="eyebrow">SUDIP / STUDY SESSION</p>
          <h1>REACT <span className="outline">STATE LAB</span><span className="title-dot">.</span></h1>
          <p className="intro-copy">Set up a study session, work through your queue, and leave a note for next time.</p>
        </section>
        <section className="session-dashboard" aria-labelledby="session-title">
          <div>
            <h2 id="session-title">{name.trim() || 'Your study session'}</h2>
            <p>Update your name, count rounds, or tick off coursework to see this dashboard change.</p>
          </div>
          <div className="session-stats">
            <strong><output>{count}</output> practice rounds</strong>
            <label><output>{completed} / {total}</output> tasks complete
              <progress value={completed} max={total} />
            </label>
          </div>
        </section>
        <div className="practice-grid">
          <Counter count={count} setCount={setCount} />
          <Greeting name={name} setName={setName} />
          <TaskList />
          <Toggle />
          <Checklist items={items} setItems={setItems} clearCompleted={clearCompleted} />
          <ProfileForm />
          <SavedNote />
        </div>
      </main>
      <footer className="site-footer"><span>Sudip Sah / 202637610</span><a href="./index.html">Back to Monday</a></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StateLab />);
