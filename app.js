// ЦОН — app.js

// Burger menu toggle
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Appointment form submit
const form = document.getElementById('apptForm');
const modal = document.getElementById('modal');
const ticketNum = document.getElementById('ticketNum');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const num = 'A-' + Math.floor(1000 + Math.random() * 9000);
  ticketNum.textContent = num;
  modal.classList.add('active');
  form.reset();
});

function closeModal() {
  modal?.classList.remove('active');
}

// Close modal on backdrop click
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Navbar scroll shadow
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 20) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
});

// Simple scroll-reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .info-card, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
