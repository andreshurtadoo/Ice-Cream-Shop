const CART_PRODUCTS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadProductCart();
})


// acceder a los datos de la base de datos
function getProductsDb() {
    const url = "../dbProductos.json"

    return fetch(url).then(response => {
        return response.json()
    }).then(result => {
        return result
    }).catch(error => {
        console.log('error');
    })
}

// cargar los productos a la pagina web
async function loadProducts() {
    const products = await getProductsDb();

    let html = "";
    products.forEach(product => {

        html += `
        <div class="col-3 product-container">
            <div class="card product">
                <img
                    src="${product.image} "
                    class="card-img-top"
                    alt="${product.name} "
                />
            
              <div class="card-body">
                <h5 class="card-title">${product.name} </h5>
                <p class="card-text">${product.extraInfo} </p>
                <p class="card-text">${product.price} € / Unidad</p>             
                <button type="button" class="btn btn-primary btn-cart" onClick="addProductCart(${product.id} )" > Añadir al Carrito </button>
              </div>
            </div>
        </div>`

        document.getElementsByClassName("products")[0].innerHTML = html
    })

}

// abrir y cerrar el carrito
function openCloseCart() {
    const containerCart = document.getElementsByClassName('cart-products')[0]
    containerCart.classList.forEach(item => {
        if (item === "hidden") {
            containerCart.classList.remove("hidden");
            containerCart.classList.add("active");
        }

        if (item === "active") {
            containerCart.classList.remove("active");
            containerCart.classList.add("hidden");
        }
    })
}

// agregar los id al localStorage
function addProductCart(idProduct) {
    let arrayProductsId = [];

    let localStorageItems = localStorage.getItem(CART_PRODUCTS);

    if (localStorageItems === null) {
        arrayProductsId.push(idProduct);
        localStorage.setItem(CART_PRODUCTS, arrayProductsId);

    } else {
        let productsId = localStorage.getItem(CART_PRODUCTS);
        if (productsId.length > 0) {
            productsId += "," + idProduct;
        } else {
            productsId = idProduct
        }
        localStorage.setItem(CART_PRODUCTS, productsId)
    }

    loadProductCart();

}


// añadir los productos al carrito
async function loadProductCart() {
    const products = await getProductsDb()
    const localStorageItems = localStorage.getItem(CART_PRODUCTS);

    let html = "";
    if (!localStorageItems) {
        html = `
        <div class="cart-product empty">
        <p>Carrito Vacio!</p>
        </div>
        `;
    } else {

        const idProductsSplit = localStorageItems.split(',');
        // eliminar los id duplicado
        const idProductsCart = Array.from(new Set(idProductsSplit))

        idProductsCart.forEach(id => {
            products.forEach(product => {
                if (id == product.id) {
                    const quantity = countDuplicatesId(id, idProductsSplit);
                    const totalPrice = product.price * quantity
                    html += `
                    <div class="cart-product">
                      <img src="${product.image}" alt="${product.name}" />
                      <div class="cart-product-info">
                        <span class="quantity">${quantity}</span>
                        <p>${product.name}</p>
                        <p>${totalPrice.toFixed(2)}</p>
                        <p class="change-quantity">
                           <button onClick="increaseQuantity(${product.id})" >+</button>
                           <button onClick="decreaseQuantity(${product.id})">-</button>
                        </p>
                        <p class="cart-product-delete">
                           <button onClick="deleteProductCart(${product.id})" >Eliminar</button>
                        </p>
                      </div>
                    </div> 
                    `;
                }
            });
        });
    }

    document.getElementsByClassName("cart-products")[0].innerHTML = html;
}

function deleteProductCart(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTS);
    const arrayIdProductsCart = idProductsCart.split(',');
    const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);

    if (resultIdDelete) {
        let count = 0;
        let idsString = "";

        resultIdDelete.forEach(id => {
            count++;
            if (count < resultIdDelete.length) {
                idsString += id + ",";
            } else {
                idsString += id;
            }
        });
        localStorage.setItem(CART_PRODUCTS, idsString)
    }

    loadProductCart()
}

function increaseQuantity(idProduct) {

    const idProductsCart = localStorage.getItem(CART_PRODUCTS);
    const arrayIdProductsCart = idProductsCart.split(",");
    arrayIdProductsCart.push(idProduct);

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if (count < arrayIdProductsCart.length) {
            idsString += id + ","
        } else {
            idsString += id;
        }
    });

    localStorage.setItem(CART_PRODUCTS, idsString)
    loadProductCart();

}

function decreaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTS);
    const arrayIdProductsCart = idProductsCart.split(",");

    const deleteItems = idProduct.toString();
    let index = arrayIdProductsCart.indexOf(deleteItems);
    if (index > -1) {
        arrayIdProductsCart.splice(index, 1)
    }

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if (count < arrayIdProductsCart.length) {
            idsString += id + ","
        } else {
            idsString += id;
        }
    });

    localStorage.setItem(CART_PRODUCTS, idsString)
    loadProductCart();
}

function countDuplicatesId(value, arrayIds) {
    let count = 0;
    arrayIds.forEach(id => {
        if (value == id) {
            count++;
        }
    })
    return count;

}

function deleteAllIds(id, arrayId) {
    return arrayId.filter(itemId => {
        return itemId != id;
    })
}

























