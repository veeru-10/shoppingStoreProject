let allProducts = [];
async function fetchData(callback) {
  const container = document.getElementById('row2');
  container.innerHTML = `
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  <div class="product-card product-card-shimmer-ui">
    <div class="card h-100 bg-transparent border shadow"></div>
  </div>
  `
  const response = await fetch('https://fakestoreapi.com/products');
  allProducts = await response.json();
  callback(allProducts);
  setUpFilterListeners();
}
fetchData(getData);

function setUpFilterListeners() {
  const checkboxes = document.querySelectorAll('.form-check-input');
  const search = document.getElementById('search');
  const searchForm = document.querySelector('form[role="search"]');
  
  checkboxes.forEach(checkBox => {
    checkBox.addEventListener('change', applyFilters);
  })
  search.addEventListener('input', applyFilters);
  
  // Prevent form submission to keep search input active
  searchForm.addEventListener('submit', (e) => e.preventDefault());
}

function applyFilters() {
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map(input => input.value)
  const selectedPrices = Array.from(
    document.querySelectorAll('input[name="price"]:checked')
  ).map(input => ({
    min: parseInt(input.dataset.min),
    max: parseInt(input.dataset.max)
  }));
  const search = document.getElementById('search');
  
  // filtered Products
  let filtered = allProducts;
  if(selectedCategories.length > 0 && !selectedCategories.includes('all')) {
    filtered = filtered.filter(product => selectedCategories.includes(product.category));
  }

  if(selectedPrices.length > 0 && selectedPrices[0].min !== -1) {
    filtered = filtered.filter(product=> {
      const displayPrice = product.price * 10;
      return selectedPrices.some(range => displayPrice >= range.min && displayPrice <= range.max);
    });
  }
  
  // Search filter
  if(search.value.trim()) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  getData(filtered);
}

function getData(products) {
  const container = document.getElementById('row1');
  const productsHtml = products.map(product => {
    return `
      <div class="product-card">
        <div class="card h-100 bg-transparent border shadow">
          <div class="img-container pt-3"><img src='${product.image}' class="card-img-top product-img" alt="${product.category}"></div>
          <div class="card-body">
            <h6 class="card-title product-title">${product.title}</h6>
            <p class="card-text product-des text-secondary">${product.description.length > 50 ? product.description.slice(0, 50) + "...": product.description }</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item product-cat">Category - <span class="text-danger">${product.category}</span></li>
            <li class="list-group-item product-price">price - <span class="ms-2 badge bg-success">${((product.price) * 10).toFixed(2)}</span></li>
            <li class="list-group-item product-rating">Rating : <span class="text-warning fw-bold">${product.rating.rate}</span></li>
          </ul>
        </div>
      </div>
    `
  }).join('');

  container.innerHTML = productsHtml;
}

