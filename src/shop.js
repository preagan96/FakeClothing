fetch("https://swwrm4jqjk.execute-api.us-east-2.amazonaws.com/GetProducts")
    .then(res => res.json())
    .then(products => {
        const grid = document.getElementById("product-grid");
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            const localImagePath = `../public/${product.name}.png`;
            card.innerHTML = `
            <a href="product.html?item=${product.id}" class="product-link">
                <img src="${localImagePath}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </a>
        `;
        grid.appendChild(card);
        });
    });