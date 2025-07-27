export function formatShortTime(date) {
  const parsed = new Date(date);
  if (isNaN(parsed)) return ''; // Fecha inválida
  return new Intl.DateTimeFormat('es', {
    timeStyle: 'short'
  }).format(parsed);
}