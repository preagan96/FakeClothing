document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    document.getElementById("checkout-items").innerHTML = "<p>Please sign in to proceed with checkout.</p>";
    return;
  }

  try {
    const res = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/getCart", {
      method: "GET",
      headers: { Authorization: token }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load cart");

    const cart = data.cart || [];
    const container = document.getElementById("checkout-items");
    const totalDisplay = document.getElementById("checkout-total");
    let total = 0;

    container.innerHTML = "";
    cart.forEach(item => {
      total += parseFloat(item.price);

      const itemEl = document.createElement("div");
      itemEl.className = "checkout-item";
      itemEl.innerHTML = `
        <img src="../public/${item.name}.png" alt="${item.name}">
        <div class="checkout-item-details">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>Size: ${item.size}</p>
        </div>
      `;
      container.appendChild(itemEl);
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;

    document.getElementById("place-order-btn").addEventListener("click", async () => {
      const confirm = window.confirm("Are you sure you want to place the order?");
      if (!confirm) return;

      const response = await fetch("https://swwrm4jqjk.execute-api.us-east-2.amazonaws.com/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ total })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        window.location.href = "index.html";
      } else {
        alert(result.message || "Failed to place order.");
      }
    });

  } catch (err) {
    console.error("Checkout error:", err);
    document.getElementById("checkout-items").innerHTML = "<p>Error loading cart.</p>";
  }
});