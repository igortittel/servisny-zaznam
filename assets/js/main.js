/* ============================================================
   SERVISNÝ ZÁZNAM – main.js
   GSAP + ScrollTrigger animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---- Scroll Progress Bar ---- */
gsap.to('#sz-progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

/* ---- Nav: add shadow on scroll ---- */
ScrollTrigger.create({
  start: 60,
  onToggle: self => {
    document.getElementById('main-nav').classList.toggle('nav-scrolled', self.isActive);
  }
});

/* ---- Custom Cursor (desktop only) ---- */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.getElementById('c-cursor');
  const dot = document.getElementById('c-dot');
  gsap.set([cursor, dot], { opacity: 1 });

  document.addEventListener('mousemove', e => {
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05 });
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power2.out' });
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.8, duration: 0.25 }));
    el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.25 }));
  });

  document.addEventListener('mouseleave', () => gsap.to([cursor, dot], { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to([cursor, dot], { opacity: 1, duration: 0.3 }));
}

/* ---- Page Load Timeline ---- */
const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

loadTl
  .from('#main-nav', { y: -80, opacity: 0, duration: 0.8 }, 0)
  .from('.orb', { scale: 0, opacity: 0, duration: 2.2, stagger: 0.25, ease: 'power2.out' }, 0.1)
  .from('#hero-a .hero-badge', { scale: 0, opacity: 0, duration: 0.55, ease: 'back.out(2.5)' }, 0.52)
  .from('#hero-a .hero-title', { y: 52, opacity: 0, duration: 0.75 }, 0.67)
  .from('#hero-a .hero-desc', { y: 32, opacity: 0, duration: 0.65 }, 0.82)
  .from('#hero-a .hero-ctas > *', { y: 26, opacity: 0, stagger: 0.12, duration: 0.5 }, 0.96)
  .from('#hero-a .hero-trust > *', { y: 16, opacity: 0, stagger: 0.1, duration: 0.4 }, 1.12)
  .from('#hero-a .hero-visual', { x: 80, opacity: 0, duration: 1.0, ease: 'power2.out' }, 0.54);

/* ---- Hero Float (breathing animation) ---- */
gsap.to('.hero-float', {
  y: -12,
  duration: 3.2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

/* ---- Orb Parallax on scroll ---- */
gsap.to('.orb-a', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero-a',
    scrub: 2,
    start: 'top top',
    end: 'bottom top'
  }
});
gsap.to('.orb-b', {
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero-a',
    scrub: 2,
    start: 'top top',
    end: 'bottom top'
  }
});
gsap.to('.orb-c', {
  y: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero-a',
    scrub: 3,
    start: 'top top',
    end: 'bottom top'
  }
});

/* ---- Infinite Marquee ---- */
if (document.querySelector('.marquee-track')) {
  gsap.to('.marquee-track', {
    x: '-50%',
    duration: 24,
    ease: 'none',
    repeat: -1
  });
}

/* ---- Section Heading Reveals ---- */
gsap.utils.toArray('.section-head').forEach(el => {
  gsap.from(el, {
    y: 40, opacity: 0, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 86%' }
  });
});

/* ---- Benefit Cards (Funkcie) ---- */
gsap.utils.toArray('.feature-card').forEach((card, i) => {
  gsap.from(card, {
    y: 64, opacity: 0, scale: 0.96, duration: 0.75, ease: 'power3.out',
    delay: i * 0.1,
    clearProps: 'all',
    scrollTrigger: { trigger: '#funkcie', start: 'top 80%', once: true }
  });
});

/* ---- Pre Koho: green card + tag chips ---- */
gsap.from('.green-card', {
  y: 70, opacity: 0, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '#prekoho', start: 'top 82%' }
});
gsap.from('.tag-chip', {
  scale: 0, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'back.out(2)',
  scrollTrigger: { trigger: '#prekoho', start: 'top 72%' }
});

/* ---- Feature Detail Sections (left/right split reveal) ---- */
['feature-1', 'feature-2', 'feature-3'].forEach(id => {
  const textEl = document.getElementById(id + '-text');
  const visualEl = document.getElementById(id + '-visual');
  const trigger = document.getElementById(id);
  if (!textEl || !visualEl || !trigger) return;

  gsap.from(textEl, {
    x: -70, opacity: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger, start: 'top 78%' }
  });
  gsap.from(visualEl, {
    x: 70, opacity: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger, start: 'top 78%' }
  });
});

/* ---- How It Works Steps ---- */
gsap.from('.step-card', {
  y: 55, opacity: 0, stagger: 0.18, duration: 0.75, ease: 'power3.out',
  scrollTrigger: { trigger: '.how-section', start: 'top 80%' }
});

/* ---- Pricing Cards ---- */
gsap.from('.price-card', {
  y: 60, opacity: 0, stagger: 0.15, duration: 0.75, ease: 'power3.out',
  scrollTrigger: { trigger: '#cennik', start: 'top 80%' }
});

/* ---- Price Number Counter ---- */
const priceNums = document.querySelectorAll('.price-num');
const priceVals = [39, 49, 59];
ScrollTrigger.create({
  trigger: '#cennik',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    priceNums.forEach((el, i) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: priceVals[i],
        duration: 1.4,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); }
      });
    });
  }
});

/* ---- Testimonials ---- */
gsap.from('.testimonial-card', {
  y: 55, opacity: 0, scale: 0.97, stagger: 0.15, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '#referencie', start: 'top 82%' }
});

/* ---- Contact Section ---- */
gsap.from('.contact-text', {
  x: -60, opacity: 0, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '#kontakt', start: 'top 80%' }
});
gsap.from('.contact-form-wrap', {
  x: 60, opacity: 0, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '#kontakt', start: 'top 80%' }
});

/* ---- Footer Columns ---- */
gsap.from('.footer-col', {
  y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: 'footer', start: 'top 90%' }
});

/* ---- Modal Logic ---- */
function openModal(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  el.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  el.classList.remove('is-open');
  document.body.style.overflow = '';
}

function closeModalOverlay(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => {
      m.classList.remove('is-open');
    });
    document.body.style.overflow = '';
  }
});

function submitModalForm(e, id) {
  e.preventDefault();
  const btn = e.target.querySelector('.modal-submit');
  btn.textContent = 'Odoslané ✓';
  btn.classList.add('sent');
  btn.disabled = true;
  setTimeout(() => closeModal(id), 2200);
}

/* ---- Magnetic Buttons ---- */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.5)', overwrite: 'auto', clearProps: 'transform' });
  });
});

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type=submit]');
    btn.textContent = 'Odoslané ✓';
    btn.style.background = '#0C6E43';
    setTimeout(() => {
      btn.textContent = 'Odoslať';
      btn.style.background = '#11935A';
    }, 3000);
  });
}
