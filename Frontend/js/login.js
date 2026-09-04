document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('role');
  const loginButton = document.getElementById('login-button');

  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const roleError = document.getElementById('role-error');
  const formError = document.getElementById('form-error');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ---------- MOCK "DATABASE" ----------
  // Fake accounts to test with, until the real backend exists.
  // Format: email, password, and role must ALL match for login to succeed.
  const MOCK_USERS = [
    { email: 'farmer@test.com', password: 'password123', role: 'farmer' },
    { email: 'consumer@test.com', password: 'password123', role: 'consumer' },
    { email: 'admin@test.com', password: 'password123', role: 'admin' },
  ];

  // Where each role should be redirected after successful login.
  // These pages don't exist yet — we'll build them in a later phase.
  const ROLE_DASHBOARDS = {
    farmer: 'farmer-dashboard.html',
    consumer: 'consumer-dashboard.html',
    admin: 'admin-dashboard.html',
  };

  function clearErrors() {
    emailError.textContent = '';
    passwordError.textContent = '';
    roleError.textContent = '';
    formError.textContent = '';
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    if (email === '') {
      emailError.textContent = 'Email is required.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (password === '') {
      passwordError.textContent = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (role === '') {
      roleError.textContent = 'Please select a role.';
      isValid = false;
    }

    return isValid;
  }

  // ---------- MOCK LOGIN REQUEST ----------
  // This function pretends to be an API call. It returns a Promise
  // (a JavaScript object representing "something that will finish later"),
  // which is exactly how a real fetch() call to a backend behaves too.
  // Later, we will replace ONLY the inside of this function with a real
  // fetch() call — nothing else in this file will need to change.
  function mockLoginRequest(email, password, role) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchedUser = MOCK_USERS.find(
          (user) => user.email === email && user.password === password
        );

        if (!matchedUser) {
          reject(new Error('Incorrect email or password.'));
          return;
        }

        if (matchedUser.role !== role) {
          reject(new Error('This account is not registered under the selected role.'));
          return;
        }

        resolve({
          email: matchedUser.email,
          role: matchedUser.role,
        });
      }, 800); // fake 800ms network delay
    });
  }

  function setLoadingState(isLoading) {
    loginButton.disabled = isLoading;
    loginButton.textContent = isLoading ? 'Logging in...' : 'Login';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    setLoadingState(true);

    try {
      const user = await mockLoginRequest(email, password, role);

      // Save minimal, non-sensitive session info so other pages know
      // someone is "logged in." We store this for the current browser
      // tab session only — it clears when the tab is closed.
      sessionStorage.setItem('farmerConnectUser', JSON.stringify(user));

      // Redirect to the correct dashboard based on role
      window.location.href = ROLE_DASHBOARDS[user.role];

    } catch (error) {
      formError.textContent = error.message;
    } finally {
      setLoadingState(false);
    }
  });

  emailInput.addEventListener('input', () => {
    emailError.textContent = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordError.textContent = '';
  });

  roleSelect.addEventListener('change', () => {
    roleError.textContent = '';
  });

});