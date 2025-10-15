 const dropZone = document.getElementById('dropZone');
const input = document.getElementById('imageInput');

// drag visuals
['dragenter','dragover'].forEach(ev => {
  dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add('dragover'); });
});
['dragleave','drop'].forEach(ev => {
  dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove('dragover'); });
});

// drop handling
dropZone.addEventListener('drop', e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please drop an image file'); return; }
  openSearch(file);
});

// input change
input.addEventListener('change', e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  openSearch(file);
});

// engine buttons
document.querySelectorAll('.engine').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = document.createElement('input');
    sel.type = 'file';
    sel.accept = 'image/*';
    sel.onchange = (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      openSearch(file, btn.dataset.engine);
    };
    sel.click();
  });
});

function openSearch(file, engine='google') {
  const url = URL.createObjectURL(file);
  let searchUrl = '';
  if(engine === 'google') searchUrl = `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(url)}`;
  else if(engine === 'bing') searchUrl = `https://www.bing.com/images/search?q=imgurl:${encodeURIComponent(url)}&view=detailv2&iss=sbi`;
  else if(engine === 'yandex') searchUrl = `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`;
  window.open(searchUrl, '_blank');
}

// gallery clicks
document.querySelectorAll('.g-grid img').forEach(img => {
  img.addEventListener('click', () => {
    const hi = img.getAttribute('data-src') || img.src;
    const url = `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(hi)}`;
    window.open(url, '_blank');
  });
});

// lazy-load gallery
const lazyImgs = Array.from(document.querySelectorAll('.g-grid img'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const high = img.getAttribute('data-src');
      if (high) img.src = high;
      obs.unobserve(img);
    });
  }, {rootMargin:'150px 0px'});
  lazyImgs.forEach(i => io.observe(i));
} else {
  lazyImgs.forEach(i => { const h = i.getAttribute('data-src'); if (h) i.src = h; });
}

// ad placeholder click effect
document.querySelectorAll('.ad-banner').forEach(ad => {
  ad.addEventListener('click', () => {
    ad.style.boxShadow = '0 30px 80px rgba(255,180,80,0.12)';
    setTimeout(()=> ad.style.boxShadow = '', 600);
  });
});
