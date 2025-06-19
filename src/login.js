document.querySelector('.create-form').addEventListener('submit', async (e) => {
    e.preventDefault();


    const email = document.getElementById('create-email').value;
    const pass = document.getElementById('set-pass').value;
    const verify = document.getElementById('verify-pass').value;

    if (pass !== verify) {
        alert("Passwords do not match.");
        return;
    }

    const response = await fetch('https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/createUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password: pass})
    });

    const data = await response.json();
    alert(data.message || "Account created!");
});

document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('enter-pass').value;

    const response = await fetch('https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/loginUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        window.location.href = "index.html";
    } else {
        alert(data.message || "Login failed.");
    }
});