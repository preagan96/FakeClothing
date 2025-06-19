document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.login-admin');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('enter-pass').value;

    try {
      const response = await fetch('https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/adminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.role === 'admin') {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role);
        window.location.href = 'admin-dashboard.html';
      } else {
        alert(data.message || 'Access denied.');
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    }
  });
});