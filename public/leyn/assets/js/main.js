/* =========================================================
   Lalaine Ann Garcia, portfolio scripts
   Tabbed panels (hash routed), tools marquee, gallery lightbox, form.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Tab routing: one panel visible at a time, driven by the hash
     so links, refreshes and the back button all keep working.
     --------------------------------------------------------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sidenav a'));
  var validIds = panels.map(function (p) { return p.id; });

  function currentId() {
    var id = (location.hash || '').replace('#', '');
    return validIds.indexOf(id) !== -1 ? id : 'home';
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function swapTo(id) {
    panels.forEach(function (p) {
      p.classList.remove('is-leaving');
      p.classList.toggle('is-active', p.id === id);
    });
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // Stagger the blocks of the panel we just revealed.
    var panel = document.getElementById(id);
    if (panel) {
      Array.prototype.forEach.call(panel.children, function (el, i) {
        el.style.setProperty('--i', i);
      });
    }

    document.title = titleFor(id);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function showPanel(id) {
    var current = document.querySelector('.panel.is-active');
    if (current && current.id === id) return;

    // Chrome et al: let the browser cross-fade the whole swap.
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(function () { swapTo(id); });
      return;
    }

    // Everywhere else: fade the outgoing panel, then swap.
    if (!reduceMotion && current) {
      current.classList.add('is-leaving');
      window.setTimeout(function () { swapTo(id); }, 180);
      return;
    }

    swapTo(id);
  }

  var TITLES = {
    home:     'Virtual Assistant for Graphic Design & Bookkeeping | Lalaine Ann Garcia',
    projects: 'Projects: design, bookkeeping and automation work | Lalaine Ann Garcia',
    services: 'Services: design, bookkeeping, admin and automation | Lalaine Ann Garcia',
    about:    'About Lalaine Ann Garcia, virtual assistant in the Philippines',
    contact:  'Contact Lalaine Ann Garcia, virtual assistant | Hire me'
  };

  function titleFor(id) {
    return TITLES[id] || TITLES.home;
  }

  window.addEventListener('hashchange', function () { showPanel(currentId()); });
  showPanel(currentId());

  /* ---------------------------------------------------------
     Tools marquee. Icons come from the Simple Icons CDN, with a
     coloured monogram fallback when offline.
     --------------------------------------------------------- */
  var toolsRowA = [
    { name: 'Canva',            slug: 'canva',             color: '00C4CC' },
    { name: 'Photoshop',        slug: 'adobephotoshop',    color: '31A8FF' },
    { name: 'Illustrator',      slug: 'adobeillustrator',  color: 'FF9A00' },
    { name: 'Figma',            slug: 'figma',             color: 'F24E1E' },
    { name: 'CapCut',           slug: 'capcut',            color: '000000' },
    { name: 'Gmail',            slug: 'gmail',             color: 'EA4335' },
    { name: 'Google Drive',     slug: 'googledrive',       color: '4285F4' },
    { name: 'Google Sheets',    slug: 'googlesheets',      color: '34A853' },
    { name: 'Google Calendar',  slug: 'googlecalendar',    color: '4285F4' },
    { name: 'Google Docs',      slug: 'googledocs',        color: '4285F4' }
  ];

  var toolsRowB = [
    { name: 'QuickBooks',       slug: 'quickbooks',        color: '2CA01C' },
    { name: 'Xero',             slug: 'xero',              color: '13B5EA' },
    { name: 'Microsoft Excel',  slug: 'microsoftexcel',    color: '217346' },
    { name: 'Zapier',           slug: 'zapier',            color: 'FF4F00' },
    { name: 'Make',             slug: 'make',              color: '6D00CC' },
    { name: 'Notion',           slug: 'notion',            color: '000000' },
    { name: 'Trello',           slug: 'trello',            color: '0052CC' },
    { name: 'Asana',            slug: 'asana',             color: 'F06A6A' },
    { name: 'Slack',            slug: 'slack',             color: '4A154B' },
    { name: 'Zoom',             slug: 'zoom',              color: '0B5CFF' },
    { name: 'Calendly',         slug: 'calendly',          color: '006BFF' },
    { name: 'ChatGPT',          slug: 'openai',            color: '412991' }
  ];

  function chip(tool) {
    var el = document.createElement('span');
    el.className = 'tool';

    var icon = document.createElement('span');
    icon.className = 'tool__icon';

    var img = document.createElement('img');
    img.src = 'https://cdn.simpleicons.org/' + tool.slug + '/' + tool.color;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = function () {
      icon.textContent = tool.name.charAt(0);
      icon.style.cssText +=
        'background:#' + tool.color + ';color:#fff;border-radius:6px;' +
        'font-size:.68rem;font-weight:600;';
    };
    icon.appendChild(img);

    el.appendChild(icon);
    el.appendChild(document.createTextNode(tool.name));
    return el;
  }

  function fillTrack(trackId, tools) {
    var track = document.getElementById(trackId);
    if (!track) return;
    // Rendered twice so the -50% translate loops seamlessly.
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < tools.length; i++) track.appendChild(chip(tools[i]));
    }
  }

  fillTrack('marqueeTrack', toolsRowA);
  fillTrack('marqueeTrack2', toolsRowB);

  /* ---------------------------------------------------------
     Project galleries.
     Each slide is a placeholder frame until real files are dropped in -
     swap `frame` for `{ src: 'assets/img/…' }` and the slide renders the image.
     --------------------------------------------------------- */
  var galleries = {
    branding: {
      title: 'Branding & Design',
      slides: [
        { frame: 'Logo & brand mark', caption: 'Primary logo, secondary mark and favicon set.' },
        { frame: 'Colour & type system', caption: 'Palette, type scale and usage rules.' },
        { frame: 'Packaging mockup', caption: 'Label design applied to product renders.' },
        { frame: 'Brand guide pages', caption: 'One-page guide handed over to the client.' }
      ]
    },
    social: {
      title: 'Social Media Content',
      slides: [
        { frame: 'Monthly content grid', caption: '30 posts planned as one cohesive feed.' },
        { frame: 'Story templates', caption: 'Reusable Canva templates for daily stories.' },
        { frame: 'Reels covers', caption: 'Consistent cover set for video content.' },
        { frame: 'Caption bank', caption: 'Written captions with hooks and CTAs.' }
      ]
    },
    books: {
      title: 'Bookkeeping',
      slides: [
        { frame: 'Reconciliation view', caption: 'Bank feed matched and cleared for the month.' },
        { frame: 'Invoice tracker', caption: 'Sent, due and overdue at a glance.' },
        { frame: 'Expense categories', caption: 'Chart of accounts tidied and consistent.' },
        { frame: 'Monthly P&L', caption: 'One-page summary written in plain language.' }
      ]
    },
    automation: {
      title: 'Automation & Admin',
      slides: [
        { frame: 'Onboarding flow', caption: 'Form to folder to welcome email, hands-free.' },
        { frame: 'Auto report', caption: 'Weekly numbers compiled and emailed on a schedule.' },
        { frame: 'Inbox rules', caption: 'Labels and filters that keep the inbox at zero.' },
        { frame: 'Tracker sheet', caption: 'Live Google Sheet the client checks any time.' }
      ]
    }
  };

  var lightbox = document.getElementById('lightbox');
  var lbTitle = document.getElementById('lbTitle');
  var lbCount = document.getElementById('lbCount');
  var lbStage = document.getElementById('lbStage');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbClose = document.getElementById('lbClose');

  var openGallery = null;
  var slideIndex = 0;
  var lastFocused = null;

  // Footer label on each card reflects the real number of slides.
  document.querySelectorAll('.project').forEach(function (card) {
    var key = card.getAttribute('data-project');
    var gallery = galleries[key];
    if (!gallery) return;
    card.querySelector('[data-count]').textContent = 'View ' + gallery.slides.length + ' samples';
    card.querySelector('.project__open').addEventListener('click', function () {
      lastFocused = document.activeElement;
      openGallery = gallery;
      slideIndex = 0;
      renderSlide();
      lightbox.hidden = false;
      lbClose.focus();
    });
  });

  function renderSlide() {
    if (!openGallery) return;
    var slide = openGallery.slides[slideIndex];
    lbTitle.textContent = openGallery.title;
    lbCount.textContent = 'Sample ' + (slideIndex + 1) + ' of ' + openGallery.slides.length;

    lbStage.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'slide';

    var frame = document.createElement('div');
    frame.className = 'slide__frame';
    if (slide.src) {
      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.frame || '';
      frame.appendChild(img);
    } else {
      frame.innerHTML = '<span><strong>' + slide.frame + '</strong>Drop the real screenshot here</span>';
    }

    var caption = document.createElement('p');
    caption.className = 'slide__caption';
    caption.textContent = slide.caption;

    wrap.appendChild(frame);
    wrap.appendChild(caption);
    lbStage.appendChild(wrap);

    lbPrev.disabled = slideIndex === 0;
    lbNext.disabled = slideIndex === openGallery.slides.length - 1;
  }

  function step(delta) {
    if (!openGallery) return;
    var next = slideIndex + delta;
    if (next < 0 || next >= openGallery.slides.length) return;
    slideIndex = next;
    renderSlide();
  }

  function closeGallery() {
    lightbox.hidden = true;
    openGallery = null;
    if (lastFocused) lastFocused.focus();
  }

  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });
  lbClose.addEventListener('click', closeGallery);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeGallery();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- Mobile sidebar ---------- */
  var sidebar = document.getElementById('sidebar');
  var burger = document.getElementById('burger');

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var open = sidebar.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('#sidebar a').forEach(function (a) {
    a.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  /* ---------- Contact form (front-end only) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    ['name', 'email', 'message'].forEach(function (id) {
      var input = document.getElementById(id);
      var valid = input.value.trim() !== '' &&
        (id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
      input.parentElement.classList.toggle('has-error', !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      status.textContent = 'Please fill in your name, a valid email, and a message.';
      return;
    }

    // No backend yet, hand the message off to the visitor's mail client.
    var subject = encodeURIComponent('New project inquiry: ' + document.getElementById('service').value);
    var body = encodeURIComponent(
      'Name: ' + document.getElementById('name').value + '\n' +
      'Email: ' + document.getElementById('email').value + '\n' +
      'Service: ' + document.getElementById('service').value + '\n\n' +
      document.getElementById('message').value
    );
    window.location.href = 'mailto:hello@lalaineann.com?subject=' + subject + '&body=' + body;

    status.textContent = 'Thanks! Opening your email app to send the message.';
    form.reset();
  });

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
