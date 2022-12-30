// find a way of deleting one item at a time
// let units;
let cart = JSON.parse(localStorage.getItem('cart'));
let cartDiv = document.getElementById('cartDiv');
let deleteCart = document.getElementById('delete-cart').addEventListener('click', emptyCart, false);
let total = document.getElementById('total');
let subtotal = document.getElementById('subtotal');
let cartEmpty = document.getElementById('cart-empty');
let message = document.getElementById('message');

// Ensures there is something in cart before continuing to pay
let payBtn = document.getElementById('go-to-pay').addEventListener('click', goToPayment, false);

function goToPayment(){
  let totalItems = localStorage.getItem('total');
  
  if (isloggedIn === 'false'){
    message.innerHTML = "";
        message.innerHTML += `
        <br>
        <br>
        <div class="alert alert-danger text-center mb-3" id="payment-failure" role="alert">
        Please <a href="login.html">login</a> before proceeding!
        </div>
        `;
  }
  else if (totalItems < 1) {
    message.innerHTML = "";
        message.innerHTML += `
        <br>
        <br>
        <div class="alert alert-danger text-center mb-3" id="payment-failure" role="alert">
        Please add something to your cart!
        </div>
        `;
  }
  else {
    document.location.href = 'payment.html';
  }
}

// RENDER CART ITEMS by iterating through product.js
function renderCartItems() {
  cartDiv.innerHTML = "";
  cart.forEach((item) => {
    // units = item.units;
    cartDiv.innerHTML += `
      <div class="card rounded-3 mb-4">
      <div class="card-body p-4">
        <div class="row d-flex justify-content-between align-items-center">
          <div class="col-md-2 col-lg-2 col-xl-2">
            <img
              src="${item.imgSrc}"
              class="img-fluid rounded-3" alt="game">
          </div>
          <div class="col-md-3 col-lg-3 col-xl-3">
            <p class="lead fw-normal mb-2">${item.name}</p>
          </div>
          <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
            <button class="btn btn-link px-2"
              onclick="changeNumberofUnits('minus', ${item.id})">
              <i class="fas fa-minus"></i>
            </button>

            <input id="form1" min="0" name="quantity" value="${item.units}" readonly
              class="form-control form-control-sm" />

            <button class="btn btn-link px-2"
              onclick="changeNumberofUnits('plus', ${item.id})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
            <h5 class="mb-0">&euro;${item.price * item.units}</h5>
          </div>
          <div class="col-md-1 col-lg-1 col-xl-1 text-end">
            <a href="#!" onclick="removeItemFromCart(${item.id})" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>
          </div>
        </div>
      </div>
    </div>
          `;
  });
}

if(localStorage.getItem('total') == 0){
  cartIsEmpty();
}
else{
  updateCart();
}

function updateCart() {
  cartEmpty.innerHTML = "";
  renderCartItems();
  renderSubTotal();
  displayTotal();

  if(localStorage.getItem('total') < 1){
    cartIsEmpty();
  }
}

function cartIsEmpty(){
  cartEmpty,innerHtml = "";
  cartEmpty.innerHTML = `<img class="emptycart" src="images/emptycart.png" alt="empty cart">
  <h1 class="text-center">Cart is empty!</h1>
  <h6 class="text-center">Add something to make me happy :)</h6>
  <br><br>`;
}

function removeItemFromCart(id){
  cart.forEach((item) => {
    if(item.id === id){
      let units = item.units;
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      editTotal(units);
    }
  });
}

function editTotal(units){
  let totalItems = localStorage.getItem('total');
  localStorage.setItem('total', totalItems - units);
  updateCart();
}

function renderSubTotal() {
  let totalPrice = 0;
  let totalItems = localStorage.getItem('total');

  cart.forEach((item) => {
    totalPrice += item.price * item.units;
  });

  subtotal.innerHTML = `Subtotal (${totalItems} items): &euro;${totalPrice.toFixed(2)}`;
  localStorage.setItem('subtotal', totalPrice);
}

function changeNumberofUnits(action, id) {
  cart = cart.map((item) => {
    let units = item.units;
    if (item.id === id) {
      if (action === 'plus') {
        units++;
        changeTotalItems('plus');
      }
      else if (action === 'minus' && units > 1) {
        units--;
        changeTotalItems('minus');
      }
      else {
        alert('Invalid Number of Item!');
      }
    }
    return {
      ...item,
      units,
    };
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function emptyCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  changeTotalItems('empty');
  updateCart();
  cartIsEmpty();
}

function changeTotalItems(action) {

  let totalItems = localStorage.getItem('total');

  if (action === 'plus') {
    totalItems++;
  }
  else if (action === 'minus') {
    totalItems--;
  }
  else if (action === 'empty') {
    totalItems = 0;
  }
  localStorage.setItem('total', totalItems);
  displayTotal(); // function from main.js
}

