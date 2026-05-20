

/* --- LOADING SCREEN (dont touch this ha) --- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 900);
});

/* --- NAVBAR SCROLL EFFECT --- */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar glass effect on scroll
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }

  // Show/hide scroll-to-top button 
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', scrollY > 400);
  }

  // Trigger reveal animations
  revealOnScroll();
});

/* --- SCROLL TO TOP --- */
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- MOBILE HAMBURGER MENU --- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* --- ACTIVE NAV LINK HIGHLIGHTING --- */
function setActiveNav() {
  const path = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    // Match current page
    if (
      (path.endsWith('index.html') || path === '/' || path.endsWith('/')) && href === 'index.html'
    ) {
      link.classList.add('active');
    } else if (href !== 'index.html' && path.includes(href)) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

/* --- SCROLL REVEAL ANIMATION --- */
function revealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal, .anatomy-block');
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.88;
    if (rect.top < triggerPoint) {
      el.classList.add('visible');
      // Trigger progress bars inside revealed elements
      el.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || '0%';
      });
    }
  });

  // Animated counters
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && !el.dataset.counted) {
      el.dataset.counted = 'true';
      animateCounter(el);
    }
  });
}

// Run once on page load
revealOnScroll();

/* --- ANIMATED COUNTER --- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;
  let start = null;

  function update(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + (isFloat ? current.toFixed(decimals) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target + suffix;
  }

  requestAnimationFrame(update);
}

/* --- PARTICLE CANVAS BACKGROUND --- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.pulse = Math.random() * Math.PI * 2;
      // Reddish hue
      const r = 150 + Math.floor(Math.random() * 80);
      const g = Math.floor(Math.random() * 30);
      const b = Math.floor(Math.random() * 30);
      this.color = `${r},${g},${b}`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
    }
    draw() {
      const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((width * height) / 14000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw faint connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180,0,0,${0.08 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  animate();
}

initParticles();

/* --- SMOOTH SCROLLING FOR ANCHOR LINKS --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --- HOVER GLOW ON GLASS CARDS --- */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${x}% ${y}%, rgba(100, 0, 0, 0.35) 0%, rgba(30, 0, 0, 0.55) 60%)
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* --- PROGRESS BAR ANIMATION ON LOAD --- */
window.addEventListener('load', () => {
  setTimeout(revealOnScroll, 200);
});
