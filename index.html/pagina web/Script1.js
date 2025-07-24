document.addEventListener('DOMContentLoaded', function () {
    /* ==========================
       1)  MENÚ HAMBURGUESA
    ========================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu    = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('show'));

    /* ==========================
       2)  CARRITO DE COMPRAS
    ========================== */
    let cartItems           = loadCartItemsFromLocalStorage();
    const cartButton        = document.getElementById("cart-button");
    const cartModal         = document.getElementById("cart-modal");
    const closeCartBtn      = document.getElementById("close-cart");
    const cartItemsList     = document.getElementById("cart-items");
    const cartTotalElement  = document.getElementById("cart-total");
    const cartCountElement  = document.getElementById("cart-count");   // ? usarás este

    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let total = 0;
        cartItems.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - S/. ${item.price.toFixed(2)}`;
            cartItemsList.appendChild(li);
            total += item.price;
        });
        cartTotalElement.textContent = total.toFixed(2);
        cartCountElement.textContent = `(${cartItems.length})`;        // ? actualiza aquí
        saveCartItemsToLocalStorage(cartItems);
    }

    function addToCart(name, price) {
        cartItems.push({ name, price });
        updateCartUI();
    }

    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const product = btn.closest(".product-item");
            const name    = product.querySelector("h3").textContent;
            const price   = parseFloat(btn.dataset.price);
            addToCart(name, price);
        });
    });

    cartButton.addEventListener("click", e => {
        e.preventDefault();
        cartModal.style.display = "flex";
    });

    closeCartBtn.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
        alert("Gracias por tu compra. Función de pago próximamente.");
        clearCart();
        updateCartUI();
        cartModal.style.display = "none";
    });

    /* ==========================
       3)  MODAL ? Detalles producto
    ========================== */
    const productDetails = {
        arroz: {
            title: "Arroz (1?kg)",
            description: "Arroz de grano largo ideal para tus comidas diarias. Calidad garantizada.",
            image: "arroz.jpg"
        },
        aceite: {
            title: "Aceite (1?L)",
            description: "Aceite vegetal de alta calidad para todo tipo de cocciones.",
            image: "aceite.jpg"
        },
        papel: {
            title: "Papel Higiénico",
            description: "Suave y resistente. Perfecto para el uso diario en casa.",
            image: "papel.jpg"
        }
    };

    const productModal      = document.getElementById("product-modal");
    const modalTitle        = document.getElementById("modal-title");
    const modalDescription  = document.getElementById("modal-description");
    const modalImage        = document.getElementById("modal-image");
    const modalCloseBtn     = productModal.querySelector(".close-btn");

    // Abre el modal
    document.querySelectorAll(".details-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const key   = btn.dataset.product;       // arroz | aceite | papel
            const data  = productDetails[key];
            if (!data) return;

            modalTitle.textContent       = data.title;
            modalDescription.textContent = data.description;
            modalImage.src               = data.image;
            modalImage.alt               = data.title;

            productModal.style.display = "flex";
            productModal.setAttribute("aria-hidden", "false");
        });
    });

    // Cierra el modal
    modalCloseBtn.addEventListener("click", closeProductModal);
    window.addEventListener("click", e => {
        if (e.target === productModal) closeProductModal();
    });

    function closeProductModal() {
        productModal.style.display = "none";
        productModal.setAttribute("aria-hidden", "true");
    }

    /* ==========================
       4)  AUTENTICACIÓN
    ========================== */
    const authScreen   = document.getElementById("auth-screen");
    const mainSite     = document.getElementById("main-site");
    const loginForm    = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin    = document.getElementById("show-login");

    showRegister.addEventListener("click", e => {
        e.preventDefault();
        registerForm.style.display = "block";
        loginForm.style.display    = "none";
    });

    showLogin.addEventListener("click", e => {
        e.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display    = "block";
    });

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();
        if (username && password) {
            localStorage.setItem("user", JSON.stringify({ username, password }));
            alert("Usuario registrado correctamente. Ahora inicia sesión.");
            this.reset();
            registerForm.style.display = "none";
            loginForm.style.display    = "block";
        }
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username  = document.getElementById("login-username").value.trim();
        const password  = document.getElementById("login-password").value.trim();
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && savedUser.username === username && savedUser.password === password) {
            sessionStorage.setItem("loggedUser", username);
            authScreen.style.display = "none";
            mainSite.style.display   = "block";
        } else {
            alert("Credenciales incorrectas.");
        }
    });

    window.addEventListener("DOMContentLoaded", () => {
        const user = sessionStorage.getItem("loggedUser");
        if (user) {
            authScreen.style.display = "none";
            mainSite.style.display   = "block";
        }
    });

    /* ==========================
       5)  FORMULARIO DELIVERY
    ========================== */
    document.getElementById("order-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre    = document.getElementById("nombre");
        const direccion = document.getElementById("direccion");
        const telefono  = document.getElementById("telefono");
        const producto  = document.getElementById("producto");
        let errores = [];

        [nombre, direccion, telefono, producto].forEach(i => i.classList.remove("input-error"));

        if (nombre.value.trim().length < 3) {
            errores.push("El nombre debe tener al menos 3 caracteres.");
            nombre.classList.add("input-error");
        }
        if (direccion.value.trim().length < 5) {
            errores.push("La dirección debe ser más específica.");
            direccion.classList.add("input-error");
        }
        const telefonoRegex = /^[0-9]{7,15}$/;
        if (!telefonoRegex.test(telefono.value.trim())) {
            errores.push("El teléfono debe contener solo números (7 a 15 dígitos).");
            telefono.classList.add("input-error");
        }
        if (producto.value === "") {
            errores.push("Debe seleccionar un producto.");
            producto.classList.add("input-error");
        }

        if (errores.length > 0) {
            alert("Por favor corrige los siguientes errores:\n\n" + errores.join("\n"));
        } else {
            alert("Pedido enviado correctamente. ¡Gracias por tu compra!");
            this.reset();
        }
    });

    /* ==========================
       6)  UTILIDADES LOCALSTORAGE
    ========================== */
    function loadCartItemsFromLocalStorage() {
        const json = localStorage.getItem("cartItems");
        return json ? JSON.parse(json) : [];
    }

    function saveCartItemsToLocalStorage(items) {
        localStorage.setItem("cartItems", JSON.stringify(items));
    }

    function clearCart() {
        cartItems.length = 0;
        localStorage.removeItem("cartItems");
    }

    /* ==========================
       FINAL – refresca UI
    ========================== */
    updateCartUI();
});