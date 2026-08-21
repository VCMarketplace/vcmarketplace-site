(() => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = '☰';
    });
  });

  document.querySelectorAll('details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('details[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set('.reveal', { opacity: 0, y: 34 });
    document.querySelectorAll('.reveal').forEach(el => {
      const delay = Number(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    gsap.from('.hero__content > *', {
      opacity: 0,
      y: 26,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.dashboard-wrap', {
      opacity: 0,
      y: 36,
      scale: 0.965,
      duration: 1.15,
      ease: 'power3.out',
      delay: 0.32
    });

    gsap.to('.dashboard', {
      y: -16,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1
      }
    });

    gsap.to('.float-card--a', { y: -12, x: 6, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.float-card--b', { y: 10, x: -5, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    gsap.to('.network__lines path', {
      strokeDashoffset: -100,
      duration: 8,
      repeat: -1,
      ease: 'none'
    });

    gsap.from('.network__column--left span', {
      opacity: 0,
      x: -26,
      stagger: 0.06,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.network', start: 'top 75%', once: true }
    });

    gsap.from('.network__column--right span', {
      opacity: 0,
      x: 26,
      stagger: 0.06,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.network', start: 'top 75%', once: true }
    });

    gsap.to('.process-line__progress', {
      width: '82%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-line',
        start: 'top 75%',
        end: 'bottom 65%',
        scrub: 1
      }
    });

    gsap.from('.process-line article > span', {
      scale: 0.45,
      opacity: 0,
      stagger: 0.12,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.process-line', start: 'top 70%', once: true }
    });

    gsap.to('.page-glow--top', {
      x: -130,
      y: 160,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
})();
