/* ============================================
   BioMedEng — script.js
   ============================================ */

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
        animateCounter(el);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ===== FLOW STEPS ANIMATION =====
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.querySelectorAll('.flow-step');
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add('visible');
        }, i * 120);
      });
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.case-flow').forEach(flow => stepObserver.observe(flow));

// ===== IMPACT BARS ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.ibar-fill').forEach((bar, i) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, i * 150 + 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const barSection = document.querySelector('.impact-bar-section');
if (barSection) barObserver.observe(barSection);

// ===== GENERIC FADE IN ON SCROLL =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Apply fade-in to cards
const fadeTargets = [
  '.problem-card',
  '.impact-card',
  '.team-card',
  '.pipe-node',
  '.collab-item'
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease`;
    fadeObserver.observe(el);
  });
});

// ===== SMOOTH SCROLL ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== PROBLEM CARDS → PROJECT LINK =====
document.querySelectorAll('.prob-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });

        // Highlight the card briefly
        target.style.borderColor = 'var(--accent)';
        target.style.boxShadow = '0 0 40px rgba(0, 200, 255, 0.15)';
        setTimeout(() => {
          target.style.borderColor = '';
          target.style.boxShadow = '';
          target.style.transition = 'border-color 1s ease, box-shadow 1s ease';
        }, 1500);
      }
    }
  });
});

// ===== SECTION HEADER ANIMATION =====
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim-in');
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header').forEach(h => {
  h.style.opacity = '0';
  h.style.transform = 'translateY(20px)';
  h.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  headerObserver.observe(h);
});

// Add CSS for anim-in
const style = document.createElement('style');
style.textContent = `.section-header.anim-in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ===== HEXA GRID HOVER EFFECT =====
document.querySelectorAll('.hexa').forEach((hexa, i) => {
  hexa.style.animationDelay = `${i * 0.1}s`;

  hexa.addEventListener('mouseenter', () => {
    document.querySelectorAll('.hexa').forEach(h => {
      if (h !== hexa) {
        h.style.opacity = '0.5';
      }
    });
  });

  hexa.addEventListener('mouseleave', () => {
    document.querySelectorAll('.hexa').forEach(h => {
      h.style.opacity = '1';
    });
  });
});

// ===== PROJECT CASE — STAGGER REVEAL =====
const caseObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      caseObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.project-case').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
  caseObserver.observe(el);
});

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

// ===== PERFORMANCE: Lazy hexagon animation =====
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const hexaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const hexas = document.querySelectorAll('.hexa');
      if (entry.isIntersecting) {
        hexas.forEach((h, i) => {
          h.style.animation = `hexaPulse ${3 + i * 0.5}s ease-in-out ${i * 0.2}s infinite`;
        });
      } else {
        hexas.forEach(h => { h.style.animation = 'none'; });
      }
    });
  });
  hexaObserver.observe(heroSection);
}

// Inject hexa animation keyframe
const hexaStyle = document.createElement('style');
hexaStyle.textContent = `
  @keyframes hexaPulse {
    0%, 100% { box-shadow: none; }
    50% { box-shadow: 0 0 16px rgba(0, 200, 255, 0.15); }
  }
`;
document.head.appendChild(hexaStyle);

console.log('%cBioMedEng | Engineering the Future of Medicine', 'color: #00c8ff; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%cBuilt with precision. Every pixel intentional.', 'color: #5a7a99; font-family: monospace; font-size: 11px;');
