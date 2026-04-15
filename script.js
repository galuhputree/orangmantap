/* ═══════════════════════════════════════════
   MED-SOLVE LABORATORIUM — script.js
═══════════════════════════════════════════ */

// ─── PROJECT DATA ───────────────────────────
const projects = [
  {
    id: 1,
    title: "Desain Custom Cranioplasty Implant",
    question: "How can cranial implants be precisely tailored to a patient's anatomy?",
    problem: "Defek tulang kranium pasca trauma/operasi membutuhkan implan dengan kesesuaian anatomi tinggi, namun implan standar sering tidak presisi.",
    methodology: [
      "DICOM data processing",
      "Bone defect segmentation",
      "3D modeling (CAD)",
      "3D printing mold",
      "Silicon molding",
      "PMMA fabrication"
    ],
    skills: [
      "Medical image processing",
      "CAD design",
      "3D printing",
      "Biomaterial fabrication"
    ],
    result: "Prototipe implan kranium kustom dengan kesesuaian anatomi yang tinggi berhasil diproduksi dan divalidasi secara geometris.",
    impact: "Meningkatkan akurasi rekonstruksi tulang dan potensi outcome bedah bagi pasien dengan defek kranium post-trauma.",
    icon: "🧠"
  },
  {
    id: 2,
    title: "Desain Nose Brace dan Pelindung Hidung",
    question: "How can nasal protection be made more ergonomic and custom-fit?",
    problem: "Pelindung hidung konvensional memiliki fit yang generik dan sering tidak nyaman digunakan dalam jangka panjang oleh pasien pasca operasi rhinoplasti.",
    methodology: [
      "Anthropometric measurement",
      "3D face scanning",
      "Parametric CAD modeling",
      "Material selection (TPU)",
      "Prototype fabrication",
      "User comfort testing"
    ],
    skills: [
      "Ergonomic design",
      "3D scanning & modeling",
      "Polymer engineering",
      "Clinical testing protocol"
    ],
    result: "Prototipe nose brace kustom berbahan TPU fleksibel dengan penyesuaian anatomi hidung individual telah berhasil dikembangkan.",
    impact: "Meningkatkan kenyamanan pasien dan efektivitas penyembuhan pasca operasi, dengan desain yang dapat dipersonalisasi per pasien.",
    icon: "👃"
  },
  {
    id: 3,
    title: "Deep Learning Based Anemia Mobile App",
    question: "How can anemia be detected without invasive blood tests?",
    problem: "Pemeriksaan anemia konvensional memerlukan pengambilan darah yang invasif, sehingga tidak praktis untuk skrining massal, terutama di daerah dengan akses layanan kesehatan terbatas.",
    methodology: [
      "Conjunctival image dataset collection",
      "Image preprocessing & augmentation",
      "CNN architecture design",
      "Model training & validation",
      "Mobile app integration",
      "Clinical accuracy testing"
    ],
    skills: [
      "Deep learning (CNN)",
      "Computer vision",
      "Mobile app development",
      "Medical dataset curation",
      "Clinical validation"
    ],
    result: "Aplikasi mobile dengan akurasi deteksi anemia >85% melalui analisis warna konjungtiva menggunakan kamera smartphone standar.",
    impact: "Memungkinkan skrining anemia non-invasif secara mandiri, memperluas jangkauan deteksi dini anemia di komunitas dan fasilitas kesehatan primer.",
    icon: "🩸"
  }
];

// ─── SECTION SWITCHING ───────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ─── RENDER PROJECT CARDS ────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => openDetail(p.id);
    card.innerHTML = `
      <div class="card-img">
        <span class="card-img-icon">${p.icon}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <p class="card-question">${p.question}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── OPEN PROJECT DETAIL ─────────────────────
function openDetail(id) {
  const p = projects.find(proj => proj.id === id);
  if (!p) return;

  document.getElementById('detail-title').textContent = p.title;
  document.getElementById('detail-question').textContent = p.question;
  document.getElementById('detail-problem').textContent = p.problem;

  // Methodology pipeline
  const methEl = document.getElementById('detail-methodology');
  methEl.innerHTML = p.methodology.map((step, i) =>
    `<span class="pipeline-step">${step}</span>${i < p.methodology.length - 1 ? '<span class="pipeline-arrow">→</span>' : ''}`
  ).join('');

  // Skills list
  const skillsEl = document.getElementById('detail-skills');
  skillsEl.innerHTML = p.skills.map(s => `<li>${s}</li>`).join('');

  document.getElementById('detail-result').textContent = p.result;
  document.getElementById('detail-impact').textContent = p.impact;

  showSection('detail');
}

// ─── UPLOAD HANDLER ──────────────────────────
function handleImageUpload(input) {
  const preview = document.getElementById('img-preview-row');
  preview.innerHTML = '';
  const files = Array.from(input.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.className = 'img-preview-item';
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function handleUpload() {
  const problem    = document.getElementById('u-problem').value.trim();
  const solution   = document.getElementById('u-solution').value.trim();
  const methodology = document.getElementById('u-methodology').value.trim();
  const skills     = document.getElementById('u-skills').value.trim();
  const impact     = document.getElementById('u-impact').value.trim();
  const result     = document.getElementById('u-result').value.trim();

  if (!problem || !solution) {
    showToast('Please fill in at least the Problem and Solution fields.', 'warn');
    return;
  }

  // Build a new project entry
  const newProject = {
    id: projects.length + 1,
    title: solution.slice(0, 60) + (solution.length > 60 ? '...' : ''),
    question: problem.slice(0, 100) + (problem.length > 100 ? '...' : ''),
    problem: problem,
    methodology: methodology ? methodology.split(/[\n,→]+/).map(s => s.trim()).filter(Boolean) : ["See description"],
    skills: skills ? skills.split(/[\n,•]+/).map(s => s.trim()).filter(Boolean) : [],
    result: result || "—",
    impact: impact || "—",
    icon: "🔬"
  };

  projects.push(newProject);

  // Reset form
  ['u-problem','u-solution','u-methodology','u-skills','u-impact','u-result'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('img-preview-row').innerHTML = '';
  document.getElementById('img-upload').value = '';

  showToast('Project uploaded successfully!', 'success');

  setTimeout(() => {
    renderProjects();
    showSection('projects');
  }, 1200);
}

// ─── TOAST NOTIFICATION ──────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: type === 'success' ? '#1a3460' : '#c0602a',
    color: '#fff',
    padding: '0.85rem 2rem',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
    zIndex: '9999',
    boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
    opacity: '0',
    transition: 'opacity 0.3s, transform 0.3s',
    letterSpacing: '0.02em'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();

  // Hero scroll hint
  const hero = document.getElementById('hero');
  if (hero) {
    const hint = document.createElement('div');
    Object.assign(hint.style, {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '1.4rem',
      color: 'rgba(26,52,96,0.35)',
      animation: 'bounce 2s ease-in-out infinite',
      cursor: 'pointer',
      userSelect: 'none'
    });
    hint.textContent = '⌄';
    hint.onclick = () => showSection('projects');
    hero.appendChild(hint);

    // Add bounce keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50%       { transform: translateX(-50%) translateY(8px); }
      }
    `;
    document.head.appendChild(style);
  }
});
