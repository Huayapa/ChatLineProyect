export function showNotify(message, type = 'success') {
  const container = document.getElementById('notify-container');
  if (!container) return;

  const notify = document.createElement('div');
  notify.className = `notify ${type}`;
  notify.textContent = message;

  container.appendChild(notify);

  // Auto eliminar después de 3 segundos
  setTimeout(() => {
    notify.style.opacity = '0';
    notify.style.transform = 'translateY(20px)';
    setTimeout(() => notify.remove(), 300);
  }, 3000);
}