const params = new URLSearchParams(window.location.search);
const itemId = params.get('item');
console.log("itemId:", itemId);

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
        } else {
            document.querySelector('.product-layout').innerHTML = "<p>Product not found.</p>";
        }
    })
    .catch(err => {
        console.error("Failed to load product:", err);
        document.querySelector('.product-layout').innerHTML = "<p>Error loading product.</p>";
    });