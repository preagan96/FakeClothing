document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    document.getElementById("cart-grid").innerHTML = "<p>Please sign in to view your cart.</p>";
    return;
  }

  try {
    const res = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/getCart", {
      method: "GET",
      headers: { Authorization: token }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

    const cart = data.cart || [];
    const container = document.getElementById("cart-grid");
    const totalDisplay = document.getElementById("cart-total");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
      total += parseFloat(item.price);

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";

      itemEl.innerHTML = `
        <img src="../public/${item.name}.png" alt="${item.name}">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>Size: ${item.size}</p>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      container.appendChild(itemEl);
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;

    // Add listener to each remove button
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));

        const res = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/removeFromCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({ index })
        });

        const result = await res.json();
        if (res.ok) {
          location.reload(); // Refresh to reflect update
        } else {
          alert(result.message || "Failed to remove item.");
        }
      });
    });

  } catch (err) {
    console.error("Error loading cart:", err);
    document.getElementById("cart-grid").innerHTML = "<p>Error loading cart.</p>";
  }
});