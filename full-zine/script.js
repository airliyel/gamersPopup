
const articles = [...document.querySelectorAll('.game-article')];
const targetButtons = [...document.querySelectorAll('[data-target]')];
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

function openGame(id, pushHash = true) {
  const target = document.getElementById(id);
  if (!target) return;
  articles.forEach(article => article.classList.toggle('active', article.id === id));
  targetButtons.forEach(button => {
    const active = button.dataset.target === id;
    button.classList.toggle('active', active);
    if (button.classList.contains('game-tab')) button.setAttribute('aria-pressed', String(active));
  });
  if (pushHash) history.replaceState(null, '', `#${id}`);
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

targetButtons.forEach(button => {
  button.addEventListener('click', () => openGame(button.dataset.target));
});

document.querySelector('[data-scroll-games]').addEventListener('click', () => {
  document.querySelector('#games').scrollIntoView({ behavior: 'smooth' });
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

const hash = location.hash.replace('#', '');
if (document.getElementById(hash)?.classList.contains('game-article')) {
  openGame(hash, false);
}
