/* Core UI Script - EDUGAP Ventures Limited */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initScrollReveal();
  initActiveNavLinkScroll();
});

/* 1. Header & Navigation Logic */
function initNavbar() {
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!header || !mobileToggle || !navMenu) return;

  // Add scroll class to header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation drawer
  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile navigation when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* 2. Light / Dark Theme Toggle */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('edugap-theme');
  
  // 1. Set initial theme based on local storage or system preferences
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
    updateToggleIcons('dark');
  } else {
    document.body.classList.remove('dark-theme');
    updateToggleIcons('light');
  }

  // 2. Bind click events to all toggle buttons
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      const activeTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('edugap-theme', activeTheme);
      updateToggleIcons(activeTheme);
    });
  });

  // 3. Helper function to show/hide the correct icons
  function updateToggleIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      
      // Safety check to prevent errors if icons are missing
      if (!sunIcon || !moonIcon) return; 

      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    });
  }
}

/* 3. Scroll Reveal (Intersection Observer) */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.01 // Triggers instantly when even 1% enters view
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Immediate fallback check: if the element is already on screen on page load, reveal it
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active');
    } else {
      observer.observe(el);
    }
  });
}

/* 4. Highlight Active Navigation Link on Scroll */
function initActiveNavLinkScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}