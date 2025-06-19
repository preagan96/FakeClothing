const params = new URLSearchParams(window.location.search);
const itemId = params.get('item');
console.log("itemId:", itemId);

let selectedSize = null; 


fetch(`https://swwrm4jqjk.execute-api.us-east-2.amazonaws.com/GetProducts`)
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === itemId);

    if (product) {
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-price').textContent = `$${product.price}`;
      document.getElementById('product-description').textContent = product.description;
      document.getElementById('product-image').src = `../public/${product.name}.png`;
      document.getElementById('product-image').alt = product.name;

   
      document.querySelector(".add-to-cart").addEventListener("click", () => {
        addToCart(product);
      });
    } else {
      document.querySelector('.product-layout').innerHTML = "<p>Product not found.</p>";
    }
  })
  .catch(err => {
    console.error("Failed to load product:", err);
    document.querySelector('.product-layout').innerHTML = "<p>Error loading product.</p>";
  });


document.querySelectorAll(".size-button").forEach(button => {
  button.addEventListener("click", () => {
    selectedSize = button.getAttribute("data-size");

    document.querySelectorAll(".size-button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

async function addToCart(product) {
  if (!selectedSize) {
    alert("Please select a size before adding to cart.");
    return;
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You must be logged in to add items to your cart.");
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    size: selectedSize
  };

  try {
    const response = await fetch("https://w0i5w0yab0.execute-api.us-east-2.amazonaws.com/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ product: cartItem })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Item added to cart.");
    } else {
      alert(result.message || "Failed to add to cart.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("An error occurred while adding item to cart.");
  }
}