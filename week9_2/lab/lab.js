// Classroom demo: all behavior stays on this page; nothing is submitted remotely.
document.querySelectorAll('[data-details]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.dataset.details);
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
  });
});
const search = document.getElementById('search-form');
search.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('movie-search').value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll('.movie-card').forEach((card) => {
    const matches = card.querySelector('.movie-title').textContent.toLowerCase().includes(query);
    card.closest('li').hidden = !matches;
    if (matches) count++;
  });
  document.getElementById('search-status').textContent =
    count + (count === 1 ? ' movie found.' : ' movies found.');
});
const newsletter = document.getElementById('newsletter-form');
const fields = ['subscriber-name', 'subscriber-email'].map((id) => document.getElementById(id));
function validate(input) {
  const error = document.getElementById(input.id + '-error');
  if (!error) return true; // The earlier stages intentionally have no error associations.
  const message = !input.value.trim()
    ? input.type === 'email'
      ? 'Enter your email address.'
      : 'Enter your name.'
    : input.validity.typeMismatch
      ? 'Enter a valid email address, such as name@example.com.'
      : '';
  error.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}
fields.forEach((input) =>
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validate(input);
    document.getElementById('newsletter-status').textContent = '';
  }),
);
newsletter.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = fields.filter((input) => !validate(input));
  document.getElementById('newsletter-status').textContent = invalid.length
    ? 'Please correct the indicated fields.'
    : 'Subscription form validated. Demo only: no data was sent or saved.';
  if (invalid.length) invalid[0].focus();
});

newsletter.querySelector('[type=submit]').disabled = false;
