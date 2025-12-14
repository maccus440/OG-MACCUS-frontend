 const mapForm = document.getElementById('mapSearchForm');
 const mapInput = document.getElementById('mapSearchInput');
 const mapFrame = document.getElementById('mapFrame');
  mapForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = mapInput.value.trim();
    if (!q) return;
    mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
  });