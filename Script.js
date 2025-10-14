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
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) { alert('Please drop an image file'); return; }
  uploadToGoogle(f);
});

// input change
input.addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  uploadToGoogle(f);
});

// engine buttons (Google/Bing/Yandex)
document.querySelectorAll('.engine').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = document.createElement('input');
    sel.type = 'file';
    sel.accept = 'image/*';
    sel.onchange = (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const engine = btn.dataset.engine;
      if (engine === 'google') uploadToGoogle(file);
      else {
        alert('For Bing/Yandex: please upload an image (we will open Google upload as easiest option).');
        uploadToGoogle(file);
      }
    };
    sel.click();
  });
});

// upload helper for Google
function uploadToGoogle(file) {
  const form = document.createElement('form');
  form.action = 'https://www.google.com/searchbyimage/upload';
  form.method = 'POST';
  form.enctype = 'multipart/form-data';
  form.target = '_blank';
  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.name = 'encoded_image';
  const dt = new DataTransfer(); dt.items.add(file);
  inputFile.files = dt.files;
  form.appendChild(inputFile);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// gallery clicks -> Google search by image URL
document.querySelectorAll('.g-grid img').forEach(img => {
  img.addEventListener('click', () => {
    const hi = img.getAttribute('data-src') || img.src;
    const url = `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(hi)}`;
    window.open(url, '_blank');
  });
});

// lazy-load high-res images
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

// ad placeholder click feedback
document.querySelectorAll('.ad-banner').forEach(ad => {
  ad.addEventListener('click', () => {
    ad.style.boxShadow = '0 30px 80px rgba(255,180,80,0.12)';
    setTimeout(()=> ad.style.boxShadow = '', 600);
  });
});
