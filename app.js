// ЦОН — app.js (localStorage database)

// ============ DATABASE ============
const DB = {
  getAll() {
    return JSON.parse(localStorage.getItem('con_appointments') || '[]');
  },
  save(record) {
    const all = this.getAll();
    all.push(record);
    localStorage.setItem('con_appointments', JSON.stringify(all));
  },
  delete(id) {
    const all = this.getAll().filter(r => r.id !== id);
    localStorage.setItem('con_appointments', JSON.stringify(all));
  },
  updateStatus(id, status) {
    const all = this.getAll().map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('con_appointments', JSON.stringify(all));
  }
};

// ============ BURGER MENU ============
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ============ FORM SUBMIT → SAVE TO DB ============
const form = document.getElementById('apptForm');
const modal = document.getElementById('modal');
const ticketNum = document.getElementById('ticketNum');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const selects = form.querySelectorAll('select');
  const inputs  = form.querySelectorAll('input');

  const ticket = 'A-' + Math.floor(1000 + Math.random() * 9000);

  const record = {
    id:       Date.now().toString(),
    ticket,
    service:  selects[0].value,
    center:   selects[1].value,
    date:     inputs[0].value,
    time:     selects[2].value,
    phone:    inputs[1].value,
    status:   'Күтуде',
    createdAt: new Date().toLocaleString('kk-KZ')
  };

  DB.save(record);

  ticketNum.textContent = ticket;
  modal.classList.add('active');
  form.reset();
});

function closeModal() { modal?.classList.remove('active'); }
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ============ NAVBAR SCROLL ============
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav?.classList.toggle('scrolled', window.scrollY > 20);
});

// ============ SCROLL REVEAL ============
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

// ============ ADMIN PANEL (admin.html-де жұмыс істейді) ============
function renderAdmin() {
  const tbody = document.getElementById('adminTable');
  const counter = document.getElementById('totalCount');
  if (!tbody) return;

  const all = DB.getAll();
  if (counter) counter.textContent = all.length;

  if (all.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;padding:32px">Кезек жоқ</td></tr>';
    return;
  }

  tbody.innerHTML = all.reverse().map(r => `
    <tr>
      <td><strong>${r.ticket}</strong></td>
      <td>${r.service}</td>
      <td>${r.date} ${r.time}</td>
      <td>${r.phone}</td>
      <td>${r.center.split('—')[0]}</td>
      <td>
        <select onchange="changeStatus('${r.id}', this.value)" class="status-select ${statusClass(r.status)}">
          <option ${r.status==='Күтуде'?'selected':''}>Күтуде</option>
          <option ${r.status==='Орындалды'?'selected':''}>Орындалды</option>
          <option ${r.status==='Болдырылмады'?'selected':''}>Болдырылмады</option>
        </select>
      </td>
      <td><button onclick="deleteRecord('${r.id}')" class="del-btn">🗑</button></td>
    </tr>
  `).join('');
}

function statusClass(s) {
  if (s === 'Орындалды') return 'status-done';
  if (s === 'Болдырылмады') return 'status-cancel';
  return 'status-wait';
}

function changeStatus(id, status) {
  DB.updateStatus(id, status);
  renderAdmin();
}

function deleteRecord(id) {
  if (confirm('Жазбаны өшіресіз бе?')) {
    DB.delete(id);
    renderAdmin();
  }
}

function clearAll() {
  if (confirm('Барлық кезектерді өшіресіз бе?')) {
    localStorage.removeItem('con_appointments');
    renderAdmin();
  }
}

// Admin бетінде автоматты іске қосу
document.addEventListener('DOMContentLoaded', renderAdmin);
