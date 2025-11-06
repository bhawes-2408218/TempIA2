//------------------------CUSTOMER AUTHENTIFICATION-------------------------
//Redirects User to Homepage after Registering
function register(event){
    event.preventDefault();
    store();
    window.location.href = "index.html";
}

//Storing User Input from the Reigstration Form
function store(){
    var fname = document.getElementById("fname");
    var lname = document.getElementById("lname");
    var email = document.getElementById("email");
    var uname = document.getElementById("uname");
    var pass = document.getElementById("pass");

    localStorage.setItem("fname", fname.value);
    localStorage.setItem("lname", lname.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("uname", uname.value);
    localStorage.setItem("pass", pass.value);
}

//Redirecting User to Homepage after Login
function check(event){
    //Data Stored from Registration Form
    var uname = localStorage.getItem("uname");
    var pass = localStorage.getItem("pass");

    //Data Stored from Login Form
    var userName = document.getElementById("userName");
    var userPword = document.getElementById("userPword");

    //Compares Login Input with the Input from the Local Storage
    if(userName.value !== uname || userPword.value !== pass){
        alert("Incorrect username or password");
    } else{
        event.preventDefault();
        window.location.href = "index.html";
    }
}

//For Password Visibility
function showpassword(){
    var password = document.getElementById("pass");
    if(password.type === "password"){
        password.type = "text";
    } else{
        password.type = "password";
    }
}

//--------------------------INVENTORY SETUP-------------------------------
const inventory = new Map([
    ["Lavender and Vanilla Body Wash", {price: 2500, stock: 1000}],
    ["Citrus and Vanilla Body Wash", {price: 2500, stock: 1000}],
    ["Coconut Body Wash", {price: 2500, stock: 1000}],
    ["Vanilla Body Wash", {price: 2500, stock: 1000}],
    ["Sandalwood and Sage Body Wash", {price: 2500, stock: 1000}],
    ["Lavender and Vanilla Body Butter", {price: 2200, stock: 1000}],
    ["Citrus and Vanilla Body Butter", {price: 2200, stock: 1000}],
    ["Coconut Body Butter", {price: 2200, stock: 1000}],
    ["Vanilla Body Butter", {price: 2200, stock: 1000}],
    ["Sandalwood and Sage Body Butter", {price: 2200, stock: 1000}],
    ["Lavender and Vanilla Body Lotion", {price: 1700, stock: 1000}],
    ["Citrus and Vanilla Body Lotion", {price: 1700, stock: 1000}],
    ["Coconut Body Lotion", {price: 1700, stock: 1000}],
    ["Vanilla Body Lotion", {price: 1700, stock: 1000}],
    ["Sandalwood and Sage Body Lotion", {price: 1700, stock: 1000}],
    ["Lavender and Vanilla Body Mist", {price: 2000, stock: 1000}],
    ["Citrus and Vanilla Body Mist", {price: 2000, stock: 1000}],
    ["Coconut Body Mist", {price: 2000, stock: 1000}],
    ["Vanilla Body Mist", {price: 2000, stock: 1000}],
    ["Sandalwood and Sage Body Mist", {price: 2000, stock: 1000}],
    ["Lavender and Vanilla Body Oil", {price: 1400, stock: 1000}],
    ["Citrus and Vanilla Body Oil", {price: 1400, stock: 1000}],
    ["Coconut Body Oil", {price: 1400, stock: 1000}],
    ["Vanilla Body Oil", {price: 1400, stock: 1000}],
    ["Sandalwood and Sage Body Oil", {price: 1400, stock: 1000}],
    ["Lavender and Vanilla Body Scrub", {price: 2300, stock: 1000}],
    ["Citrus and Vanilla Body Scrub", {price: 2300, stock: 1000}],
    ["Coconut Body Scrub", {price: 2300, stock: 1000}],
    ["Vanilla Body Scrub", {price: 2300, stock: 1000}],
    ["Sandalwood and Sage Body Scrub", {price: 2300, stock: 1000}],
])

let cart = [];

//-----------------------------CART FUNCTIONS-----------------------------
//Function to Add Product in the Cart
function addToCart(name, quantity){ 
    const product = inventory.get(name);
    if(!product) return;
    
    //Check if quantity is greater than the product stock
    if(quantity > product.stock){
        alert(`Only ${product.stock} left in stock. `);
        return;
    }
    
    const existing = cart.find(item => item.name === name); //Stores the find item function in existing
    if(existing){
        if(existing.quantity + quantity <= product.stock){
            existing.quantity += quantity;
        } else{
            alert(`Only ${product.stock} left in stock. `);
            return;
        }
    } else{ //Add new product to the cart
        cart.push({name, price: product.price, quantity});
    }

    product.stock -= quantity;
    inventory.set(name, product);
    saveCart();
    updateCart();
}

function updateCart(){
    const cartArea = document.getElementById("cartitems");
    const sub = document.getElementById("subtotal");
    const disc = document.getElementById("discount");
    const taxx = document.getElementById("tax");
    const totall = document.getElementById("total");

    if(!cartArea) return;

    cartArea.innerHTML = "";

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        cartArea.innerHTML +=  `${product.name} x ${product.quantity} - $${itemTotal.toLocaleString()} 
        <button onclick = "removeItem('${product.name}')"> Remove </button> </br>`;
    });

    const totals = CalculateTotals(cart);

    sub.textContent = totals.subtotal.toLocaleString();
    disc.textContent = totals.discount.toLocaleString();
    taxx.textContent = totals.tax.toLocaleString();
    totall.textContent = totals.total.toLocaleString();
}

//Calculates the total fees to be charged
function CalculateTotals(cart){
    let subtotal = 0;

    cart.forEach(product => {
        subtotal += product.price * product.quantity;
    });

    const discount = subtotal >= 5000 ? subtotal * 0.15 : 0;
    const tax = subtotal * 0.15;
    const shippingtax = subtotal > 0 ? 1500 : 0;
    const total = subtotal - discount + tax + shippingtax;

    return{subtotal, shippingtax, discount, tax, total};
}

//Removes an item from the cart
function removeItem(name){
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCart();
}

//Converts items in cart to string to be store in localStorage
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart(){
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();
}

//-------------------------CHECKOUT FUNCTIONS------------------------------
function CheckOut(){
    const checkoutt = document.getElementById("checkoutitems");
    const subt = document.getElementById("subtotal");
    const shippin = document.getElementById("shippingfee");
    const dis = document.getElementById("discount");
    const taxx = document.getElementById("tax");
    const totall = document.getElementById("total");

    cart = JSON.parse(localStorage.getItem("cart")) || [];
    checkoutt.innerHTML = "";

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        checkoutt.innerHTML +=  `${product.name} x ${product.quantity} - $${itemTotal.toLocaleString()}</br>`; 
    });

    const totals = CalculateTotals(cart);

    subt.textContent = totals.subtotal.toLocaleString();
    shippin.textContent = totals.shippingtax.toLocaleString();
    dis.textContent = totals.discount.toLocaleString();
    taxx.textContent = totals.tax.toLocaleString();
    totall.textContent = totals.total.toLocaleString();
}

function CheckRequInputs(selector){
    const inputs = document.querySelectorAll(`${selector} input[required]`);
    let isvalid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.border = "2px solid red";
            isvalid = false;
        } else {
            input.style.border = "1px solid #a86a65";
        }
    });

    return isvalid;
}

function TogglePanel(selectorElement){
    const panel = (typeof selectorElement === 'string') ? document.querySelector(selectorElement) : selectorElement;

    if(panel){
        panel.classList.toggle("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    
    document.getElementById("editshipping").addEventListener("click", () => {
        TogglePanel(".shipping-panel");
    })

    document.getElementById("confirmchange").addEventListener("click", () => {
        const valid = CheckRequInputs(".shipping-panel");

        if (!valid) {
            alert("All required fields must be occupied before attempting to Check Out");
            return;
        }

        alert("Shipping details confirmed.");
    });

    document.getElementById("cancelchange").addEventListener("click", () => {
        const inputs = document.querySelectorAll(".shipping-panel input");

        inputs.forEach(input => {
        input.value = "";
        input.style.border = "1px solid #a86a65";
        });

        TogglePanel(".shipping-panel");
    });

    document.getElementById("clearall").addEventListener("click", () => {
        localStorage.removeItem("cart");
        CheckOut();
        alert("Your cart is now empty");
    });

    document.getElementById("check-out").addEventListener("click", () => {
        const valid = CheckRequInputs(".ship");

        if (!valid) {
            alert("All required fields must be occupied before attempting to Check Out");
            return;
        }

        alert("Order successfully placed! Thank you for shopping with Lunar Essence!");
        localStorage.removeItem("cart");
        CheckOut();
    });

    document.getElementById("close").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    CheckOut();
});

//-------------------------DOM MANIPULATIONS-------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    document.querySelectorAll(".bwash, .bbutter, .blotion, .bmist, .bodyoil, .bscrub").forEach(prod => {
        const name = prod.dataset.name;
        const price = parseFloat(prod.dataset.price);

        //Reveals the Quantity Panel when clicked
        prod.addEventListener("click", () => {
            const panel = prod.querySelector(".quan-panel");
            TogglePanel(panel);
        });

        const addbtn = prod.querySelector(".addbtn");
        const qntyinput = prod.querySelector(".qntyinput");

        addbtn.addEventListener("click", (p) => {
            p.stopPropagation(); //Prevent the card click re-triggering
            const quantity = parseInt(qntyinput.value);
            if(isNaN(quantity) || quantity < 1) return; //checks if the input is a number or less than 1
            addToCart(name, quantity);
        });
    });
});














