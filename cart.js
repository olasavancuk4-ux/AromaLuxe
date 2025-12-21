// тут отримуємо елементи зі сторінки та відображаємо їх у кошику
let cart_list = document.querySelector('.cart-items-list')
let cart_total = document.querySelector('.cart-total')
let orderBtn = document.querySelector("#orderBtn")
let orderSection = document.querySelector(".order")
let order_form = document.querySelector("#order-form")

// функція для створення HTML-коду для одного товару в кошику
function get_item(item) {
    return `<div class = "cart-item">
        <h4 class="cart-item-title">${item.title}</h4>
        
        <div class="cart-item-quantity">Кількість: 
        <input data-item="${item.title}" class="form-control quantity-input" type="number" name="quantity" min="1" value="${item.quantity}">
        </div>
        <div class="cart-item-price" data-price="${item.price}">${item.price * item.quantity} грн</div>
        </div>`
}

// функція для відображення списку товарів у кошику
function showCartList() {
    // очищуємо поточний вміст списку кошика
    cart_list.innerHTML = ''
    for (let key in cart.items) { // проходимося по всіх ключах об'єкта cart.items
        cart_list.innerHTML += get_item(cart.items[key])
    }
    // оновлюємо загальну вартість кошика
    cart_total.innerHTML = cart.calculateTotal()
}

// початкове відображення списку товарів у кошику
showCartList()

// обробник події зміни кількості товару в кошику
cart_list.addEventListener('change', (event) => {
    let target = event.target
    // перевіряємо, чи змінився елемент вводу кількості
    const itemTitle = target.getAttribute('data-item')
    // отримуємо нову кількість
    const newQuantity = +target.value
    // оновлюємо кількість товару в кошику
    if (newQuantity > 0) {
        cart.updateQuantity(itemTitle, newQuantity)
        showCartList() // Оновити список товарів у кошику
    }
});

// обробник події кліку на кнопку "Оформити замовлення"
// показуємо секцію оформлення замовлення з анімацією
orderBtn.addEventListener("click", function (event) {
    orderBtn.style.display = "none"
    orderSection.style.display = "block"
    anime({
        targets: '.order',
        opacity: 1, // Кінцева прозорість (1 - повністю видимий)
        duration: 1000, // Тривалість анімації в мілісекундах
        easing: 'easeInOutQuad'
    })
})

order_form.addEventListener("submit", function (event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки при відправці форми
    alert("Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом.");
    cart.items = {} // очищуємо кошик
    cart.saveCartToCookies() // зберігаємо порожній кошик у кукі
    showCartList() // оновлюємо відображення кошика
    order_form.reset() // скидаємо форму
    orderSection.style.display = "none" // ховаємо секцію оформлення замовлення
    orderBtn.style.display = "block" // показуємо кнопку "Оформити замовлення"
})