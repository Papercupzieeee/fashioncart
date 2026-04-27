async function signup(event) {
  event.preventDefault();
  const API_BASE = "http://localhost:5000/api/auth";

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const errorDiv = document.getElementById("signupError");
  const successDiv = document.getElementById("signupSuccess");

  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  if (!name || !email || !password || !confirmPassword) {
    errorDiv.textContent = "Please fill in all fields.";
    errorDiv.style.display = "block";
    return;
  }

  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match.";
    errorDiv.style.display = "block";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long.";
    errorDiv.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    let data = {};
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("Failed to parse signup response", parseError);
    }

    if (!res.ok || data.success === false) {
      errorDiv.textContent = data.message || data.error || "Signup failed.";
      errorDiv.style.display = "block";
      return;
    }

    successDiv.textContent = data.message || "Signup successful. Please log in.";
    successDiv.style.display = "block";

    setTimeout(() => {
      if (typeof switchTab === "function") {
        switchTab("login");
      } else {
        window.location.href = "index.html";
      }
    }, 1500);
  } catch (error) {
    console.error(error);
    errorDiv.textContent = "Server error. Please try again later.";
    errorDiv.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", signup);
  }
});