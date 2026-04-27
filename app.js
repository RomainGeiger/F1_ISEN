(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPage = document.body.classList.contains('page-body');

  requestAnimationFrame(() => {
    document.body.classList.add('is-loaded');
  });

  setupReveal();
  setupTimelineSelection();
  setupHashHighlight();

  if (isPage) {
    setupReadingProgress();
    setupSectionHighlight();
  }

  function setupReveal() {
    const items = document.querySelectorAll(
      '.hero-copy, .hero-panel, .hub-panel, .section-shell, .track-card, .metric-card, .timeline-card, .info-card, .comparison-card, .video-card, .path-step, .footer-return, .stat-card'
    );

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px',
    });

    items.forEach((item, index) => {
      item.setAttribute('data-reveal', '');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 25, 180)}ms`);
      observer.observe(item);
    });
  }

  function setupReadingProgress() {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progress);

    const bar = progress.querySelector('.reading-progress-bar');
    const update = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollRange > 0 ? (window.scrollY / scrollRange) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(value, 100))}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function setupSectionHighlight() {
    const sections = document.querySelectorAll('.section-shell');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.35) {
          sections.forEach((section) => section.classList.remove('is-current'));
          entry.target.classList.add('is-current');
        }
      });
    }, {
      threshold: [0.35, 0.55],
    });

    sections.forEach((section) => observer.observe(section));
  }

  function setupTimelineSelection() {
    const cards = document.querySelectorAll('.timeline-card');
    if (!cards.length) return;

    const setActive = (card) => {
      cards.forEach((item) => item.classList.toggle('is-selected', item === card));
    };

    cards.forEach((card, index) => {
      card.tabIndex = 0;
      card.addEventListener('mouseenter', () => setActive(card));
      card.addEventListener('focus', () => setActive(card));
      if (index === 0) {
        setActive(card);
      }
    });
  }

  function setupHashHighlight() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    setTimeout(() => {
      target.classList.add('section-shell--target');
    }, 120);
  }
})();
