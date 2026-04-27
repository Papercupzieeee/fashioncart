async function login(event) {
  event.preventDefault();
  const API_BASE = "http://localhost:5000/api/auth";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");
  const successDiv = document.getElementById("loginSuccess");

  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  if (!email || !password) {
    errorDiv.textContent = "Please fill in all fields.";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    let data = {};
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("Failed to parse login response", parseError);
    }

    if (!res.ok || data.success === false) {
      errorDiv.textContent = data.message || data.error || "Invalid email or password.";
      errorDiv.style.display = "block";
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    successDiv.textContent = data.message || "Login successful.";
    successDiv.style.display = "block";

    setTimeout(() => {
      window.location.href = "fashion.html";
    }, 1000);
  } catch (error) {
    console.error(error);
    errorDiv.textContent = "Server error. Please try again later.";
    errorDiv.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }
});