
/* ── helpers ── */
const el   = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const qs   = (sel, root = document) => root.querySelector(sel);
const set  = (sel, html, root = document) => { const e = qs(sel, root); if (e) e.innerHTML = html; };
const attr = (e, obj) => { Object.entries(obj).forEach(([k,v]) => e.setAttribute(k, v)); return e; };

/* ── META ── */
function buildMeta(data) {
  document.title = data.siteTitle;
  if (data.favicon) {
    const link = el('link');
    attr(link, { rel: 'icon', href: data.favicon });
    document.head.appendChild(link);
  }
}

/* ── NAV ── */
function buildNav(hero) {
  const logo = qs('.nav-logo');
  if (logo) logo.innerHTML = `${hero.logoText}<span>${hero.logoAccent}</span>`;

  const navLinks = qs('#nav-links');
  if (navLinks) {
    navLinks.innerHTML = `
      <li><a href="#projects">Projects</a></li>
      <li><a href="#media">Media</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#contact">Contact</a></li>
    `;
  }

  const cta = qs('.nav-cta');
  if (cta) attr(cta, { href: hero.robloxProfileUrl, target: '_blank' });
}

/* ── HERO ── */
function buildHero(data) {
  const badgeClass = data.statusActive ? 'hero-badge' : 'hero-badge inactive';
  qs('#hero-badge').className = badgeClass;
  qs('#hero-badge-text').textContent = data.status;
  qs('#hero-name').textContent = data.name;
  qs('#hero-role').textContent = data.role;
  qs('#hero-bio').textContent  = data.bio;

  /* avatar */
  const box = qs('#avatar-box');
  if (data.avatarImage) {
    box.innerHTML = `<img src="${data.avatarImage}" alt="${data.name} avatar" />`;
  } else {
    box.innerHTML = `<span class="avatar-placeholder">${data.avatarFallback}</span>`;
  }

  /* cta buttons */
  const actions = qs('#hero-actions');
  actions.innerHTML = data.ctaButtons.map(btn =>
    `<a class="btn-${btn.style}" href="${btn.href}">${btn.label}</a>`
  ).join('');
}

/* ── STATS ── */
function buildStats(stats) {
  const grid = qs('#stats-grid');
  grid.innerHTML = stats.map(s =>
    `<div class="stat-item reveal">
      <span class="stat-num" data-count="${s.value}" data-format="${s.format}">0</span>
      <span class="stat-label">${s.label}</span>
    </div>`
  ).join('');
}

/* ── PROJECTS ── */
const STATUS_META = {
  live: { label: '● Live',       cls: 'status-live' },
  dev:  { label: '◐ In Dev',     cls: 'status-dev'  },
  done: { label: '✓ Completed',  cls: 'status-done' },
  stop: { label: 'X Stopped',              cls: 'status-stop'}
};

function buildProjects(projects) {
  const grid = qs('#projects-grid');
  grid.innerHTML = projects.map(p => {
    const s    = STATUS_META[p.status] || STATUS_META.done;
    const thumb = p.thumbnail
      ? `<img src="${p.thumbnail}" alt="${p.name}" />`
      : `<div class="project-thumb-placeholder"
              style="color:${p.thumbnailFallbackColor};background:${p.thumbnailFallbackGradient}">
           ${p.thumbnailFallbackLabel}
         </div>`;

    const tags = p.tags.map(t => `<span class="ptag">${t}</span>`).join('');

    return `
      <a class="project-card reveal" href="${p.robloxUrl}" target="_blank" id="${p.id}">
        <div class="project-thumb">
          ${thumb}
          <div class="project-overlay"><div class="project-overlay-icon">↗</div></div>
          <span class="project-status ${s.cls}">${s.label}</span>
        </div>
        <div class="project-body">
          <div class="project-name">${p.name}</div>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${tags}</div>
        </div>
        <div class="project-footer">
          <span class="project-visits">↑ ${p.visits}</span>
          <span class="project-link">${p.linkLabel} ↗</span>
        </div>
      </a>`;
  }).join('');
}

/* ── MEDIA ── */
function buildMedia(media) {
  /* featured video */

  function getYouTubeId(url) {
      if (!url) return null;

      const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
      return match ? match[1] : null;
  }

  const featured = qs('#media-featured');
  if (media.featuredVideo.youtubeId) {
    featured.innerHTML =
      `<iframe src="https://www.youtube.com/embed/${getYouTubeId(media.featuredVideo.youtubeId)}"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen></iframe>`;
  } else if (media.featuredVideo.localSrc) {
    featured.innerHTML = `<video src="${media.featuredVideo.localSrc}" controls></video>`;
  } else {
    featured.innerHTML =
      `<div class="media-featured-placeholder">
         <div class="play-btn"></div>
         <span style="font-family:var(--ff-mono);font-size:10px;letter-spacing:0.12em;">GAMEPLAY TRAILER</span>
       </div>`;
  }
  qs('#media-caption').textContent = `// ${media.featuredVideo.caption}`;

  /* screenshots */
  const thumbGrid = qs('#media-thumb-grid');
  thumbGrid.innerHTML = media.screenshots.map(s => {
    const inner = s.src
      ? `<img src="${s.src}" alt="${s.alt}" />`
      : `<div class="media-thumb-placeholder">${s.fallbackLabel}</div>`;
    return `<div class="media-thumb">${inner}</div>`;
  }).join('');

  /* sub-videos*/
  const vidGrid = qs('#sub-media-grid');
  vidGrid.innerHTML = media.subVideos.map(v => {
      let inner = "";

      if (v.type === "youtube") {
          const id = getYouTubeId(v.youtubeId);

          if (id) {
              inner = `<iframe src="https://www.youtube.com/embed/${id}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>`;
          }
      } 
      
      else if (v.type === "local" && v.localSrc) {
          inner = `<video src="${v.localSrc}" controls></video>`;
      }

      if (!inner) {
          inner = `<div class="sub-media-thumb-placeholder">${v.fallbackLabel || "No video"}</div>`;
      }

      return `<div class="sub-media-thumb">${inner}</div>`;
  }).join('');
}

/* ── SKILLS ── */
function buildSkills(skills) {
  /* bars */
  const barsWrap = qs('#skill-bars');
  barsWrap.innerHTML = skills.bars.map(s =>
    `<div class="skill-row">
       <span class="skill-name">${s.name}</span>
       <div class="skill-bar-track">
         <div class="skill-bar-fill ${s.accent === 'secondary' ? 'accent2' : ''}"
              data-pct="${s.pct}"></div>
       </div>
       <span class="skill-pct">${s.pct}%</span>
     </div>`
  ).join('');

  /* tools */
  const toolsWrap = qs('#tools-cloud');
  toolsWrap.innerHTML = skills.tools.map(t =>
    `<span class="tool-pill">${t}</span>`
  ).join('');
}

/* ── CONTACT ── */
function buildContact(contact) {
  qs('#contact-desc').textContent = contact.tagline;
  qs('#contact-form').setAttribute('action', contact.formAction);

  const socials = qs('#social-links');
  socials.innerHTML = contact.socials.map(s =>
    `<a class="social-link" href="${s.url}" target="_blank">
       <div class="social-link-left">
         <div class="social-icon">${s.icon}</div>
         <div>
           <div class="social-name">${s.platform}</div>
           <div class="social-handle">${s.handle}</div>
         </div>
       </div>
       <span class="social-arrow">→</span>
     </a>`
  ).join('');
}

/* ── FOOTER ── */
function buildFooter(footer) {
  qs('#footer-copy').textContent  = footer.copy;
  qs('#footer-logo').textContent  = footer.logo;
  qs('#footer-sub').textContent   = footer.sub;
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
}

function formatVisits(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

function NumberStringRegex(input) {
  let regex = /(\d+)(\+)/;
  let match = input.match(regex);

  if (match) {
    let number = parseInt(match[1]);
    let string = match[2];

    return {number, string};
  }
}

function initCountUp() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const fmt = el.dataset.format;
      const NSRegex = NumberStringRegex(el.dataset.count)
      const end = fmt !== 'string' ? parseInt(el.dataset.count) : NSRegex.number;
      const dur = 1800, step = 16;
      const inc = end / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        //el.textContent = fmt === 'visits' ? formatVisits(Math.round(cur)) : Math.round(cur);
        if (fmt === 'visits') {
          el.textContent = formatVisits(Math.round(cur));
        } else if (fmt === "string") {
          el.textContent = formatVisits(Math.round(cur)) + NSRegex.string
        } else {
          el.textContent = Math.round(cur)
        }

        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.pct + '%';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

fetch('data/portfolio.json')
  .then(r => {
    if (!r.ok) throw new Error(`Failed to load portfolio.json (${r.status})`);
    return r.json();
  })
  .then(data => {
    buildMeta(data.meta);
    buildNav(data.hero);
    buildHero(data.hero);
    buildStats(data.stats);
    buildProjects(data.projects);
    buildMedia(data.media);
    buildSkills(data.skills);
    buildContact(data.contact);
    buildFooter(data.footer);

    initReveal();
    initCountUp();
    initSkillBars();
  })
  .catch(err => {
    console.error('[Portfolio] Render error:', err);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;
                  font-family:monospace;color:#ff4f78;background:#0a0c10;text-align:center;padding:2rem;">
        <div>
          <p style="font-size:14px;margin-bottom:8px;">// Could not load portfolio.json</p>
          <p style="font-size:12px;color:#6a7190;">${err.message}</p>
          <p style="font-size:11px;color:#6a7190;margin-top:8px;">
            Open via a local server (e.g. VS Code Live Server) — browsers block fetch() on file://
          </p>
        </div>
      </div>`;
  });
