function getCartItems() {
    db.collection("cart-items").onSnapshot((snapshot) => {
        let cartItems = [];
        snapshot.docs.forEach((doc) => {
        cartItems.push ({
                id: doc.id,
                ...doc.data()
            })
        })
        generateCartItems(cartItems);
        getTotalCost(cartItems);
    })
}

function getTotalCost(items){
    let totalCost = 0;
    items.forEach((item)=>{
        totalCost += (item.quantity * item.price)
    })
    document.querySelector(".total-cost-number").innerText = numeral(totalCost).format(	'$0,0.00')
}

function decreaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc) {
        if (doc.exists) {
            if (doc.data().quantity > 1) {
                cartItem.update({
                    quantity: doc.data().quantity - 1 
                })
            }
        }
    })

}


function increaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc) {
        if (doc.exists) {
            if (doc.data().quantity > 0) {
                cartItem.update({
                    quantity: doc.data().quantity + 1
                })
            }
        }

    })
}

function deleteItem(itemId){
    db.collection("cart-items").doc(itemId).delete();
}


function generateCartItems(cartItems) {
    let itemsHTML = "";
    cartItems.forEach((item) => {
        itemsHTML += `
        <div class='cart-item my-7 sm:mx-0 mx-10 w-max shadow-md bg-gray-100 rounded-3xl flex md:flex-row flex-col '>
            <div class='cart-item-image object-center border-8 border-gray-100 rounded-2xl bg-white p-3 w-48 h-36'>
                <img class='w-full h-full object-contain' src='${item.image}'>
            </div>
            <div class='cart-item-details flex-grow p-4'>
                <h1 class='cart-item-title md:w-96 w-40 text-gray-600 font-semibold'>
                    ${item.name}
                </h1>
                <h2 class='cart-item-brand text-sm text-gray-600'>
                    ${item.make}
                </h2>
            </div>
            <div class='cart-item-counter border-l flex w-48 items-center justify-around'>
                <div data-id="${item.id}" class='cart-item-decrease cursor-pointer text-gray-400 bg-gray-300 rounded h-6 w-6 flex justify-center items-center hover:bg-gray-200'>
                    <i class="fas fa-chevron-left"></i>
                </div>
                <h4 class='text-gray-500 font-semibold m-5'>x ${item.quantity}</h4>
                <div data-id="${item.id}" class='cart-item-increase cursor-pointer text-gray-400 bg-gray-300 rounded h-6 w-6 flex justify-center items-center hover:bg-gray-200'>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            <div class='cart-item-total-cost w-48 text-gray-500 font-semibold border-l flex justify-center items-center'> 
                ${numeral(item.price * item.quantity).format('$0,0.00')}
            </div>
            <div data-id="${item.id}" class='sm:p-5 p-8 cart-item-delete flex justify-center items-center text-gray-500 rounded-r-2xl cursor-pointer hover:text-gray-600 hover:bg-red-200 hover:bg-opacity-50'>
                <i class="fas fa-times"></i>
            </div>
        </div>
        `
    })
    document.querySelector(".cart-items").innerHTML = itemsHTML;
    createEventListeners();

}

function createEventListeners() {
let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
let increaseButtons = document.querySelectorAll(".cart-item-increase");
let deleteButtons = document.querySelectorAll(".cart-item-delete");

decreaseButtons.forEach((button) => {
    button.addEventListener("click", function(){
        decreaseCount(button.dataset.id);
    })

})

increaseButtons.forEach((button) => {
    button.addEventListener("click", function(){
        increaseCount(button.dataset.id);
    })
})

deleteButtons.forEach((button) => {
    button.addEventListener("click", function(){
        deleteItem(button.dataset.id)
    })

})

}

getCartItems();