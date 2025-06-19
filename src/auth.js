async function verifyUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const res = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/verifyToken", {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });

    if (res.ok) {
      return await res.json();
    } else {
      localStorage.removeItem("authToken");
      return false;
    }
  } catch (error) {
    console.error("verifyUser failed:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = await verifyUser();

  if (user) {
    document.getElementById("user-info").style.display = "flex";
    document.getElementById("welcome-message").textContent = `Welcome, ${user.email}`;
    document.getElementById("sign-in-link").style.display = "none";
  }
});