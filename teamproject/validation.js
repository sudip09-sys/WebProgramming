(() => {
  'use strict';
  const form = document.getElementById('challenge-form'),
    input = document.getElementById('player-name'),
    error = document.getElementById('player-error'),
    status = document.getElementById('challenge-status');
  function validate() {
    const value = input.value.trim();
    const message =
      value.length < 2
        ? 'Enter a player name with at least 2 characters.'
        : value.length > 20
          ? 'Use no more than 20 characters.'
          : '';
    error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  input.addEventListener('input', () => {
    status.textContent = '';
    if (input.hasAttribute('aria-invalid')) validate();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    if (!validate()) {
      input.focus();
      return;
    }
    input.value = input.value.trim();
    try {
      localStorage.setItem('memory-match-player', input.value);
      status.textContent = 'Player name saved: ' + input.value + '. Ready for your next round.';
    } catch {
      status.textContent =
        'Player name accepted: ' + input.value + '. Browser storage is unavailable.';
    }
  });
  try {
    input.value = localStorage.getItem('memory-match-player') || '';
  } catch {}
})();
