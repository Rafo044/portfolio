// script.js
// Theme toggle + persist in localStorage across pages


// Dark/Light mode toggle
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const pressed = toggleBtn.getAttribute('aria-pressed') === 'true';
  toggleBtn.setAttribute('aria-pressed', !pressed);
  toggleBtn.textContent = document.body.classList.contains('light') ? 'Dark Mode' : 'Light Mode';
});

// Certifications əlavə et
const certifications = [
  { name: "IBM Data Engineering", url: "https://coursera.org/share/..." },
  { name: "AWS Cloud Practitioner", url: "https://www.coursera.org/share/..." }
];
const certList = document.getElementById('cert-list');
certifications.forEach(cert => {
  const li = document.createElement('li');
  li.innerHTML = `<a href="${cert.url}" target="_blank">${cert.name}</a>`;
  certList.appendChild(li);
});

// Social Media əlavə et
const socialMedia = [
  { name: "LinkedIn", url: "https://linkedin.com/in/rafael-alikhanli", logo: "logos/linkedin.svg" },
  { name: "GitHub", url: "https://github.com/rafael-alikhanli", logo: "logos/github.svg" },
  { name: "Twitter", url: "https://twitter.com/rafael_alikhanli", logo: "logos/twitter.svg" }
];
const socialContainer = document.getElementById('social-media');
socialMedia.forEach(sm => {
  const a = document.createElement('a');
  a.href = sm.url;
  a.target = "_blank";
  a.style.display = "inline-flex";
  a.style.alignItems = "center";
  a.style.marginRight = "16px";
  a.style.textDecoration = "none";
  a.style.color = "inherit";

  const img = document.createElement('img');
  img.src = sm.logo;
  img.alt = sm.name;
  img.style.width = "24px";
  img.style.height = "24px";
  img.style.marginRight = "6px";

  a.appendChild(img);
  a.appendChild(document.createTextNode(sm.name));
  socialContainer.appendChild(a);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  alert(`Thank you, ${data.get('name')}! Your message has been received.`);
  e.target.reset();
});

(function(){
  const themeToggle = document.getElementById('themeToggle');
  if(!themeToggle) return;

  // Initialize from localStorage if available
  const saved = localStorage.getItem('site-theme');
  if(saved === 'light'){
    document.body.classList.add('light');
    themeToggle.textContent = 'Dark Mode';
  } else {
    // default is dark (Versiya 1)
    document.body.classList.remove('light');
    themeToggle.textContent = 'Light Mode';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
  });
})();


