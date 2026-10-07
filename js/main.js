// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// =====================
// Dynamic Island Header
// =====================
const header = document.querySelector('.site-header');
const ISLAND_THRESHOLD = 80;
function updateHeaderState() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  header.classList.toggle('island', y > ISLAND_THRESHOLD);
}
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

// =====================
// Mobile Navigation
// =====================
const hamburger = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav-mobile');
const navMobileInner = document.querySelector('.nav-mobile-inner');

if (hamburger && navMobile) {
  let isOpen = false;
  let navTl = null;

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navMobile.classList.toggle('open', isOpen);
    if (navTl) navTl.kill();
    if (isOpen) {
      navTl = gsap.to(navMobile, { height: navMobileInner.scrollHeight, duration: 0.35, ease: 'power2.out' });
    } else {
      navTl = gsap.to(navMobile, { height: 0, duration: 0.28, ease: 'power2.in' });
    }
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (!isOpen) return;
      isOpen = false;
      hamburger.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
      if (navTl) navTl.kill();
      gsap.to(navMobile, { height: 0, duration: 0.22, ease: 'power2.in' });
    });
  });
}

// =====================
// Smooth Scroll
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = header ? header.offsetHeight : 0;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
  });
});

// =====================
// Implementation Modal
// =====================
const modalOverlay = document.querySelector('#implementaciaModal');
const modal = modalOverlay?.querySelector('.modal');
const modalCloseBtn = modalOverlay?.querySelector('.modal-close');
const implBtn = document.querySelector('.impl-btn');
let implOpen = false;

function openImplModal() {
  if (implOpen) return;
  implOpen = true;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  gsap.to(modal, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' });
}

function closeImplModal() {
  if (!implOpen) return;
  gsap.to(modal, { opacity: 0, scale: 0.96, y: 8, duration: 0.22, ease: 'power2.in', onComplete: () => {
    implOpen = false;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }});
}

implBtn?.addEventListener('click', openImplModal);
modalCloseBtn?.addEventListener('click', closeImplModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeImplModal(); });

// =====================
// Audience Popup
// =====================
const audData = {
  'kurenari': {
    title: 'Kurenári',
    desc: 'Spravujte servisy kotlov a vykurovacích systémov bez papierových protokolov. Záznam vyplníte za menej ako minútu — zákazník ho dostane e-mailom skôr, ako opustíte jeho dom.',
    icon: 'design/icons 2/kurenari.svg',
  },
  'klimatizeri': {
    title: 'Klimatizéri',
    desc: 'Sledujte termíny servisov klimatizácií a tepelných čerpadiel v jednom prehľade. Systém zákazníkovi sám pripomenie ďalší servis — vy len príjmete objednávku.',
    icon: 'design/icons 2/klimatizeri.svg',
  },
  'revizni-technici': {
    title: 'Revízni technici',
    desc: 'Generujte revízne správy digitálne priamo na mieste. Zákazník dostane podpísaný protokol okamžite na e-mail. Termíny ďalších revízií sleduje systém za vás.',
    icon: 'design/icons 2/revizni-technici.svg',
  },
  'servisne-firmy': {
    title: 'Celé servisné firmy',
    desc: 'Jeden systém pre celý tím. Každý technik má vlastný prístup, záznamy a podpis. Spoločná firemná databáza zákazníkov je dostupná pre všetkých. Prémiová podpora zahrnutá.',
    icon: 'design/icons 2/servisne-firmy.svg',
  },
};

const audOverlay = document.querySelector('#audPopup');
const audPopup = audOverlay?.querySelector('.aud-popup');
const audClose = audOverlay?.querySelector('.aud-close');
const audIcon = document.querySelector('#audIcon');
const audTitle = document.querySelector('#audTitle');
const audDesc = document.querySelector('#audDesc');
const audCta = audOverlay?.querySelector('.aud-cta');
let audOpen = false;

function openAudPopup(key) {
  const d = audData[key];
  if (!d || audOpen) return;
  audOpen = true;
  audIcon.src = d.icon;
  audTitle.textContent = d.title;
  audDesc.textContent = d.desc;
  audOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  gsap.to(audPopup, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.6)' });
}

function closeAudPopup() {
  if (!audOpen) return;
  gsap.to(audPopup, { opacity: 0, scale: 0.94, y: 12, duration: 0.22, ease: 'power2.in', onComplete: () => {
    audOpen = false;
    audOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }});
}

document.querySelectorAll('.audience-card[data-popup]').forEach(card => {
  card.addEventListener('click', () => openAudPopup(card.dataset.popup));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAudPopup(card.dataset.popup); }});
});

audClose?.addEventListener('click', closeAudPopup);
audOverlay?.addEventListener('click', e => { if (e.target === audOverlay) closeAudPopup(); });

audCta?.addEventListener('click', closeAudPopup);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (audOpen) closeAudPopup();
    if (implOpen) closeImplModal();
  }
});

// =====================
// HERO Entrance + Lottie
// =====================
const heroItems = document.querySelectorAll('.hero-animate');
if (heroItems.length) {
  gsap.fromTo(heroItems,
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
  );
}

// Hero service-record animation — 10s rAF loop
const hsrRoot = document.getElementById('hsrRoot');
if (hsrRoot) {
  const T = {
    nameStart: 450, nameEnd: 950,
    deviceStart: 1100, deviceEnd: 2200,
    checksStart: 2500, checkStep: 450,
    part: 5200, stamp: 5700, send: 6700,
    email: 7150, sms: 7700,
    fadeOut: 9500, total: 10000,
  };
  const STILL_AT = T.send - 1;
  const COPY_NAME = 'Ján Novák';
  const COPY_DEVICE = 'Buderus Logamax Plus GB112-29';

  const el = {
    stage:      hsrRoot.querySelector('[data-hsr-stage]'),
    card:       hsrRoot.querySelector('[data-hsr-card]'),
    name:       hsrRoot.querySelector('[data-hsr-name]'),
    device:     hsrRoot.querySelector('[data-hsr-device]'),
    caretName:  hsrRoot.querySelector('[data-hsr-caret-name]'),
    caretDev:   hsrRoot.querySelector('[data-hsr-caret-device]'),
    tasks:      Array.from(hsrRoot.querySelectorAll('[data-hsr-tasks] > li')),
    part:       hsrRoot.querySelector('[data-hsr-part]'),
    stamp:      hsrRoot.querySelector('[data-hsr-stamp]'),
    email:      hsrRoot.querySelector('[data-hsr-email]'),
    sms:        hsrRoot.querySelector('[data-hsr-sms]'),
    days:       hsrRoot.querySelector('[data-hsr-days]'),
  };

  const clamp01 = v => Math.min(1, Math.max(0, v));
  const progress = (t, a, b) => clamp01((t - a) / (b - a));
  const typed = (str, t, a, b) => {
    const chars = Array.from(str);
    return chars.slice(0, Math.round(progress(t, a, b) * chars.length)).join('');
  };

  const prev = {
    name: '__init__', device: '__init__',
    typingName: null, typingDev: null,
    checked: new Array(el.tasks.length).fill(null),
    part: null, stamp: null, sent: null,
    email: null, sms: null, fading: null, days: -1,
  };

  function applyFrame(t, still) {
    const name   = typed(COPY_NAME,   t, T.nameStart,   T.nameEnd);
    const device = typed(COPY_DEVICE, t, T.deviceStart, T.deviceEnd);
    const typingName = !still && t >= T.nameStart   && t < T.nameEnd   + 150;
    const typingDev  = !still && t >= T.deviceStart && t < T.deviceEnd + 250;

    if (name   !== prev.name)   { el.name.textContent   = still ? COPY_NAME   : (name   || ' '); prev.name   = name; }
    if (device !== prev.device) { el.device.textContent = still ? COPY_DEVICE : (device || ' '); prev.device = device; }
    if (typingName !== prev.typingName) { el.caretName.hidden = !typingName; prev.typingName = typingName; }
    if (typingDev  !== prev.typingDev)  { el.caretDev.hidden  = !typingDev;  prev.typingDev  = typingDev; }

    for (let i = 0; i < el.tasks.length; i++) {
      const checked = still ? true : (t >= T.checksStart + i * T.checkStep);
      if (checked !== prev.checked[i]) {
        el.tasks[i].classList.toggle('is-checked', checked);
        prev.checked[i] = checked;
      }
    }

    const part   = still ? true  : (t >= T.part);
    const stamp  = still ? true  : (t >= T.stamp);
    const sent   = still ? false : (t >= T.send);
    const email  = still ? false : (t >= T.email);
    const sms    = still ? false : (t >= T.sms);
    const fading = still ? false : (t >= T.fadeOut);

    if (part   !== prev.part)   { el.part .classList.toggle('is-shown', part);   prev.part   = part;   }
    if (stamp  !== prev.stamp)  { el.stamp.classList.toggle('is-shown', stamp);  prev.stamp  = stamp;  }
    if (sent   !== prev.sent)   { el.card .classList.toggle('is-sent',  sent);   prev.sent   = sent;   }
    if (email  !== prev.email)  { el.email.classList.toggle('is-shown', email);  prev.email  = email;  }
    if (sms    !== prev.sms)    { el.sms  .classList.toggle('is-shown', sms);    prev.sms    = sms;    }
    if (fading !== prev.fading) { el.stage.classList.toggle('is-fading', fading); prev.fading = fading; }

    const days = still ? 30 : Math.round(45 - 15 * progress(t, T.sms + 350, T.sms + 1250));
    if (days !== prev.days) { el.days.textContent = days; prev.days = days; }
  }

  function resetToStart() {
    // Force all prev values to opposite so applyFrame(0) writes empty state
    prev.name = prev.device = '__force__';
    prev.typingName = prev.typingDev = true;
    prev.checked = prev.checked.map(() => true);
    prev.part = prev.stamp = true;
    prev.sent = prev.email = prev.sms = prev.fading = true;
    prev.days = -1;
    applyFrame(0, false);
    // After writing empty state, sent/email/sms/fading will be false — correct.
  }

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mq.matches) {
    applyFrame(STILL_AT, true);
  } else {
    resetToStart();

    let active = false;
    let timeRef = 0;
    let last = 0;
    let lastCommit = 0;
    let raf = 0;

    function loop(now) {
      if (!active) { raf = 0; return; }
      const delta = Math.min(now - last, 100);
      last = now;
      const next = timeRef + delta;
      if (next >= T.total) {
        timeRef = 0;
        resetToStart();
        lastCommit = now;
      } else {
        timeRef = next;
        if (now - lastCommit > 33) {
          applyFrame(timeRef, false);
          lastCommit = now;
        }
      }
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      const vis = e.isIntersecting && e.intersectionRatio >= 0.3;
      if (vis && !active) {
        active = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!vis && active) {
        active = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    }, { threshold: [0, 0.3, 1] });
    io.observe(hsrRoot);

    // Respect runtime toggle of reduced-motion preference
    const mqHandler = (e) => {
      if (e.matches) {
        active = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        applyFrame(STILL_AT, true);
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', mqHandler);
    else mq.addListener(mqHandler);
  }
}

// =====================
// EQUIPMENT — Click toggle (non-ScrollTrigger, always active)
// =====================
const equipGrid = document.querySelector('.equipment-grid');
if (equipGrid) {
  const isTouch = window.matchMedia('(hover: none)').matches;
  equipGrid.querySelectorAll('.equipment-item').forEach(item => {
    item.addEventListener('click', () => {
      if (!isTouch) return;
      const wasActive = item.classList.contains('active');
      equipGrid.querySelectorAll('.equipment-item.active').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-expanded', 'false');
      });
      if (!wasActive) {
        item.classList.add('active');
        item.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// =====================
// Scroll-reveal helpers (variants: fade-up | slide-left | slide-right | zoom | scale)
// =====================
function scrollReveal(selector, options = {}) {
  const {
    variant = 'fade-up',
    y = 32, x = 40, scale = 0.94,
    duration = 0.7, delay = 0, ease = 'power3.out',
    start = 'top 86%',
  } = options;

  let fromVars = { opacity: 0 };
  if (variant === 'fade-up')     fromVars.y = y;
  if (variant === 'slide-left')  fromVars.x = -x;
  if (variant === 'slide-right') fromVars.x = x;
  if (variant === 'zoom')        { fromVars.scale = scale; fromVars.y = 16; }
  if (variant === 'scale')       fromVars.scale = scale;

  document.querySelectorAll(selector).forEach(el => {
    gsap.fromTo(el, fromVars,
      {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration, ease, delay,
        scrollTrigger: { trigger: el, start, once: true },
      }
    );
  });
}

function scrollStagger(containerSel, childSel, options = {}) {
  const {
    variant = 'fade-up',
    y = 28, x = 40, scale = 0.94,
    duration = 0.6, stagger = 0.1, ease = 'power2.out',
    start = 'top 85%',
  } = options;

  let fromVars = { opacity: 0 };
  if (variant === 'fade-up')     fromVars.y = y;
  if (variant === 'slide-left')  fromVars.x = -x;
  if (variant === 'slide-right') fromVars.x = x;
  if (variant === 'zoom')        { fromVars.scale = scale; fromVars.y = 16; }
  if (variant === 'scale')       fromVars.scale = scale;

  document.querySelectorAll(containerSel).forEach(container => {
    const children = container.querySelectorAll(childSel);
    if (!children.length) return;
    gsap.fromTo(children, fromVars,
      {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration, stagger, ease,
        scrollTrigger: { trigger: container, start, once: true },
      }
    );
  });
}

function scrollFade(sel, opts = {}) { scrollReveal(sel, opts); }

// Pre-hide the reveal-targets so the "flash of visible content" doesn't happen
// while we wait for Lottie/window.load. GSAP fromTo would set opacity later, but
// setting instantly here prevents any FOUC.
const revealTargets = [
  '.feat-stack-card',
  '.equipment-grid .equipment-item',
  '.benefit-item .benefit-num, .benefit-item .benefit-body',
  '.equipment-intro .eyebrow, .equipment-intro h2, .equipment-hint',
  '.audience-intro .eyebrow, .audience-intro h2, .audience-intro .section-lead',
  '.extra-benefits-intro h2',
  '.feat-stack-intro .eyebrow, .feat-stack-intro h2',
  '.process-intro .eyebrow, .process-intro h2, .process-steps .process-step',
  '.pricing-intro .eyebrow, .pricing-intro h2, .pricing-intro .section-lead, .pricing-grid .pricing-card',
  '.testimonials-intro .eyebrow, .testimonials-intro h2, .testimonials-grid .testimonial-card',
  '.custom-solution h2, .custom-solution .section-lead, .custom-solution .btn',
  '.contact-info .eyebrow, .contact-info h2, .contact-info p, .contact-info .contact-detail',
  '.contact-inner .form-group, .contact-inner .form-gdpr, .contact-inner .form-submit',
  '.audience-grid .audience-card',
];
gsap.set(revealTargets.join(', '), { opacity: 0 });

// =====================
// Deferred scroll-animation init — waits for Lottie/window.load
// so ScrollTrigger positions are calculated on final layout.
// =====================
let scrollInitDone = false;
function initScrollAnimations() {
  if (scrollInitDone) return;
  scrollInitDone = true;

  // FEATURES — stacked cards entrance (CSS position:sticky does the stacking)
  document.querySelectorAll('.feat-stack-card').forEach(card => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      }
    );
  });

  // EQUIPMENT — pop-in stagger
  if (equipGrid) {
    gsap.fromTo(equipGrid.querySelectorAll('.equipment-item'),
      { opacity: 0, scale: 0.9, y: 20 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.5, stagger: 0.07, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: equipGrid, start: 'top 82%', once: true },
      }
    );
  }

  // BENEFITS — alternating slide
  document.querySelectorAll('.benefit-item').forEach(item => {
    const num = item.querySelector('.benefit-num');
    const body = item.querySelector('.benefit-body');
    if (num) {
      gsap.fromTo(num, { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true } });
    }
    if (body) {
      gsap.fromTo(body, { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true } });
    }
  });

  // Section heading reveals with directional variety
  scrollReveal('.equipment-intro .eyebrow', { variant: 'slide-left', duration: 0.6 });
  scrollReveal('.equipment-intro h2', { variant: 'zoom', duration: 0.75 });
  scrollReveal('.equipment-hint', { variant: 'fade-up', delay: 0.15, duration: 0.55 });

  scrollReveal('.audience-intro .eyebrow', { variant: 'slide-left' });
  scrollReveal('.audience-intro h2', { variant: 'zoom' });
  scrollReveal('.audience-intro .section-lead', { variant: 'fade-up', delay: 0.1 });

  scrollReveal('.extra-benefits-intro h2', { variant: 'zoom' });

  scrollReveal('.feat-stack-intro .eyebrow', { variant: 'slide-left' });
  scrollReveal('.feat-stack-intro h2', { variant: 'zoom' });

  scrollReveal('.process-intro .eyebrow', { variant: 'slide-left' });
  scrollReveal('.process-intro h2', { variant: 'zoom' });
  scrollStagger('.process-steps', '.process-step', { stagger: 0.12, y: 28 });

  scrollReveal('.pricing-intro .eyebrow', { variant: 'slide-left' });
  scrollReveal('.pricing-intro h2', { variant: 'zoom' });
  scrollReveal('.pricing-intro .section-lead', { variant: 'fade-up', delay: 0.1 });
  scrollStagger('.pricing-grid', '.pricing-card', { variant: 'zoom', stagger: 0.12, scale: 0.92, duration: 0.7 });

  scrollReveal('.testimonials-intro .eyebrow', { variant: 'slide-left' });
  scrollReveal('.testimonials-intro h2', { variant: 'zoom' });
  scrollStagger('.testimonials-grid', '.testimonial-card', { variant: 'zoom', stagger: 0.14, scale: 0.94, duration: 0.65 });

  scrollReveal('.custom-solution h2', { variant: 'zoom', duration: 0.8 });
  scrollReveal('.custom-solution .section-lead', { variant: 'fade-up', delay: 0.15 });
  scrollReveal('.custom-solution .btn', { variant: 'scale', delay: 0.3, duration: 0.55, ease: 'back.out(1.6)' });

  scrollReveal('.contact-info .eyebrow', { variant: 'slide-left' });
  scrollReveal('.contact-info h2', { variant: 'zoom' });
  scrollReveal('.contact-info p', { variant: 'fade-up', delay: 0.1 });
  scrollReveal('.contact-info .contact-detail', { variant: 'fade-up', delay: 0.2 });

  scrollStagger('.contact-inner', '.form-group, .form-gdpr, .form-submit', {
    variant: 'slide-right', x: 30, stagger: 0.08, duration: 0.55, start: 'top 80%',
  });

  // Alternating audience card directions
  document.querySelectorAll('.audience-grid .audience-card').forEach((card, i) => {
    const dir = (i % 2 === 0) ? -1 : 1;
    gsap.fromTo(card,
      { opacity: 0, x: 40 * dir, scale: 0.96 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 0.65, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      }
    );
  });

  // Ensure ScrollTrigger positions are calibrated to the current layout
  ScrollTrigger.refresh();
}

function scheduleScrollInit() {
  if (scrollInitDone) return;
  requestAnimationFrame(() => setTimeout(initScrollAnimations, 50));
}

// Fire the scroll-animation setup once the window has fully loaded so
// ScrollTrigger positions are calculated on final layout. The service-record
// hero mounts synchronously, so no extra gating is needed.
if (document.readyState === 'complete') {
  scheduleScrollInit();
} else {
  window.addEventListener('load', scheduleScrollInit);
}
// Safety net: unblock after 1.5s even if load never fires
setTimeout(scheduleScrollInit, 1500);

// Refresh trigger positions on resize / orientation change (mobile URL bar toggle)
let refreshRAF;
window.addEventListener('resize', () => {
  cancelAnimationFrame(refreshRAF);
  refreshRAF = requestAnimationFrame(() => ScrollTrigger.refresh());
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => ScrollTrigger.refresh(), 200);
});

// =====================
// Contact Form — Resend
// =====================
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('[type="submit"]');
  const messageEl = contactForm.querySelector('.form-message');
  const gdprCheck = contactForm.querySelector('#gdprCheck');
  const tStartEl = contactForm.querySelector('#formTStart');
  if (tStartEl) tStartEl.value = String(Date.now());

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!gdprCheck.checked) {
      showMsg('error', 'Prosím, potvrďte súhlas so spracovaním osobných údajov.');
      return;
    }
    const data = {
      meno: contactForm.meno.value.trim(),
      priezvisko: contactForm.priezvisko.value.trim(),
      email: contactForm.email.value.trim(),
      telefon: contactForm.telefon.value.trim(),
      spolocnost: contactForm.spolocnost?.value.trim() || '',
      poznamka: contactForm.poznamka?.value.trim() || '',
      website: contactForm.website?.value || '',
      t_start: tStartEl?.value || '',
    };
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = 'Odosielam…';
    hideMsg();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showMsg('success', 'Správa odoslaná. Ozveme sa vám čo najskôr.');
        contactForm.reset();
      } else {
        showMsg('error', json.error || 'Nastala chyba. Skúste neskôr.');
      }
    } catch {
      showMsg('error', 'Chyba sieťového spojenia. Skúste prosím neskôr.');
    } finally {
      submitBtn.classList.remove('btn-loading');
      submitBtn.textContent = 'Odoslať';
    }
  });

  function showMsg(type, text) {
    messageEl.textContent = text;
    messageEl.className = `form-message show ${type}`;
  }
  function hideMsg() {
    messageEl.className = 'form-message';
    messageEl.textContent = '';
  }
}

// =====================
// Pricing accordion (mobile only)
// =====================
const pricingMM = gsap.matchMedia();
pricingMM.add('(max-width: 767px)', () => {
  const cards = document.querySelectorAll('.pricing-card[data-collapsible]');
  const handlers = [];
  cards.forEach(card => {
    const header = card.querySelector('.pricing-header');
    if (!header) return;
    // Populárnu kartu otvor default
    if (card.classList.contains('popular')) {
      card.classList.add('expanded');
      header.setAttribute('aria-expanded', 'true');
    }
    const onClick = () => {
      const expanded = card.classList.toggle('expanded');
      header.setAttribute('aria-expanded', String(expanded));
    };
    header.addEventListener('click', onClick);
    handlers.push({ header, onClick });
  });
  return () => {
    handlers.forEach(({ header, onClick }) => header.removeEventListener('click', onClick));
    cards.forEach(c => {
      c.classList.remove('expanded');
      const h = c.querySelector('.pricing-header');
      if (h) h.setAttribute('aria-expanded', 'false');
    });
  };
});

// =====================
// Service Worker registration
// =====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}
