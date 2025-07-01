export function initDetails() {
  const panel = document.getElementById('detail');
  const close = document.getElementById('detail-close');
  close.addEventListener('click', () => {
    panel.classList.add('hidden');
  });
}

export function showDetail(title, desc = '') {
  const panel = document.getElementById('detail');
  const content = document.getElementById('detail-content');
  content.innerHTML = `<h2 class="text-2xl mb-4">${title}</h2><p>${desc}</p>`;
  panel.classList.remove('hidden');
}
