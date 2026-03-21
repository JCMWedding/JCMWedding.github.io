(function () {
  const site = window.WEDDING_SITE || {};
  const data = window.WEDDING_DATA || {};

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function deriveThumbSrc(src) {
    if (!src) return '';
    if (/\/thumbs\//i.test(src)) return src;
    return src.replace(/\/([^/]+)$/, '/thumbs/$1');
  }

  setText('.js-couple-display', site.coupleDisplay || '');
  setText('.js-couple-formal', site.coupleFormal || '');
  setText('.js-date-display', site.dateDisplay || '');
  setText('.js-venue', site.venue || '');
  setText('.js-verse-reference', site.verseReference || '');
  setText('.js-verse-text', site.verseText || '');
  setText('.js-site-title', site.siteTitle || '');
  setText('.js-footer-credit', site.footerCredit || '');

  document.querySelectorAll('.js-share-email').forEach(el => {
    el.textContent = site.shareEmail || '';
    if (el.tagName.toLowerCase() === 'a') {
      el.href = 'mailto:' + (site.shareEmail || '');
    }
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');
    });
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) link.classList.add('active');
  });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-media') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxCount = lightbox ? lightbox.querySelector('.lightbox-count') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  const lightboxOriginal = lightbox ? lightbox.querySelector('.lightbox-original') : null;
  const lightboxCopy = lightbox ? lightbox.querySelector('.lightbox-copy') : null;

  let lightboxItems = [];
  let lightboxIndex = 0;

  function updateLightbox() {
    if (!lightbox || !lightboxImage || !lightboxItems.length) return;
    const item = lightboxItems[lightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || item.title || '';

    const hasTitle = !!(item.title || '').trim();
    const hasCaption = !!(item.caption || '').trim();

    if (lightboxTitle) {
      lightboxTitle.textContent = item.title || '';
      lightboxTitle.style.display = hasTitle ? '' : 'none';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption || '';
      lightboxCaption.style.display = hasCaption ? '' : 'none';
    }
    if (lightboxCount) {
      lightboxCount.textContent = lightboxItems.length > 1 ? (lightboxIndex + 1) + ' / ' + lightboxItems.length : '';
    }
    if (lightboxOriginal) {
      lightboxOriginal.href = item.src;
      lightboxOriginal.style.display = item.src ? 'inline-flex' : 'none';
    }
    if (lightboxCopy) {
      lightboxCopy.classList.toggle('copy-minimal', !hasTitle && !hasCaption);
    }
  }

  function openLightbox(items, index) {
    if (!lightbox || !lightboxImage || !items.length) return;
    lightboxItems = items;
    lightboxIndex = index || 0;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightbox();
  }

  function showNext() {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  document.querySelectorAll('[data-gallery-key]').forEach(section => {
    const key = section.dataset.galleryKey;
    const items = (data[key] || []).map(item => {
      if (item.thumbSrc) return item;
      return Object.assign({}, item, { thumbSrc: deriveThumbSrc(item.src) });
    });
    const target = section.querySelector('.gallery-target');
    const emptyTarget = section.querySelector('.empty-target');
    if (!target) return;

    if (!items.length) {
      if (emptyTarget) {
        emptyTarget.innerHTML = `
          <div class="empty-state">
            <strong>Content coming soon</strong>
            <p>This collection will be shared here as soon as it is ready.</p>
          </div>
        `;
      }
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'masonry-item';
      const displaySrc = item.thumbSrc || item.src;
      wrapper.innerHTML = `
        <article class="gallery-card">
          <button type="button" aria-label="Open image ${index + 1}">
            <img src="${displaySrc}" alt="${item.alt || item.title || ''}" loading="lazy" decoding="async">
          </button>
        </article>
      `;
      const img = wrapper.querySelector('img');
      if (item.thumbSrc) {
        img.addEventListener('error', function () {
          if (img.getAttribute('src') !== item.src) img.setAttribute('src', item.src);
        }, { once: true });
      }
      wrapper.querySelector('button').addEventListener('click', () => openLightbox(items, index));
      fragment.appendChild(wrapper);
    });
    target.appendChild(fragment);
  });

  document.querySelectorAll('[data-media-key]').forEach(section => {
    const key = section.dataset.mediaKey;
    const items = data[key] || [];
    const target = section.querySelector('.media-target');
    if (!target) return;

    if (!items.length) {
      target.innerHTML = `
        <div class="empty-state">
          <strong>Media coming soon</strong>
          <p>Media files will appear here once they are ready to share.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'media-card ' + ((item.status === 'coming-soon') ? 'coming-soon' : '');
      let player = '';
      if (item.type === 'youtube' && item.embedUrl) {
        player = `<div class="embed-frame"><iframe src="${item.embedUrl}" title="${item.title || 'Wedding video'}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
      } else if (item.src) {
        player = item.type === 'audio'
          ? `<audio controls preload="none" src="${item.src}"></audio>`
          : `<video controls preload="none" poster="${item.poster || ''}" src="${item.src}"></video>`;
      }
      const tag = (item.group || '').trim()
        ? `<span class="tag">${item.group}</span>`
        : '';
      const title = (item.title || '').trim()
        ? `<h3>${item.title}</h3>`
        : '';
      const description = (item.description || '').trim()
        ? `<p>${item.description}</p>`
        : '';
      const watchLink = (item.watchUrl || '').trim()
        ? `<a class="media-link" href="${item.watchUrl}" target="_blank" rel="noopener noreferrer">Open on YouTube</a>`
        : '';
      const headingBlock = (title || description)
        ? `<div>${title}${description}</div>`
        : '';
      card.innerHTML = `
        ${tag}
        ${headingBlock}
        ${player || '<div class="notice">Media will be added soon.</div>'}
        ${watchLink}
      `;
      target.appendChild(card);
    });
  });
})();
