// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return ''
}
async function getProducts() {
    let response = await fetch("store_db.json")
    let products = await response.json()
    return products
}

getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }
    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }

})
function getCardHTML(product) {
    return `<div class="my-card" style="">
            <img src="images/${product.image}">
            <h5 class="text-my-card">${product.title}</h5>
            <p class="description-card"> ${product.description} </p>
            <p class="price-card">${product.price} грн</p>
            <p class="price-volume">${product.volume}</p>
            <button type="button" data-product='${JSON.stringify(product)}'
             class="cart-btn">Купити</button>
        </div>`
}

class ShoppingCart {
    constructor() {
        this.items = {} // об’єкт з товарами у кошику
        this.cartCounter = document.querySelector('.cart-counter')
        this.loadCartFromCookies()
        this.cartElement = document.querySelector('#cart-items')
    }

    addItem(item) { // Додавання товару до кошика 
        if (this.items[item.title]) {
            // Якщо товар вже є, збільшуємо його кількість на одиницю
            this.items[item.title].quantity += 1
        } else {
            this.items[item.title] = item // Якщо товару немає, додаємо його
            this.items[item.title].quantity = 1
        }
        this.saveCartToCookies() // Зберігаємо кошик в кукі
        this.updateCounter()
    }

    // Зміна кількості товарів товарів
    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity == 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }


    saveCartToCookies() { // збереження кошика у кукі
        let cartJSON = JSON.stringify(this.items)
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`

    }

    loadCartFromCookies() { // Завантаження кошика з кукі
        let cartCookie = getCookieValue('cart')
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie)
            this.updateCounter()
        }

    }
    // Оновлення лічильника товарів
    updateCounter() {
        let count = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            count += this.items[key].quantity; // рахуємо кількість усіх товарів
        }
        this.cartCounter.innerHTML = count; // оновлюємо лічильник на сторінці
    }

    calculateTotal() {
        let total = 0  // загальна вартість замовлення
        for (let key in this.items) {
            total += this.items[key].price * this.items[key].quantity
        }
        return total
    }
}
let cart = new ShoppingCart() // Створення об'єкта кошика
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product')
    const product = JSON.parse(productData) // перетворюємо JSON у об’єкт
    // Тут будемо додавати товар до кошика
    cart.addItem(product)
    console.log(cart)
}
// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('cart.html');
});
// Функція пошуку товарів
function searchProducts(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки при відправці форми

    let query = document.querySelector('#searchForm input').value.toLowerCase();
    let productsList = document.querySelector('.products-list');
    productsList.innerHTML = ''; // Очищуємо список товарів

    // Відображаємо товари на сторінці
    getProducts().then(function (products) {
        let productsList = document.querySelector('.products-list')
        products.forEach(function (product) {
            if (product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)) {
                productsList.innerHTML += getCardHTML(product)
            }
        })

        // Отримуємо всі кнопки "Купити" на сторінці
        let buyButtons = document.querySelectorAll('.products-list .cart-btn');
        // Навішуємо обробник подій на кожну кнопку "Купити"
        if (buyButtons) {
            buyButtons.forEach(function (button) {
                button.addEventListener('click', addToCart);
            });
        }
    })
}

// Навішуємо обробник подій на форму пошуку
let searchForm = document.querySelector('#searchForm')
searchForm.addEventListener('submit', searchProducts);
