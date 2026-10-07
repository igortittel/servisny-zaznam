// Cookie Consent — lightweight, Google Consent Mode v2 compatible
// Store: localStorage key `szcc_consent` = { status: 'accepted' | 'rejected', ts: ISO }
// Default consent is set in <head> inline script BEFORE this file loads.
(function () {
  const STORAGE_KEY = 'szcc_consent';
  const EXPIRY_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');
  const reopenBtn = document.getElementById('cookieReopen');
  if (!banner || !acceptBtn || !rejectBtn) return;

  const readConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data?.ts) return null;
      if (Date.now() - new Date(data.ts).getTime() > EXPIRY_MS) return null;
      return data.status === 'accepted' || data.status === 'rejected' ? data.status : null;
    } catch { return null; }
  };

  const saveConsent = (status) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, ts: new Date().toISOString() }));
    } catch { /* storage disabled */ }
  };

  const applyConsent = (status) => {
    if (typeof window.gtag !== 'function') return;
    if (status === 'accepted') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    // Reject keeps the default 'denied' state — no update needed.
  };

  const showBanner = () => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('show'));
    if (reopenBtn) reopenBtn.hidden = true;
  };
  const hideBanner = () => {
    banner.classList.remove('show');
    setTimeout(() => { banner.hidden = true; }, 350);
    if (reopenBtn) reopenBtn.hidden = false;
  };

  acceptBtn.addEventListener('click', () => {
    saveConsent('accepted');
    applyConsent('accepted');
    hideBanner();
  });
  rejectBtn.addEventListener('click', () => {
    saveConsent('rejected');
    applyConsent('rejected');
    hideBanner();
  });
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      showBanner();
    });
  }

  const existing = readConsent();
  if (existing) {
    applyConsent(existing);
    if (reopenBtn) reopenBtn.hidden = false;
  } else {
    showBanner();
  }
})();
