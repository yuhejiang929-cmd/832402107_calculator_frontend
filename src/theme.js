export function initTheme() {
  const button = document.querySelector('#theme-toggle');
  let preference;
  try {
    preference = localStorage.getItem('forma-theme');
  } catch {
    /* Preferences are optional. */
  }
  let theme = preference || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function apply() {
    document.documentElement.dataset.theme = theme;
    button.textContent = theme === 'dark' ? '☀' : '☾';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }
  apply();
  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('forma-theme', theme);
    } catch {
      /* Still apply for this visit. */
    }
    apply();
  });
}
