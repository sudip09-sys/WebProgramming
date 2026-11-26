(() => {
  'use strict';

  const h = React.createElement;
  const { useEffect, useRef, useState } = React;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const tasks = [
    ['counter', 'Live Character Counter'],
    ['contact', 'Contact Form'],
    ['skills', 'Skills Checklist'],
    ['feedback', 'Course Feedback'],
    ['registration', 'Multi-Step Registration'],
    ['profile', 'Student Profile Editor'],
  ];

  function useFields(initial) {
    const [values, setValues] = useState(initial);
    function change({ target }) {
      const { name, type, checked, value } = target;
      setValues(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    }
    return [values, change, () => setValues(initial)];
  }

  function Field({ label, name, value, onChange, error, type = 'text', options, ...attributes }) {
    const tag = options ? 'select' : type === 'textarea' ? 'textarea' : 'input';
    const id = React.useId();
    return h('div', { className: 'field' },
      h('label', { htmlFor: id }, label),
      h(tag, {
        ...attributes, id, name, value, onChange,
        ...(tag === 'input' ? { type } : {}),
        'aria-invalid': Boolean(error), 'aria-describedby': error ? id + '-error' : undefined,
      }, options?.map(([key, text]) => h('option', { key, value: key }, text))),
      error && h('small', { id: id + '-error', className: 'error', role: 'alert' }, error));
  }

  function Group({ title, options, selected, onSelect, type = 'checkbox', name }) {
    return h('fieldset', null, h('legend', null, title),
      h('div', { className: 'choices' }, options.map(option =>
        h('label', { key: option },
          h('input', { type, name, checked: selected.includes(option), onChange: () => onSelect(option) }),
          option))));
  }

  function toggle(list, item) {
    return list.includes(item) ? list.filter(value => value !== item) : [...list, item];
  }

  function Status({ children }) {
    return h('p', { className: 'status', role: 'status' }, children);
  }

  function Counter() {
    const [value, setValue] = useState('');
    return h(React.Fragment, null,
      h(Field, { label: 'Text to count', name: 'text', type: 'textarea', value, maxLength: 200,
        disabled: value.length === 200, onChange: event => setValue(event.target.value) }),
      h('progress', { max: 200, value: value.length, 'aria-label': 'Character limit' }),
      h(Status, null, value.length + ' / 200' + (value.length === 200 ? ' · Limit reached' : '')),
      h('button', { type: 'button', onClick: () => setValue(''), disabled: !value }, 'Clear text'));
  }

  function Contact() {
    const [values, change, reset] = useFields({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState('');
    function submit(event) {
      event.preventDefault();
      const next = {};
      if (!values.name.trim()) next.name = 'Enter your name.';
      if (!emailPattern.test(values.email.trim())) next.email = 'Enter a valid email address.';
      if (!values.message.trim()) next.message = 'Enter a message.';
      setErrors(next);
      setSent('');
      if (Object.keys(next).length) return;
      setSent(values.name.trim());
      reset();
    }
    return h('form', { noValidate: true, onSubmit: submit },
      ...[['name', 'Name'], ['email', 'Email', 'email'], ['message', 'Message', 'textarea']]
        .map(([name, label, type]) => h(Field, { key: name, name, label, type, value: values[name], onChange: change, error: errors[name], required: true })),
      h('button', null, 'Send practice message'),
      sent && h(Status, null, 'Thanks, ' + sent + '! Your practice message was accepted.'));
  }

  function Skills() {
    const [selected, setSelected] = useState([]);
    return h(React.Fragment, null,
      h(Group, { title: 'Pick your skills', options: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Git'],
        selected, onSelect: item => setSelected(previous => toggle(previous, item)) }),
      h(Status, null, selected.length + ' of 6 selected'),
      selected.length > 3 && h('p', { className: 'error', role: 'alert' }, 'You selected more than three skills.'));
  }

  function Feedback() {
    const [values, change, reset] = useFields({ name: '', id: '', comments: '' });
    const [rating, setRating] = useState('');
    const [topics, setTopics] = useState([]);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState('');
    function submit(event) {
      event.preventDefault();
      const next = {};
      if (!values.name.trim()) next.name = 'Enter your name.';
      if (!/^\d{8}$/.test(values.id)) next.id = 'Enter exactly 8 digits.';
      if (!rating) next.rating = 'Choose a rating.';
      setErrors(next);
      setSent('');
      if (Object.keys(next).length) return;
      setSent(values.name.trim());
      setRating('');
      setTopics([]);
      reset();
    }
    return h('form', { noValidate: true, onSubmit: submit },
      h(Field, { name: 'name', label: 'Student name', value: values.name, onChange: change, error: errors.name, required: true }),
      h(Field, { name: 'id', label: 'Student ID (8 digits)', value: values.id, onChange: change, error: errors.id, inputMode: 'numeric', required: true }),
      h(Group, { title: 'Rating', options: ['5 stars', '4 stars', '3 stars'], type: 'radio',
        name: 'rating', selected: [rating], onSelect: setRating }),
      errors.rating && h('p', { className: 'error', role: 'alert' }, errors.rating),
      h(Group, { title: 'Topics covered well (optional)', options: ['HTML', 'CSS', 'JavaScript', 'Git', 'React'],
        selected: topics, onSelect: item => setTopics(previous => toggle(previous, item)) }),
      h(Field, { name: 'comments', label: 'Comments (optional)', type: 'textarea', value: values.comments, onChange: change, maxLength: 300 }),
      h(Status, null, values.comments.length + ' / 300'),
      h('button', { disabled: !values.name.trim() || !values.id || !rating }, 'Submit practice feedback'),
      sent && h(Status, null, 'Thank you, ' + sent + '! Your practice feedback was accepted.'));
  }

  const registrationFields = [
    [['name', 'Name'], ['email', 'Email', 'email']],
    [['username', 'Username'], ['password', 'Practice password', 'password'], ['confirm', 'Confirm practice password', 'password']],
  ];

  const registrationStages = ['Identity', 'Account', 'Access'];

  function CampusPass({ values, complete }) {
    const initials = values.name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
      .map(word => Array.from(word)[0].toUpperCase()).join('');
    return h('aside', { className: 'campus-pass', 'data-role': values.role, 'aria-label': 'Campus pass preview' },
      h('div', { className: 'pass-header' },
        h('span', null, 'SUDIP LAB / CAMPUS PASS'),
        h('span', { className: 'pass-status' }, complete ? 'ISSUED' : 'PREVIEW')),
      h('div', { className: 'pass-identity' },
        h('span', { className: 'pass-monogram', 'aria-hidden': true }, initials || '—'),
        h('div', null, h('strong', null, values.name.trim() || 'Your name'),
          h('p', null, values.username ? '@' + values.username : 'Username pending'))),
      h('dl', null,
        h('div', null, h('dt', null, 'Access role'), h('dd', null, values.role)),
        h('div', null, h('dt', null, 'Newsletter'), h('dd', null, values.subscribe ? 'Subscribed' : 'Off'))));
  }

  function Registration() {
    const [values, change, reset] = useFields({ name: '', email: '', username: '', password: '', confirm: '', role: 'Student', subscribe: false });
    const [step, setStep] = useState(0);
    const [touched, setTouched] = useState({});
    const [done, setDone] = useState(false);
    const errors = {
      name: values.name.trim().length < 2 ? 'Enter at least 2 characters.' : '',
      email: !emailPattern.test(values.email.trim()) ? 'Enter a valid email address.' : '',
      username: !/^\S{3,}$/.test(values.username) ? 'Use at least 3 characters with no spaces.' : '',
      password: values.password.length < 8 ? 'Use at least 8 characters.' : '',
      confirm: !values.confirm || values.confirm !== values.password ? 'Passwords must match.' : '',
    };
    const current = registrationFields[step] || [];
    const valid = current.every(([name]) => !errors[name]);
    function submit(event) {
      event.preventDefault();
      if (step < 2) {
        if (valid) setStep(step + 1);
        return;
      }
      if (Object.values(errors).some(Boolean)) return;
      const { name, email, username, role, subscribe } = values;
      console.log('Practice registration', { name, email, username, role, subscribe });
      setDone(true);
    }
    if (done) return h('div', { className: 'registration-layout' },
      h('div', null,
        h(Status, null, 'Practice registration complete.'),
        h('button', { onClick: () => { reset(); setStep(0); setTouched({}); setDone(false); } }, 'Start again')),
      h(CampusPass, { values, complete: true }));
    return h('div', { className: 'registration-layout' },
      h('form', { noValidate: true, onSubmit: submit },
      h('ol', { className: 'registration-stages', 'aria-label': 'Registration steps' },
        registrationStages.map((label, index) => h('li', {
          key: label, 'aria-current': step === index ? 'step' : undefined,
          'data-complete': index < step,
        }, h('span', { 'aria-hidden': true }, index < step ? '✓' : '0' + (index + 1)), ' ', label))),
      h('p', { className: 'registration-step' }, 'Step ' + (step + 1) + ' of 3'),
      ...current.map(([name, label, type]) => h(Field, { key: name, name, label, type, value: values[name], onChange: change,
        onBlur: () => setTouched(previous => ({ ...previous, [name]: true })), error: touched[name] ? errors[name] : '', required: true })),
      step === 2 && h(React.Fragment, null,
        h(Group, { title: 'Role', options: ['Student', 'TA', 'Instructor'], name: 'role',
          type: 'radio', selected: [values.role], onSelect: value => change({ target: { name: 'role', value } }) }),
        h('label', null, h('input', { name: 'subscribe', type: 'checkbox', checked: values.subscribe, onChange: change }), 'Subscribe to the newsletter'),
        h('div', { className: 'preview' }, h('h3', null, 'Review'),
          ...[['Name', values.name], ['Email', values.email], ['Username', values.username], ['Password', '•'.repeat(values.password.length)], ['Role', values.role], ['Newsletter', values.subscribe ? 'Yes' : 'No']]
            .map(([label, value]) => h('p', { key: label }, h('strong', null, label + ' · '), value)))),
      h('div', { className: 'actions' },
        step > 0 && h('button', { type: 'button', className: 'secondary', onClick: () => setStep(step - 1) }, 'Previous'),
        h('button', { type: 'submit', disabled: !valid }, step < 2 ? 'Next' : 'Issue practice pass'))),
      h(CampusPass, { values }));
  }

  const majors = ['Computer Engineering', 'Software', 'Artificial Intelligence', 'Design'];
  function Profile() {
    const [values, change] = useFields({ name: '', id: '', major: '', year: '', bio: '' });
    const [photo, setPhoto] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(null);
    const [draftSkill, setDraftSkill] = useState('');
    const [skills, setSkills] = useState([]);
    const fileInput = useRef(null);
    useEffect(() => {
      if (!photo) { setPhotoUrl(''); return; }
      const url = URL.createObjectURL(photo);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [photo]);
    useEffect(() => {
      if (saved) return () => URL.revokeObjectURL(saved.url);
    }, [saved]);
    function addSkill() {
      const skill = draftSkill.trim();
      if (skill && !skills.some(value => value.toLowerCase() === skill.toLowerCase())) {
        setSkills([...skills, skill]);
      }
      setDraftSkill('');
    }
    function submit(event) {
      event.preventDefault();
      const next = {};
      if (!values.name.trim()) next.name = 'Enter your name.';
      if (!/^\d{10}$/.test(values.id)) next.id = 'Enter exactly 10 digits.';
      if (!values.major) next.major = 'Choose your major.';
      if (!values.year) next.year = 'Choose your year.';
      if (!values.bio.trim() || values.bio.length >= 200) next.bio = 'Enter a bio between 1 and 199 characters.';
      if (!photo) next.photo = 'Choose an image file.';
      setErrors(next);
      if (Object.keys(next).length) return;
      setSaved({ ...values, skills: [...skills], url: URL.createObjectURL(photo) });
    }
    return h('div', { className: 'profile-grid' },
      h('form', { noValidate: true, onSubmit: submit },
        ...[['name', 'Name', {}], ['id', 'Student ID (10 digits)', { inputMode: 'numeric' }],
          ['major', 'Major', { options: [['', 'Choose a major'], ...majors.map(major => [major, major])] }],
        ].map(([name, label, extra]) => h(Field, { key: name, name, label, ...extra, value: values[name], onChange: change, error: errors[name], required: true })),
        h(Group, { title: 'Year', options: ['1', '2', '3', '4'], name: 'year', type: 'radio',
          selected: [values.year], onSelect: value => change({ target: { name: 'year', value } }) }),
        errors.year && h('p', { className: 'error', role: 'alert' }, errors.year),
        h(Field, { name: 'bio', label: 'Bio (under 200 characters)', type: 'textarea', value: values.bio, onChange: change, error: errors.bio, maxLength: 199, required: true }),
        h(Status, null, values.bio.length + ' / 200'),
        h('div', { className: 'field' },
          h('label', { htmlFor: 'profile-photo' }, 'Profile photo'),
          h('input', { id: 'profile-photo', type: 'file', accept: 'image/*', ref: fileInput, required: true,
            'aria-invalid': Boolean(errors.photo), 'aria-describedby': errors.photo ? 'photo-error' : undefined,
            onChange: () => { const file = fileInput.current.files[0]; setPhoto(file?.type.startsWith('image/') ? file : null); } }),
          errors.photo && h('small', { className: 'error', id: 'photo-error', role: 'alert' }, errors.photo),
          photoUrl && h('img', { className: 'avatar', src: photoUrl, alt: 'Selected profile photo' })),
        h(Field, { label: 'Skill tag (optional)', name: 'skill', value: draftSkill, maxLength: 30,
          onChange: event => setDraftSkill(event.target.value),
          onKeyDown: event => { if (event.key === 'Enter') { event.preventDefault(); addSkill(); } } }),
        h('button', { type: 'button', className: 'secondary', onClick: addSkill }, 'Add skill'),
        h('div', { className: 'tags' }, skills.map(skill => h('button', {
          key: skill, type: 'button', 'aria-label': 'Remove ' + skill, className: 'secondary',
          onClick: () => setSkills(skills.filter(item => item !== skill)),
        }, skill + ' ×'))),
        h('button', null, 'Save profile')),
      h('aside', { className: 'preview', 'aria-live': 'polite' }, h('h3', null, 'Profile Preview'),
        saved ? h(React.Fragment, null,
          h('img', { className: 'avatar', src: saved.url, alt: 'Photo for ' + saved.name }),
          h('h4', null, saved.name), h('p', null, 'ID ' + saved.id + ' · Year ' + saved.year),
          h('p', null, saved.major), h('p', { className: 'bio' }, saved.bio),
          saved.skills.length > 0 && h('p', null, saved.skills.join(' · '))) :
          h('p', null, 'Save a valid profile to see it here.')));
  }

  const components = [Counter, Contact, Skills, Feedback, Registration, Profile];
  function Lab() {
    return h(React.Fragment, null,
      h('nav', { className: 'lab-nav', 'aria-label': 'Exercises' },
        tasks.map(([id, label]) => h('a', { key: id, href: '#' + id }, label))),
      h('div', { className: 'cards' }, tasks.map(([id, label], index) =>
        h('section', { key: id, id, className: 'card', 'aria-labelledby': id + '-title' },
          h('h2', { id: id + '-title' }, label), h(components[index])))));
  }

  function HomepagePicker() {
    const [chosen, setChosen] = useState(tasks[5][0]);
    return h('p', null,
      h('label', null, 'Jump to a React exercise ', h('select', { value: chosen, onChange: event => setChosen(event.target.value) },
        tasks.map(([id, label]) => h('option', { key: id, value: id }, label)))),
      ' ', h('a', { href: 'week13/#' + chosen }, 'Open exercise ↗'));
  }

  const lab = document.getElementById('week13-lab');
  const picker = document.getElementById('week13-picker');
  if (lab) {
    ReactDOM.createRoot(lab).render(h(Lab));
    if (location.hash) {
      const observer = new MutationObserver(() => {
        const section = document.getElementById(location.hash.slice(1));
        if (section) { section.scrollIntoView(); observer.disconnect(); }
      });
      observer.observe(lab, { childList: true, subtree: true });
    }
  }
  if (picker) ReactDOM.createRoot(picker).render(h(HomepagePicker));
})();
