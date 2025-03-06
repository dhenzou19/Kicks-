let billItems = {};

$(document).ready(function() {
    // Load all categories and products initially
    loadCategories();
    loadProducts('all');

    // Event delegation for category buttons
    $('#categoriesSection').on('click', '.category-btn', function() {
        const category = $(this).data('category');
        loadProducts(category);
    });

    // Event delegation for product cards
    $('#productsGrid').on('click', '.product-card', function() {
        const productId = $(this).data('id');
        const productName = $(this).data('name');
        const productPrice = $(this).data('price');
        addToBill(productId, productName, productPrice);
    });

    // Event delegation for quantity controls
    $('#billItems').on('click', '.quantity-btn', function() {
        const productId = $(this).closest('.bill-item').data('id');
        const action = $(this).data('action');
        updateQuantity(productId, action);
    });
});

function loadCategories() {
    $.ajax({
        url: 'get_categories.php',
        type: 'GET',
        success: function(response) {
            const categories = JSON.parse(response);
            let html = '<button class="category-btn" data-category="all">All Products</button>';
            
            categories.forEach(category => {
                html += `<button class="category-btn" data-category="${category}">${category}</button>`;
            });
            
            $('#categoriesSection').html(html);
        }
    });
}

function loadProducts(category) {
    $.ajax({
        url: 'get_products.php',
        type: 'GET',
        data: { category: category },
        success: function(response) {
            const products = JSON.parse(response);
            let html = '';
            
            products.forEach(product => {
                html += `
                    <div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <img src="${product.image_path}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>$${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                    </div>
                `;
            });
            
            $('#productsGrid').html(html);
        }
    });
}

function addToBill(productId, name, price) {
    if (billItems[productId]) {
        updateQuantity(productId, 'increase');
        return;
    }

    billItems[productId] = {
        name: name,
        price: parseFloat(price),
        quantity: 1
    };

    renderBillItem(productId);
    updateTotal();
}

function renderBillItem(productId) {
    const item = billItems[productId];
    const html = `
        <div class="bill-item" data-id="${productId}">
            <div>
                <div>${item.name}</div>
                <div>$${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="bill-item-controls">
                <button class="quantity-btn" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-action="increase">+</button>
            </div>
        </div>
    `;

    // If item already exists, replace it, otherwise append
    const existingItem = $(`#billItems .bill-item[data-id="${productId}"]`);
    if (existingItem.length) {
        existingItem.replaceWith(html);
    } else {
        $('#billItems').append(html);
    }
}

function updateQuantity(productId, action) {
    if (!billItems[productId]) return;

    if (action === 'increase') {
        billItems[productId].quantity++;
    } else if (action === 'decrease') {
        billItems[productId].quantity--;
        if (billItems[productId].quantity <= 0) {
            delete billItems[productId];
            $(`#billItems .bill-item[data-id="${productId}"]`).remove();
            updateTotal();
            return;
        }
    }

    renderBillItem(productId);
    updateTotal();
}

function updateTotal() {
    let total = 0;
    for (let id in billItems) {
        total += billItems[id].price * billItems[id].quantity;
    }
    $('#billTotal').text(total.toFixed(2));
}

// Add event listener for checkout button
$('#checkoutBtn').on('click', function() {
    if (Object.keys(billItems).length === 0) {
        alert('Please add items to the bill first');
        return;
    }
    printReceipt();
});

function printReceipt() {
    // Generate receipt HTML
    let receiptHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h2>SALES RECEIPT</h2>
                <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="receipt-items">
    `;

    // Add items to receipt
    for (let id in billItems) {
        const item = billItems[id];
        const total = (item.price * item.quantity).toFixed(2);
        receiptHTML += `
            <div class="receipt-item">
                <div>
                    ${item.name} x${item.quantity}<br>
                    <small>$${item.price.toFixed(2)} each</small>
                </div>
                <div>$${total}</div>
            </div>
        `;
    }

    // Add total to receipt
    receiptHTML += `
            </div>
            <div class="receipt-total">
                <div class="receipt-item">
                    <div>Total:</div>
                    <div>$${$('#billTotal').text()}</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p>Thank you for your purchase!</p>
            </div>
        </div>
    `;

    // Create temporary container for receipt
    const receiptWindow = window.open('', '', 'width=350,height=600');
    receiptWindow.document.write('<html><head><title>Receipt</title>');
    
    // Add styles to receipt window
    const styles = document.getElementsByTagName('style')[0].innerHTML;
    receiptWindow.document.write('<style>' + styles + '</style>');
    receiptWindow.document.write('</head><body>');
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.write('</body></html>');
    
    // Print the receipt
    setTimeout(() => {
        receiptWindow.print();
        receiptWindow.close();
        
        // Clear the bill after printing
        billItems = {};
        $('#billItems').empty();
        updateTotal();
    }, 250);
}   