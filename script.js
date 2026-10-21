/* PERSONALISE HERE. This is a playful front-end gate, not secure authentication. */
const RECIPIENT_NAME = "nidaa"; // Change to the recipient's name.
const DELIVERY_PIN = "123";                 // Change to your chosen code.

const $ = (id) => document.getElementById(id);
const pages = [$('welcomePage'), $('verifyPage'), $('deskPage')];
const viewer = $('letterViewer');
const cards = [...document.querySelectorAll('.letter-card')];
let currentLetter = 0;
let zoom = 1;
let previousFocus = null;
let heartTimers = [];

function showPage(target) {
  pages.forEach(page => page.classList.toggle('hidden', page !== target));
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
$('startDelivery').addEventListener('click', () => showPage($('verifyPage')));
$('verifyForm').addEventListener('submit', event => {
  event.preventDefault();
  const normalizeName = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  const typedName = normalizeName($('recipientName').value);
  const expectedName = normalizeName(RECIPIENT_NAME);
  const typedPin = $('recipientPin').value.trim();
  if (typedName === expectedName && typedPin === DELIVERY_PIN) {
    $('formError').textContent = '';
    showPage($('deskPage'));
    window.requestAnimationFrame(layoutDeskDecorations);
  } else {
    $('formError').textContent = 'Those details don’t quite match this delivery. Try again ♡';
    $('recipientPin').focus();
    $('recipientPin').select();
  }
});


// Randomly place optional desk doodles only in genuinely free space. They are
// decorative (pointer-events:none) and are hidden if no safe position exists.
function layoutDeskDecorations() {
  const stage = document.querySelector('.desk-stage');
  const layer = $('randomDecorations');
  if (!stage || !layer || $('deskPage').classList.contains('hidden')) return;
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const items = [...layer.querySelectorAll('.random-decor')];
  items.forEach(item => { item.style.visibility = 'hidden'; item.style.left = '0px'; item.style.top = '0px'; });
  const stageRect = stage.getBoundingClientRect();
  const reserved = [...stage.querySelectorAll('.letter-card, .reader-note, .desk-art')]
    .filter(el => el.offsetWidth && el.offsetHeight)
    .map(el => padRect(el.getBoundingClientRect(), 12));
  const placed = [];
  const maxItems = mobile ? 1 : 3;
  const shuffled = items.map(item => ({ item, sort: Math.random() })).sort((a,b) => a.sort-b.sort);
  let count = 0;
  for (const {item} of shuffled) {
    if (count >= maxItems) break;
    const w = item.getBoundingClientRect().width || 80;
    const h = item.getBoundingClientRect().height || 80;
    let found = false;
    for (let attempt = 0; attempt < 70; attempt++) {
      const x = 12 + Math.random() * Math.max(1, stageRect.width - w - 24);
      const y = 12 + Math.random() * Math.max(1, stageRect.height - h - 24);
      const candidate = {left: stageRect.left + x, top: stageRect.top + y, right: stageRect.left + x + w, bottom: stageRect.top + y + h};
      if (candidate.left < stageRect.left + 8 || candidate.right > stageRect.right - 8 || candidate.top < stageRect.top + 8 || candidate.bottom > stageRect.bottom - 8) continue;
      if (reserved.some(rect => overlaps(candidate, rect)) || placed.some(rect => overlaps(candidate, rect))) continue;
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.visibility = 'visible';
      placed.push(padRect(candidate, 8));
      found = true;
      break;
    }
    if (found) count++;
  }
}
function padRect(rect, padding) {
  return {left: rect.left-padding, top: rect.top-padding, right: rect.right+padding, bottom: rect.bottom+padding};
}
function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function burstHearts(card) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = card.getBoundingClientRect();
  const count = 12;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = ['♡', '♥', '♡', '✿'][i % 4];
    heart.setAttribute('aria-hidden', 'true');
    heart.style.left = `${rect.left + rect.width * (0.25 + Math.random() * 0.5)}px`;
    heart.style.top = `${rect.top + rect.height * (0.25 + Math.random() * 0.45)}px`;
    heart.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 150)}px`);
    heart.style.setProperty('--turn', `${Math.round((Math.random() - 0.5) * 90)}deg`);
    heart.style.setProperty('--duration', `${850 + Math.random() * 600}ms`);
    document.body.appendChild(heart);
    const timer = window.setTimeout(() => heart.remove(), 1600);
    heartTimers.push(timer);
  }
}
function renderLetter(index) {
  currentLetter = Math.max(0, Math.min(index, LETTERS.length - 1));
  const letter = LETTERS[currentLetter];
  $('paperDate').textContent = letter.date;
  $('paperTitle').textContent = letter.title;
  $('paperBody').textContent = letter.body;
  $('paperSignoff').textContent = letter.signoff;
  $('letterCount').textContent = `Letter ${currentLetter + 1} of ${LETTERS.length}`;
  $('prevLetter').disabled = currentLetter === 0;
  $('nextLetter').disabled = currentLetter === LETTERS.length - 1;
  zoom = 1;
  updateZoom();
  $('paperWindow').scrollTop = 0;
}
function openLetter(index, card) {
  previousFocus = card || document.activeElement;
  renderLetter(index);
  if (card) {
    card.classList.add('opening');
    const ribbon = card.querySelector('.cover-ribbon');
    if (ribbon) {
      ribbon.classList.add('ribbon-away');
      ribbon.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => { ribbon.style.visibility = 'hidden'; }, 420);
    }
    burstHearts(card);
  }
  window.setTimeout(() => {
    viewer.classList.remove('hidden');
    document.body.classList.add('viewer-open');
    $('closeLetter').focus();
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
}
function closeLetter() {
  viewer.classList.add('hidden');
  document.body.classList.remove('viewer-open');
  heartTimers.forEach(window.clearTimeout);
  heartTimers = [];
  document.querySelectorAll('.heart-particle').forEach(el => el.remove());
  if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
}
function updateZoom() {
  const paper = $('letterPaper');
  paper.style.setProperty('--paper-zoom', zoom);
  paper.style.transform = `scale(${zoom})`;
  paper.style.marginBottom = `${Math.max(0, paper.offsetHeight * (zoom - 1))}px`;
  $('zoomLabel').textContent = `${Math.round(zoom * 100)}%`;
}
cards.forEach(card => card.addEventListener('click', () => openLetter(Number(card.dataset.letter), card)));
$('closeLetter').addEventListener('click', closeLetter);
$('prevLetter').addEventListener('click', () => renderLetter(currentLetter - 1));
$('nextLetter').addEventListener('click', () => renderLetter(currentLetter + 1));
$('zoomIn').addEventListener('click', () => { zoom = Math.min(zoom + 0.1, 1.6); updateZoom(); });
$('zoomOut').addEventListener('click', () => { zoom = Math.max(zoom - 0.1, 0.8); updateZoom(); });
document.addEventListener('keydown', event => {
  if (viewer.classList.contains('hidden')) return;
  if (event.key === 'Escape') closeLetter();
  if (event.key === 'ArrowLeft' && currentLetter > 0) renderLetter(currentLetter - 1);
  if (event.key === 'ArrowRight' && currentLetter < LETTERS.length - 1) renderLetter(currentLetter + 1);
});
let deskLayoutFrame = 0;
window.addEventListener('resize', () => {
  if (!viewer.classList.contains('hidden')) updateZoom();
  window.cancelAnimationFrame(deskLayoutFrame);
  deskLayoutFrame = window.requestAnimationFrame(layoutDeskDecorations);
});
