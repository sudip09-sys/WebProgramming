import React, { useRef, useState } from 'react';

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

const startingProfile = {
  name: 'Sudip Sah',
  role: 'Computer Engineering Student',
  email: 'Sudipsah909@gmail.com',
};

function ProfilePlayground() {
  const [profile, setProfile] = useState(startingProfile);
  const [initials, setInitials] = useState(false);
  return (
    <div className="profile-playground">
      <fieldset className="profile-editor">
        <legend>Change a prop</legend>
        {['name', 'role', 'email'].map((field) => (
          <label key={field}>
            {field === 'name' ? 'Display name' : field === 'role' ? 'Role' : 'Email'}
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={profile[field]}
              maxLength={field === 'role' ? 80 : 100}
              onChange={(event) => setProfile({ ...profile, [field]: event.target.value })}
            />
          </label>
        ))}
        <label className="check-row">
          <input
            type="checkbox"
            checked={initials}
            onChange={(event) => setInitials(event.target.checked)}
          />
          Use my initials avatar
        </label>
        <button
          type="button"
          className="lab-button"
          onClick={() => {
            setProfile(startingProfile);
            setInitials(false);
          }}
        >
          Reset profile
        </button>
      </fieldset>
      <div>
        <p className="lab-caption">
          LIVE PREVIEW / {initials ? 'CUSTOM AVATAR' : 'DEFAULT AVATAR'}
        </p>
        <ProfileCard {...profile} avatarUrl={initials ? './initials-avatar.svg' : undefined} />
        <p className="lab-note">
          Try changing the name. The preview receives the new value as a prop. These edits stay in
          this page.
        </p>
      </div>
    </div>
  );
}

const notifications = [
  {
    id: 'build',
    type: 'success',
    message: 'Demo: the project build finished without errors.',
    read: false,
  },
  {
    id: 'links',
    type: 'warning',
    message: 'Demo reminder: check your live links before submitting.',
    read: false,
  },
  {
    id: 'practice',
    type: 'info',
    message: 'Demo tip: change a profile prop and watch the preview.',
    read: true,
  },
];

export function NotificationItem({ type, message, read, onToggle, onDismiss }) {
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  return (
    <li className={`notification notification-${type}${read ? ' is-read' : ''}`}>
      <span aria-hidden="true">{icon}</span>
      <div className="notification-copy">
        <span className="notification-type">
          {type} · {read ? 'Read' : 'Unread'}
        </span>
        <p>{message}</p>
        {onToggle && (
          <div className="notification-actions">
            <button
              type="button"
              className="lab-button"
              aria-label={`${read ? 'Mark unread' : 'Mark read'}: ${message}`}
              onClick={onToggle}
            >
              {read ? 'Mark unread' : 'Mark read'}
            </button>
            <button
              type="button"
              className="lab-button"
              aria-label={`Dismiss: ${message}`}
              onClick={onDismiss}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export function NotificationList({ items = notifications, onToggle, onDismiss }) {
  if (!items.length)
    return <p className="inbox-empty">No notifications in this view. Try All or reset the demo.</p>;
  return (
    <ul className="notifications">
      {items.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onToggle={onToggle ? () => onToggle(notification.id) : undefined}
          onDismiss={onDismiss ? () => onDismiss(notification.id) : undefined}
        />
      ))}
    </ul>
  );
}

function DemoInbox() {
  const [items, setItems] = useState(notifications);
  const [view, setView] = useState('All');
  const sequence = useRef(0),
    allButton = useRef(null);
  const unread = items.filter((item) => !item.read).length;
  const visible = view === 'Unread' ? items.filter((item) => !item.read) : items;
  function toggle(id) {
    setItems(items.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
    if (view === 'Unread') allButton.current?.focus();
  }
  return (
    <div className="demo-inbox">
      <p className="inbox-status" role="status">
        {unread} unread / {items.length} demo notifications
      </p>
      <div className="lab-toolbar">
        <div className="gallery-filters" role="group" aria-label="Notification view">
          {['All', 'Unread'].map((label) => (
            <button
              key={label}
              ref={label === 'All' ? allButton : undefined}
              type="button"
              aria-pressed={view === label}
              onClick={() => setView(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="lab-button"
          disabled={!unread}
          onClick={() => {
            setItems(items.map((item) => ({ ...item, read: true })));
            allButton.current?.focus();
          }}
        >
          Mark all read
        </button>
      </div>
      <NotificationList
        items={visible}
        onToggle={toggle}
        onDismiss={(id) => {
          setItems(items.filter((item) => item.id !== id));
          allButton.current?.focus();
        }}
      />
      <div className="lab-toolbar inbox-bottom">
        <button
          type="button"
          className="lab-button"
          onClick={() => {
            sequence.current += 1;
            setItems([
              ...items,
              {
                id: `reminder-${sequence.current}`,
                type: 'info',
                message: `Demo reminder ${sequence.current}: take a short break, then test one component.`,
                read: false,
              },
            ]);
          }}
        >
          Add demo reminder
        </button>
        <button
          type="button"
          className="lab-button"
          disabled={!items.length}
          onClick={() => {
            setItems([]);
            allButton.current?.focus();
          }}
        >
          Clear inbox
        </button>
        <button
          type="button"
          className="lab-button"
          onClick={() => {
            setItems(notifications);
            setView('All');
          }}
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}

export function Card({ title, children }) {
  return (
    <div className="content-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const concepts = [
  'Pass a value through props',
  'Explain the default avatar',
  'Render a list with stable keys',
  'Choose content with a condition',
];
function PracticeChecklist() {
  const [checked, setChecked] = useState([]);
  const done = checked.length;
  return (
    <div className="wrapper-grid">
      <Card title="Can I explain it?">
        <p>Tick the concepts you can explain in your own words.</p>
        <div className="concept-checks">
          {concepts.map((concept) => (
            <label className="check-row" key={concept}>
              <input
                type="checkbox"
                checked={checked.includes(concept)}
                onChange={(event) =>
                  setChecked(
                    event.target.checked
                      ? [...checked, concept]
                      : checked.filter((item) => item !== concept),
                  )
                }
              />
              {concept}
            </label>
          ))}
        </div>
      </Card>
      <Card
        title={done === concepts.length ? 'Ready for a walkthrough.' : 'One concept at a time.'}
      >
        <label className="progress-label" htmlFor="concept-progress">
          {done} of {concepts.length} concepts checked
        </label>
        <progress id="concept-progress" value={done} max={concepts.length} />
        <p role="status">
          {done === concepts.length
            ? 'Open the directory and explain how one component renders three different people.'
            : 'Try the controls above, then check the source to trace what changed.'}
        </p>
        <a className="lab-link" href="./index.html">
          Open student directory ↗
        </a>
        <button
          type="button"
          className="lab-button"
          disabled={!done}
          onClick={() => setChecked([])}
        >
          Reset checklist
        </button>
        <p className="lab-note">
          A personal practice checklist, not a grade or submission record. Refreshing resets it.
        </p>
      </Card>
    </div>
  );
}

function Explanation({ children, code }) {
  return (
    <details className="lab-explanation">
      <summary>How it works · see the code</summary>
      <p>{children}</p>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </details>
  );
}

export default function Practice() {
  return (
    <main className="page">
      <header className="site-header">
        <a className="brand" href="../#coursework">
          SUDIP<span> / LAB</span>
        </a>
        <nav aria-label="Course navigation">
          <a href="./tasks.html">Friday tasks</a>
          <a href="../#coursework">Coursework</a>
          <a href="../week10/portfolio/">Portfolio</a>
          <a className="nav-link" href="./">
            Directory ↗
          </a>
        </nav>
      </header>
      <section className="intro practice-intro">
        <p className="eyebrow">WEB PROGRAMMING · WEEK 11</p>
        <h1>
          SMALL COMPONENTS.
          <br />
          <span className="outline">BIG POSSIBILITIES</span>
          <span className="title-dot">.</span>
        </h1>
        <p className="intro-copy">Change a prop. Sort the inbox. Check what you can explain.</p>
        <nav className="lab-toolbar lab-jumps" aria-label="Practice sections">
          <a href="#exercise-one">01 / Profile</a>
          <a href="#exercise-two">02 / Demo inbox</a>
          <a href="#exercise-three">03 / Practice cards</a>
        </nav>
      </section>
      <div className="practice-grid interactive-practice">
        <section className="exercise" id="exercise-one" aria-labelledby="profile-title">
          <div className="exercise-number">EXERCISE 01 / PROPS PLAYGROUND</div>
          <h2 id="profile-title">Make the card yours.</h2>
          <p>
            Edit the fields or switch between my initials and the default avatar. Nothing is saved
            or sent.
          </p>
          <ProfilePlayground />
          <Explanation
            code={
              'const [profile, setProfile] = useState(startingProfile);\n<ProfileCard {...profile} avatarUrl={initials ? customAvatar : undefined} />'
            }
          >
            The editor owns the state. ProfileCard receives it as read-only props. Passing undefined
            lets the avatar default take over. In this excerpt, customAvatar is the path to my
            initials artwork.
          </Explanation>
        </section>
        <section className="exercise" id="exercise-two" aria-labelledby="inbox-title">
          <div className="exercise-number">EXERCISE 02 / DEMO INBOX</div>
          <h2 id="inbox-title">A quieter inbox.</h2>
          <p>
            Sample messages for testing React. These are not real messages, reminders or submission
            results.
          </p>
          <DemoInbox />
          <Explanation
            code={
              "const visible = view === 'Unread'\n  ? items.filter((item) => !item.read)\n  : items;\n{visible.map((item) => <NotificationItem key={item.id} {...item} />)}"
            }
          >
            State stores the inbox. The filter selects which items to show, stable IDs identify each
            row, and the notification type chooses its icon. Clear and reset let you test the empty
            state.
          </Explanation>
        </section>
        <section className="exercise" id="exercise-three" aria-labelledby="cards-title">
          <div className="exercise-number">EXERCISE 03 / COMPOSITION</div>
          <h2 id="cards-title">Build it. Then explain it.</h2>
          <p>
            The same Card wrapper holds two different children: a checklist and its live progress.
          </p>
          <PracticeChecklist />
          <Explanation
            code={
              'function Card({ title, children }) {\n  return <div className="content-card"><h3>{title}</h3>{children}</div>;\n}'
            }
          >
            Card only provides the frame and heading. The checklist controls state; the second card
            derives its progress and next step from that state.
          </Explanation>
        </section>
      </div>
      <footer className="site-footer">
        <span>Sudip Sah · 202637610</span>
        <a href="./tasks.html">Back to Friday tasks</a>
        <a href="https://github.com/sudip09-sys/WebProgramming/blob/main/Week11%20friday/project/src/practice.jsx">
          Read the full React source ↗
        </a>
      </footer>
    </main>
  );
}
