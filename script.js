(() => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const progress = document.querySelector('.scroll-progress span');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };

  updateHeader();
  updateProgress();
  window.addEventListener('scroll', () => {
    updateHeader();
    updateProgress();
  }, { passive: true });

  const setMenuState = open => {
    navMenu?.classList.toggle('active', open);
    menuToggle?.classList.toggle('is-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  menuToggle?.addEventListener('click', () => {
    setMenuState(!navMenu.classList.contains('active'));
  });

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', event => {
    if (!navMenu?.classList.contains('active')) return;
    if (navMenu.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuState(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) setMenuState(false);
  });

  document.querySelectorAll('details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('details[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });

  // Light follows the pointer inside service cards.
  document.querySelectorAll('.solution-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  // Subtle premium tilt for case cards on pointer devices.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 2.6;
        const ry = (x - 0.5) * 3.2;
        card.style.setProperty('--case-x', `${x * 100}%`);
        card.style.setProperty('--case-y', `${y * 100}%`);
        card.style.transform = `perspective(1300px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);

  const formatNumber = (value, mode) => {
    if (mode === 'integer') return Math.round(value).toLocaleString('pt-BR');
    return Math.round(value).toLocaleString('pt-BR');
  };

  if (!prefersReducedMotion && hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Generic reveals are scroll based, but the hero visual is intentionally handled separately
    // to avoid the blank-right-side race condition from the previous build.
    gsap.set('.reveal', { opacity: 0, y: 34 });
    document.querySelectorAll('.reveal').forEach(el => {
      const delay = Number(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-animate', { opacity: 0, y: 28, duration: 0.86, stagger: 0.09, delay: 0.08 })
      .from('.hero-visual', { opacity: 0, y: 38, scale: 0.955, duration: 1.05 }, '-=0.62')
      .from('.dashboard__metrics article', { opacity: 0, y: 15, duration: 0.5, stagger: 0.06 }, '-=0.48')
      .from('.float-card', { opacity: 0, y: 14, scale: 0.94, duration: 0.55, stagger: 0.09 }, '-=0.3');

    // Draw the hero chart once the dashboard settles.
    gsap.fromTo('.chart-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: 0.82 });
    gsap.from('.chart-area', { opacity: 0, duration: 1.1, delay: 1.15 });
    gsap.from('.chart-point', { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.45, ease: 'back.out(2)', delay: 1.85 });
    gsap.from('.chart-tooltip', { opacity: 0, y: 8, duration: 0.45, delay: 1.92 });

    // Count dashboard KPIs once, on load.
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const mode = el.dataset.format || '';
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.4,
        delay: 0.62,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = `${prefix}${formatNumber(state.value, mode)}${suffix}`; }
      });
    });

    // The hero visual drifts instead of simply fading out, preserving continuity.
    gsap.to('.dashboard', {
      y: -28,
      rotateX: 1.4,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 }
    });
    gsap.to('.hero__content', {
      y: -16,
      opacity: 0.82,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.float-card--a', { y: -11, x: 5, duration: 2.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.float-card--b', { y: 10, x: -5, duration: 3.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.float-card--c', { y: -8, x: -3, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Problem -> solution connection animation tied to scroll.
    gsap.set('.network__lines path', { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.45 });
    const networkTl = gsap.timeline({
      scrollTrigger: { trigger: '.system-map', start: 'top 72%', end: 'bottom 48%', scrub: 1 }
    });
    networkTl
      .to('.network__lines path', { strokeDashoffset: 0, opacity: 0.88, duration: 1, stagger: 0.025 }, 0)
      .from('.network__column--left span', { opacity: 0.2, x: -18, duration: 0.55, stagger: 0.04 }, 0)
      .from('.network__column--right span', { opacity: 0.15, x: 18, duration: 0.55, stagger: 0.04 }, 0.28)
      .from('.network__hub', { scale: 0.72, filter: 'brightness(.7)', duration: 0.55 }, 0.35)
      .to('.network__pulse', { opacity: 1, scale: 2.2, duration: 0.7 }, 0.48)
      .to('.network__pulse', { opacity: 0, scale: 2.8, duration: 0.5 }, 0.72);

    // Story headline breathes slightly while the map enters.
    gsap.to('.story__intro', {
      y: -28,
      ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: '45% top', scrub: 1 }
    });

    // Process line now lights up the individual steps as the user scrolls.
    gsap.to('.process-line__progress', {
      width: '82%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-line',
        start: 'top 78%',
        end: 'bottom 58%',
        scrub: 1,
        onUpdate: self => {
          const articles = [...document.querySelectorAll('.process-line article')];
          const activeCount = Math.max(1, Math.ceil(self.progress * articles.length));
          articles.forEach((article, index) => article.classList.toggle('is-active', index < activeCount));
        }
      }
    });

    gsap.from('.process-line article', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.process-line', start: 'top 78%', once: true }
    });

    // Cases enter with a more editorial, Maven-like reveal.
    document.querySelectorAll('.case-card').forEach((card, index) => {
      gsap.from(card.querySelector('.case-card__image img'), {
        scale: 1.12,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 83%', once: true }
      });
      gsap.from(card.querySelectorAll('.case-card__body > *'), {
        opacity: 0,
        y: 16,
        duration: 0.58,
        stagger: 0.055,
        delay: index * 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 80%', once: true }
      });
    });

    gsap.to('.page-glow--top', {
      x: -140,
      y: 170,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }
    });

    ScrollTrigger.refresh();
  } else {
    document.querySelectorAll('.reveal,.hero-animate,.hero-visual').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
})();
