document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const messageList = document.getElementById("message-list");
  const form = document.getElementById("message-form");
  const textarea = form.querySelector("textarea");


  fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/getMessages")
    .then(res => res.json())
    .then(data => {
      if (!data.messages) return;
      data.messages.forEach(msg => addMessageToUI(msg));
    })
    .catch(err => {
      console.error("Failed to load messages:", err);
      messageList.innerHTML = "<li>Error loading messages.</li>";
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = textarea.value.trim();
    if (!message) return;

    try {
      const res = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/postMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token })
        },
        body: JSON.stringify({ message })
      });

      const result = await res.json();
      if (res.ok) {
        addMessageToUI({ message, email: "You", timestamp: new Date().toISOString() });
        textarea.value = "";
      } else {
        alert(result.message || "Failed to post message.");
      }
    } catch (err) {
      console.error("Post failed:", err);
      alert("Error posting message.");
    }
  });

  function addMessageToUI({ email, message, timestamp }) {
    const li = document.createElement("li");
    const time = new Date(timestamp).toLocaleString();
    li.innerHTML = `<strong>${email}</strong> @ ${time}<br>${message}`;
    messageList.prepend(li);
  }
});