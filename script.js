/* ============================================
   DRA. VALENTINA SORIA — script.js v3
   ============================================ */

'use strict';

/* ---- NAV scroll state ---- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- NAV mobile toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  const [s1, s2] = navToggle.querySelectorAll('span');
  s1.style.transform = '';
  s2.style.transform = '';
  s1.style.opacity   = '';
}

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  const [s1, s2] = navToggle.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'translateY(7.5px) rotate(45deg)';
    s2.style.transform = 'translateY(-1px) rotate(-45deg)';
  } else {
    closeMenu();
  }
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });

/* ---- Scroll animations ---- */
const animEls = document.querySelectorAll('[data-animate], [data-animate-delay]');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });
animEls.forEach(el => io.observe(el));

/* Stagger grid children */
[
  { sel: '.testimonials__grid', child: '.tcard' },
  { sel: '.benefits__right',    child: '.benefit-item' },
].forEach(({ sel, child }) => {
  const container = document.querySelector(sel);
  if (!container) return;
  container.querySelectorAll(child).forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    el.setAttribute('data-animate', '');
    io.observe(el);
  });
});

/* ---- FAQ accordion ---- */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-item__q');
  const ans = item.querySelector('.faq-item__a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-item__a').style.maxHeight = null;
      }
    });
    if (isOpen) {
      item.classList.remove('open');
      ans.style.maxHeight = null;
    } else {
      item.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  });
});
// Open first
if (faqItems.length) {
  faqItems[0].classList.add('open');
  const firstAns = faqItems[0].querySelector('.faq-item__a');
  firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
}

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function validateField(field) {
  const empty   = !field.value.trim();
  const badMail = field.type === 'email' && field.value && !isValidEmail(field.value);
  const invalid = (field.required && empty) || badMail;
  field.classList.toggle('error', invalid);
  return !invalid;
}

if (contactForm) {
  contactForm.querySelectorAll('input, textarea').forEach(f => {
    f.addEventListener('blur',  () => validateField(f));
    f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    const btn  = contactForm.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = orig;
      btn.disabled    = false;
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1200);
  });
}

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (nav?.offsetHeight ?? 66) + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

/* ---- WhatsApp fade in ---- */
const waBtn = document.getElementById('waBtn');
if (waBtn) {
  window.addEventListener('scroll', () => {
    waBtn.classList.toggle('visible', window.scrollY > 280);
  }, { passive: true });
}

/* ---- Nav toggle span transition styles ---- */
const s = document.createElement('style');
s.textContent = `.nav__toggle span { transition: transform .26s cubic-bezier(.4,0,.2,1), opacity .2s; transform-origin: center; }`;
document.head.appendChild(s);
