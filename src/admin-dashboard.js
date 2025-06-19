const API_BASE = 'https://swwrm4jqjk.execute-api.us-east-2.amazonaws.com';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'admin-login.html';
    return;
  }

  loadInventory(token);
  loadOrders(token);
});

async function loadInventory(token) {
  const container = document.getElementById('inventory-controls');
  container.innerHTML = 'Loading inventory...';

  try {
    const res = await fetch(`${API_BASE}/getInventory`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    const data = await res.json();

    if (!Array.isArray(data.items)) throw new Error("Invalid inventory data");

    container.innerHTML = '';
    data.items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('inventory-item');
      div.innerHTML = `
        <strong>${item.name}</strong> (ID: ${item.id})<br>
        Price: $${item.price}<br>
        Small: <input type="number" value="${item['small quantity']}" id="small-${item.id}"><br>
        Medium: <input type="number" value="${item['medium quantity']}" id="medium-${item.id}"><br>
        Large: <input type="number" value="${item['large quantity']}" id="large-${item.id}"><br>
        <img src="${item.image}" alt="${item.name}" style="max-width: 150px;"><br>
        <button onclick="updateProductQuantities('${item.id}', '${token}')">Save</button>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error('Failed to load inventory:', err);
    container.innerHTML = 'Error loading inventory.';
  }
}

async function updateProductQuantities(id, token) {
  const smallQty = document.getElementById(`small-${id}`).value;
  const mediumQty = document.getElementById(`medium-${id}`).value;
  const largeQty = document.getElementById(`large-${id}`).value;

  try {
    const res = await fetch(`${API_BASE}/updateProductQuantities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        id,
        small: parseInt(smallQty),
        medium: parseInt(mediumQty),
        large: parseInt(largeQty)
      })
    });

    const data = await res.json();
    alert(data.message || "Update complete");

  } catch (err) {
    console.error("Failed to update product:", err);
    alert("Failed to update product");
  }
}

async function loadOrders(token) {
  const container = document.getElementById('orders-list');
  container.innerHTML = 'Loading orders...';

  try {
    const res = await fetch(`${API_BASE}/getOrders`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    const data = await res.json();

    if (!Array.isArray(data.orders)) throw new Error("Invalid orders data");

    container.innerHTML = '';
    data.orders.forEach(order => {
      const div = document.createElement('div');
        div.classList.add('order-item');

        const itemsHtml = order.items.map(item => `
        - ${item.name} (Size: ${item.size}, $${item.price})
        `).join('<br>');

        div.innerHTML = `
        <strong>Order ID:</strong> ${order.orderid}<br>
        <strong>Customer:</strong> ${order.email}<br>
        <strong>Date:</strong> ${new Date(order.date).toLocaleString()}<br>
        <strong>Status:</strong> ${order.status}<br>
        <strong>Total:</strong> $${order.total}<br>
        <strong>Items:</strong><br>${itemsHtml}<br>
        <button onclick="shipOrder('${order.email}', '${order.orderid}', '${token}')">Ship</button>
        <hr>
        `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error('Failed to load orders:', err);
    container.innerHTML = 'Error loading orders.';
  }
}

async function shipOrder(email, orderid, token) {
  if (!confirm(`Ship order ${orderid}? This will remove it from the database.`)) return;

  try {
    const res = await fetch(`${API_BASE}/shipOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ email, orderid })
    });

    const data = await res.json();
    alert(data.message || "Order shipped");

    // Refresh the order list
    loadOrders(token);

  } catch (err) {
    console.error("Failed to ship order:", err);
    alert("Failed to ship order");
  }
}