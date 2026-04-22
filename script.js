// ========== NAV & SCROLL ACTIVE ==========
const sections = document.querySelectorAll("section, .hero");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (scrollY >= top) {
      current = section.getAttribute("id") || (section.classList.contains("hero") ? "home" : "");
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current || (current === "home" && link.getAttribute("href") === "#home")) {
      link.classList.add("active");
    }
  });
});

// ========== MUSIC PLAY ==========
const musicCard = document.getElementById('music-card');
const musicAudio = document.getElementById('music-audio');
if (musicCard && musicAudio) {
  musicCard.addEventListener('click', (e) => {
    e.preventDefault();
    musicAudio.play().catch(e => console.log("Audio play error:", e));
  });
}

// ========== COMMENT SYSTEM ==========
async function loadCommentsCompact() {
  try {
    const res = await fetch('api.php');
    const comments = await res.json();
    const container = document.getElementById('commentsListCompact');
    if (!comments.length) {
      container.innerHTML = '<div class="no-comments-compact">Belum ada komentar. Jadilah yang pertama! 💫</div>';
      return;
    }
    container.innerHTML = comments.slice(0, 5).map(c => `
      <div class="comment-item-compact">
        <div class="comment-name-compact">
          ${escapeHtml(c.name)}
          <span class="comment-date-compact">${c.created_at}</span>
        </div>
        <div class="comment-message-compact">${escapeHtml(c.message)}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('commentsListCompact').innerHTML = '<div class="no-comments-compact">Gagal memuat komentar.</div>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const commentForm = document.getElementById('commentFormCompact');
if (commentForm) {
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('commentNameCompact').value.trim();
    const email = document.getElementById('commentEmailCompact').value.trim();
    const message = document.getElementById('commentMessageCompact').value.trim();

    if (!name || !message) {
      alert("Nama dan pesan wajib diisi!");
      return;
    }

    try {
      const res = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      document.getElementById('commentFormCompact').reset();
      loadCommentsCompact();
      showToast('✨ Pesan berhasil dikirim!');
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim pesan. Coba lagi nanti.');
    }
  });
}

loadCommentsCompact();

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========== CUSTOM CURSOR ==========
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// ========== TYPING EFFECT ==========
const texts = ["Mira", "a Tech Explorer", "a Dreamer"];
const typingEl = document.getElementById("typing");
let textIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  if (!typingEl) return;
  const currentText = texts[textIndex];
  if (!isDeleting) {
    typingEl.innerHTML = currentText.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    typingEl.innerHTML = currentText.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }
  const speed = isDeleting ? 60 : 120;
  setTimeout(typeLoop, speed);
}

window.addEventListener("load", () => {
  if (typingEl) {
    typingEl.innerHTML = "";
    setTimeout(typeLoop, 500);
  }
});

// ========== CLICK EFFECT ON CURSOR ==========
document.addEventListener('click', () => {
  if (cursor) {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    setTimeout(() => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    }, 150);
  }
});

// ========== SCROLL REVEAL ==========
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ========== SMOOTH SCROLL FOR NAVIGATION ==========
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
