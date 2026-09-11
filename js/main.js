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

// Lottie hero animation
const heroLottieEl = document.getElementById('heroLottie');
if (heroLottieEl && window.lottie) {
  lottie.loadAnimation({
    container: heroLottieEl,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'design/Smartphones Applications.json',
  });
}

// =====================
// FEATURES — Stacked Cards (Sketchzlab-style, sticky handled by CSS)
// =====================
const stackCards = document.querySelectorAll('.feat-stack-card');
if (stackCards.length) {
  // Unified fade-up entrance on all viewports; CSS position:sticky handles stacking
  stackCards.forEach(card => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      }
    );
  });
}

// =====================
// EQUIPMENT — Fade-up stagger + brand toggle (mobile click)
// =====================
const equipGrid = document.querySelector('.equipment-grid');
if (equipGrid) {
  gsap.fromTo(equipGrid.querySelectorAll('.equipment-item'),
    { opacity: 0, scale: 0.9, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: equipGrid,
        start: 'top 82%',
        once: true,
      },
    }
  );

  // Click toggle (mobile-friendly); on desktop CSS hover handles it
  const isTouch = window.matchMedia('(hover: none)').matches;
  equipGrid.querySelectorAll('.equipment-item').forEach(item => {
    item.addEventListener('click', () => {
      if (!isTouch) return; // desktop uses hover
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

// Audience cards animate via alternating slide (defined below in reveal section)

// =====================
// BENEFITS — Alternating slide in
// =====================
document.querySelectorAll('.benefit-item').forEach((item, i) => {
  const num = item.querySelector('.benefit-num');
  const body = item.querySelector('.benefit-body');

  if (num) {
    gsap.fromTo(num,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      }
    );
  }

  if (body) {
    gsap.fromTo(body,
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        delay: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      }
    );
  }
});

// =====================
// SECTION Scroll Reveals (variants: fade-up | slide-left | slide-right | zoom | scale)
// =====================
function scrollReveal(selector, options = {}) {
  const {
    variant = 'fade-up',
    y = 32, x = 40, scale = 0.94,
    duration = 0.7, delay = 0, ease = 'power3.out',
    start = 'top 86%',
  } = options;

  let fromVars = { opacity: 0 };
  if (variant === 'fade-up')    fromVars.y = y;
  if (variant === 'slide-left') fromVars.x = -x;
  if (variant === 'slide-right') fromVars.x = x;
  if (variant === 'zoom')       { fromVars.scale = scale; fromVars.y = 16; }
  if (variant === 'scale')      fromVars.scale = scale;

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
  if (variant === 'fade-up') fromVars.y = y;
  if (variant === 'slide-left') fromVars.x = -x;
  if (variant === 'slide-right') fromVars.x = x;
  if (variant === 'zoom') { fromVars.scale = scale; fromVars.y = 16; }
  if (variant === 'scale') fromVars.scale = scale;

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

// Backward-compat shim
function scrollFade(sel, opts = {}) { scrollReveal(sel, opts); }

// Reveal each section's heading pieces with directional variety:
// eyebrow slides from left, h2 zooms in, lead/paragraph fades up.

// Equipment section
scrollReveal('.equipment-intro .eyebrow', { variant: 'slide-left', duration: 0.6 });
scrollReveal('.equipment-intro h2', { variant: 'zoom', duration: 0.75 });
scrollReveal('.equipment-hint', { variant: 'fade-up', delay: 0.15, duration: 0.55 });

// Audience section — heading pieces
scrollReveal('.audience-intro .eyebrow', { variant: 'slide-left' });
scrollReveal('.audience-intro h2', { variant: 'zoom' });
scrollReveal('.audience-intro .section-lead', { variant: 'fade-up', delay: 0.1 });

// Extra benefits heading
scrollReveal('.extra-benefits-intro h2', { variant: 'zoom' });

// Feature stack intro
scrollReveal('.feat-stack-intro .eyebrow', { variant: 'slide-left' });
scrollReveal('.feat-stack-intro h2', { variant: 'zoom' });

// Process
scrollReveal('.process-intro .eyebrow', { variant: 'slide-left' });
scrollReveal('.process-intro h2', { variant: 'zoom' });
scrollStagger('.process-steps', '.process-step', { stagger: 0.12, y: 28 });

// Pricing — prominent scale + stagger
scrollReveal('.pricing-intro .eyebrow', { variant: 'slide-left' });
scrollReveal('.pricing-intro h2', { variant: 'zoom' });
scrollReveal('.pricing-intro .section-lead', { variant: 'fade-up', delay: 0.1 });
scrollStagger('.pricing-grid', '.pricing-card', { variant: 'zoom', stagger: 0.12, scale: 0.92, duration: 0.7 });

// Testimonials — slide from bottom w/ slight scale
scrollReveal('.testimonials-intro .eyebrow', { variant: 'slide-left' });
scrollReveal('.testimonials-intro h2', { variant: 'zoom' });
scrollStagger('.testimonials-grid', '.testimonial-card', { variant: 'zoom', stagger: 0.14, scale: 0.94, duration: 0.65 });

// Custom solution — dramatic entrance
scrollReveal('.custom-solution h2', { variant: 'zoom', duration: 0.8 });
scrollReveal('.custom-solution .section-lead', { variant: 'fade-up', delay: 0.15 });
scrollReveal('.custom-solution .btn', { variant: 'scale', delay: 0.3, duration: 0.55, ease: 'back.out(1.6)' });

// Contact
scrollReveal('.contact-info .eyebrow', { variant: 'slide-left' });
scrollReveal('.contact-info h2', { variant: 'zoom' });
scrollReveal('.contact-info p', { variant: 'fade-up', delay: 0.1 });
scrollReveal('.contact-info .contact-detail', { variant: 'fade-up', delay: 0.2 });

// Contact form fields — stagger from right
scrollStagger('.contact-inner', '.form-group, .form-gdpr, .form-submit', {
  variant: 'slide-right', x: 30, stagger: 0.08, duration: 0.55, start: 'top 80%',
});

// Equipment cards intro-into-view — extend existing (already in main flow but add rotation feel)
// (Existing equipment-item stagger stays — see EQUIPMENT block above.)

// Alternating audience card directions
document.querySelectorAll('.audience-grid .audience-card').forEach((card, i) => {
  const dir = (i % 2 === 0) ? -1 : 1;
  gsap.fromTo(card,
    { opacity: 0, x: 40 * dir, scale: 0.96 },
    {
      opacity: 1, x: 0, scale: 1,
      duration: 0.65,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    }
  );
});

// =====================
// Contact Form — Resend
// =====================
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('[type="submit"]');
  const messageEl = contactForm.querySelector('.form-message');
  const gdprCheck = contactForm.querySelector('#gdprCheck');

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
