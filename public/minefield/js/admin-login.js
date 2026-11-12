(function () {
  'use strict';

  const api = window.MF_API;
  const routes = (window.MF_CONFIG && window.MF_CONFIG.ROUTES) || {};
  const form = document.getElementById('admin-auth-form');
  const error = document.getElementById('admin-form-error');
  const submit = document.getElementById('admin-submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    submit.disabled = true;

    try {
      await api.adminLogin({
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
      });
      window.location.href = routes.admin || '/admin';
    } catch (exception) {
      error.textContent = exception.message;
      error.hidden = false;
      submit.disabled = false;
    }
  });
})();