// --- 1. Data Definitions ---
const menuItems = [
    // Burgers
    { id: 1, name: 'The OG Double Smash', price: 160, img: 'https://www.honestburgers.co.uk/wp-content/uploads/2022/08/Smashed-double-cheeseburger.png' },
    { id: 2, name: 'The Double Meltdown', price: 185, img: 'https://www.carolynscooking.com/wp-content/uploads/2020/04/Double-Smash-Burgers-with-Sauce-4-scaled.jpg' },
    { id: 3, name: 'The Blaze Burger', price: 195, img: 'https://images.squarespace-cdn.com/content/v1/5c8d51add74562eedd680e87/796f5f38-7282-4af4-a8d3-371ba9ff00b0/IMG_8025-FINAL-3.jpg' },
    { id: 4, name: 'The Greenhouse', price: 200, img: 'https://www.easycheesyvegetarian.com/wp-content/uploads/2020/08/Vegan-chicken-burgers-12.jpg' },
    { id: 5, name: 'Sunrise Smash', price: 210, img: 'https://i.ytimg.com/vi/DbvDzniNv6E/maxresdefault.jpg' },
    // Wings
    { id: 6, name: 'Honey Sriracha Wings', price: 190, img: 'https://www.chilipeppermadness.com/wp-content/uploads/2023/07/Honey-Sriracha-Chicken-Wings-Recipe-SQ2.jpg' },
    { id: 7, name: 'Black Garlic Butter Wings', price: 185, img: 'https://iloveblackgarlic.com/cdn/shop/articles/659470ccb5577b378dbf927f8c798fda.jpg?v=1764018343' },
    { id: 8, name: 'Raging Pakpak', price: 210, img: 'https://drdavinahseats.com/wp-content/uploads/2022/04/Honey-Sesame-Ghost-Pepper-Wings-.jpg' },
    { id: 9, name: 'Lemon Pepper Dry Rub', price: 180, img: 'https://www.thewickednoodle.com/wp-content/uploads/2016/01/crispy-lemon-pepper-wings.jpg' },
    { id: 10, name: 'Garlic Parmesan Glazed', price: 200, img: 'https://hips.hearstapps.com/del.h-cdn.co/assets/16/39/1474920925-delish-parmesan-garlic-wings.jpg?crop=0.979xw:0.653xh;0.0128xw,0.0929xh&resize=1200:*' },
    // Sides & Drinks
    { id: 11, name: 'Pakpak Loaded Fries', price: 110, img: 'https://princesspinkygirl.com/wp-content/uploads/2021/04/Garlic-Parmesan-Fries-24-square-1400.jpg' },
    { id: 12, name: 'Bottomless Iced Tea', price: 65, img: 'https://ourzestylife.com/wp-content/uploads/2025/05/Iced-Tea-Recipe-OurZestyLife-3.jpg' },
    { id: 13, name: 'Salted Caramel Soft Serve', price: 75, img: 'https://lifecurrentsblog.com/wp-content/uploads/2018/05/MG_5434.jpg' }
];

let currentOrder = [];

// --- 2. DOM Elements ---
const menuGrid = document.getElementById('menu-grid');
const searchBar = document.getElementById('search-bar');
const orderList = document.getElementById('order-list');
const totalDisplay = document.getElementById('total-display');
const cashInput = document.getElementById('cash-input');
const btnPay = document.getElementById('btn-pay');
const btnPrint = document.getElementById('btn-print');

// --- 3. UI Rendering Functions ---

function renderMenu(filterTerm = '') {
    menuGrid.innerHTML = ''; 
    
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(filterTerm.toLowerCase())
    );

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = item.name;

        const price = document.createElement('div');
        price.className = 'card-price';
        price.textContent = `₱${item.price}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.className = 'qty-input';
        input.placeholder = 'Qty';
        input.id = `qty-${item.id}`;

        const btn = document.createElement('button');
        btn.className = 'btn-add';
        btn.textContent = 'Add to order';
        
        btn.addEventListener('click', () => {
            const qtyVal = parseInt(input.value);
            if (qtyVal > 0) {
                addToOrder(item, qtyVal);
                input.value = ''; 
            } else {
                alert('Please enter a valid quantity.');
            }
        });

        cardBody.append(title, price, input, btn);
        card.append(img, cardBody);
        menuGrid.appendChild(card);
    });
}

function renderOrder() {
    orderList.innerHTML = '';
    let totalAmount = 0;

    if (currentOrder.length === 0) {
        orderList.innerHTML = '<li style="color: #666; text-align:center; margin-top:30px; font-style: italic;">Awaiting orders...</li>';
    }

    currentOrder.forEach((orderItem, index) => {
        const itemTotal = orderItem.price * orderItem.qty;
        totalAmount += itemTotal;

        const li = document.createElement('li');
        li.className = 'order-item';

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'order-item-details';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'order-item-title';
        titleSpan.textContent = orderItem.name;

        const subSpan = document.createElement('span');
        subSpan.className = 'order-item-sub';
        subSpan.textContent = `${orderItem.qty} x ₱${orderItem.price} = ₱${itemTotal}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeOrder(index);

        detailsDiv.append(titleSpan, subSpan);
        li.append(detailsDiv, removeBtn);
        orderList.appendChild(li);
    });

    totalDisplay.textContent = `₱${totalAmount}`;
    totalDisplay.dataset.total = totalAmount; 
}

// --- 4. State Management ---

function addToOrder(item, qty) {
    const existingItemIndex = currentOrder.findIndex(o => o.id === item.id);
    if (existingItemIndex > -1) {
        currentOrder[existingItemIndex].qty += qty;
    } else {
        currentOrder.push({ ...item, qty: qty });
    }
    renderOrder();
}

function removeOrder(index) {
    currentOrder.splice(index, 1);
    renderOrder();
}

// ... (Keep Sections 1 to 4 exactly as they are) ...

// --- 5. Checkout & Modal Logic ---
const paymentModal = document.getElementById('payment-modal');
const closeModalBtn = document.getElementById('close-modal');

// Screens
const screenSelect = document.getElementById('screen-select-method');
const screenCash = document.getElementById('screen-cash');
const screenRef = document.getElementById('screen-reference');
const screenReceipt = document.getElementById('screen-receipt');

// Modal Elements
const modalAmountDue = document.getElementById('modal-amount-due');
const methodBtns = document.querySelectorAll('.pay-method-btn');
const btnCard = document.getElementById('btn-card');
const btnOnline = document.getElementById('btn-online');
const lockoutMsg = document.getElementById('lockout-msg');

// Security / Payment State
let currentPaymentMethod = '';
let failedAttempts = 0;
let isLockedOut = false;
let lastReceipt = "";

// Show main checkout modal
btnPay.addEventListener('click', () => {
    const total = parseInt(totalDisplay.dataset.total || 0);
    if (currentOrder.length === 0) {
        alert('Your order list is empty.');
        return;
    }
    
    modalAmountDue.textContent = `₱${total}`;
    resetModalScreens();
    screenSelect.classList.remove('hidden');
    paymentModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
});

// Handle Method Selection
methodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentPaymentMethod = e.target.dataset.method;
        screenSelect.classList.add('hidden');

        if (currentPaymentMethod === 'cash') {
            screenCash.classList.remove('hidden');
            document.getElementById('modal-cash-input').value = '';
            document.getElementById('modal-cash-input').focus();
        } else {
            setupReferenceScreen(currentPaymentMethod);
        }
    });
});

// --- CASH PAYMENT LOGIC ---
document.getElementById('btn-confirm-cash').addEventListener('click', () => {
    const total = parseInt(totalDisplay.dataset.total || 0);
    const cashInput = document.getElementById('modal-cash-input');
    const cash = parseInt(cashInput.value);

    if (isNaN(cash) || cash < total) {
        alert('Insufficient cash provided! Please enter a valid amount.');
        return;
    }

    const change = cash - total;
    finalizeTransaction('CASH', cash, change);
});

// --- CARD / ONLINE PAYMENT LOGIC ---
function setupReferenceScreen(method) {
    screenRef.classList.remove('hidden');
    const title = document.getElementById('ref-title');
    const inst = document.getElementById('ref-instructions');
    const qrContainer = document.getElementById('qr-container');
    const errorMsg = document.getElementById('ref-error-msg');
    const refInput = document.getElementById('modal-ref-input');
    
    refInput.value = '';
    errorMsg.textContent = '';
    
    if (method === 'card') {
        title.textContent = 'Card Payment';
        inst.textContent = 'Please insert/swipe the card. Once approved, enter the numerical reference number below.';
        qrContainer.classList.add('hidden');
    } else if (method === 'online') {
        title.textContent = 'Online Payment';
        inst.textContent = 'Please scan the QR code to pay. Enter the reference number once completed.';
        qrContainer.classList.remove('hidden');
        // Generate random QR code using a public API
        const randomString = Math.random().toString(36).substring(7);
        document.getElementById('qr-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PAKPAK-${randomString}`;
    }
    
    refInput.focus();
}

document.getElementById('btn-confirm-ref').addEventListener('click', () => {
    const refInput = document.getElementById('modal-ref-input').value.trim();
    const errorMsg = document.getElementById('ref-error-msg');
    
    // Regex: Check if string contains ONLY numbers
    const isOnlyNumbers = /^\d+$/.test(refInput);

    if (!isOnlyNumbers) {
        failedAttempts++;
        const remaining = 3 - failedAttempts;
        
        if (failedAttempts >= 3) {
            alert('Maximum tries reached. Digital payments are disabled for 5 minutes.');
            triggerLockout();
        } else {
            errorMsg.textContent = `Invalid! Numbers only. (${remaining} attempts left)`;
        }
        return;
    }

    // Success
    failedAttempts = 0; // reset on success
    finalizeTransaction(currentPaymentMethod.toUpperCase(), totalDisplay.dataset.total, 0, refInput);
});

// --- LOCKOUT LOGIC ---
function triggerLockout() {
    isLockedOut = true;
    failedAttempts = 0;
    
    // Disable buttons
    btnCard.disabled = true;
    btnOnline.disabled = true;
    lockoutMsg.classList.remove('hidden');
    
    // Send back to selection screen
    resetModalScreens();
    screenSelect.classList.remove('hidden');

    // 5 Minute timer (300,000 ms)
    // Note: set to 5000 (5 seconds) for testing, change to 300000 for production
    setTimeout(() => {
        isLockedOut = false;
        btnCard.disabled = false;
        btnOnline.disabled = false;
        lockoutMsg.classList.add('hidden');
    }, 300000); 
}

// --- RECEIPT GENERATION ---
function finalizeTransaction(method, amountPaid, change, refNum = null) {
    const total = parseInt(totalDisplay.dataset.total);
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    
    let receipt = `
================================
           PAKPAK POS           
================================
Date: ${dateStr}
--------------------------------
`;

    currentOrder.forEach(item => {
        // Format layout so prices align nicely to the right
        const lineItem = `${item.qty}x ${item.name}`;
        const priceItem = `P${item.price * item.qty}`;
        const spaces = 32 - lineItem.length - priceItem.length;
        const pad = spaces > 0 ? " ".repeat(spaces) : " ";
        receipt += `${lineItem}${pad}${priceItem}\n`;
    });

    receipt += `--------------------------------\n`;
    receipt += `TOTAL                 P ${total}\n`;
    receipt += `PAID (${method})          P ${amountPaid}\n`;
    
    if (method === 'CASH') {
        receipt += `CHANGE                P ${change}\n`;
    } else {
        receipt += `REF NO:               ${refNum}\n`;
    }
    
    receipt += `================================\n`;
    receipt += `      WHERE EVERY BITE          \n`;
    receipt += `      HITS DIFFERENT.           \n`;
    receipt += `================================\n`;

    lastReceipt = receipt;
    document.getElementById('receipt-text').textContent = receipt;
    
    // Clear the cart
    currentOrder = [];
    renderOrder();
    
    // Show receipt screen
    resetModalScreens();
    screenReceipt.classList.remove('hidden');
}

// Start New Order Button
document.getElementById('btn-new-order').addEventListener('click', () => {
    paymentModal.classList.add('hidden');
});

// Sidebar Print Button
btnPrint.addEventListener('click', () => {
    if (lastReceipt !== "") {
        // Create a temporary window to print just the receipt text
        const printWindow = window.open('', '', 'width=400,height=600');
        printWindow.document.write(`<pre style="font-family: monospace; font-size: 14px;">${lastReceipt}</pre>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    } else {
        alert('No recent transaction to print.');
    }
});

function resetModalScreens() {
    screenSelect.classList.add('hidden');
    screenCash.classList.add('hidden');
    screenRef.classList.add('hidden');
    screenReceipt.classList.add('hidden');
    document.getElementById('ref-error-msg').textContent = '';
}

// --- 6. Live Clock Functionality ---
const clockDisplay = document.getElementById('live-clock');

function updateClock() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    clockDisplay.textContent = `${dateString}  |  ${timeString}`;
}

updateClock();
setInterval(updateClock, 1000);

// Initialize App
renderMenu();
renderOrder();