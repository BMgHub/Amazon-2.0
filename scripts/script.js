function getItems(){
    db.collection("items").get().then((querySnapshot) => {
        let items= [];
        querySnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                image: doc.data().image,
                name: doc.data().name,
                make: doc.data().make,
                rating: doc.data().rating,
                price: doc.data().price,
                originalprice: doc.data().originalprice
            })
        });
        generateItems(items);
    });
}

function addToCart(item){
    let cartItem = db.collection("cart-items").doc(item.id);
    cartItem.get()
    .then(function(doc){
        if(doc.exists){
            cartItem.update({
                quantity: doc.data().quantity + 1
            })
        }   else {
            cartItem.set({
                image: item.image,
                make: item.make,
                name: item.name,
                rating: item.rating,
                price: item.price,
                quantity: 1
            })
        }
    })
}

function generateItems(items) {
    let itemsHTML = "";
    items.forEach((item) => {
        let doc = document.createElement("div");
        doc.classList.add("main-product", "rounded-3xl", "p-5", "m-3", "w-44");
        doc.innerHTML +=  `
            <div class='product-image bg-white w-42 h-36 rounded-lg p-4 shadow-xl'>
                <img class='w-full h-full object-contain' src='${item.image}' alt='${item.name}'>
            </div>
            <div class='product-name hover:text-yellow-700 text-indigo-900 font-semibold m-2 text-sm'>
                ${item.name}
            </div>
            <div class='product-make font-light text-sm text-gray-600'>
                ${item.make}
            </div>
            <div class='product-rating m-2 rounded-lg flex text-yellow-400'>
                ${item.rating}
            </div>
            <div class='product-original-price text-red-700 line-through text-sm'>
                ${numeral(item.originalprice).format('$0,0.00')}
            </div>
            <div class='product-price text-gray-900 flex justify-end text-lg font-semibold mb-6'>
                $${item.price}
            </div>
        `

        let addToCartEl = document.createElement("div");
        addToCartEl.classList.add("add-to-cart", "text-white","bg-yellow-400", "hover:text-yellow-100", "hover:bg-yellow-500",  "cursor-pointer","p-1", "flex","font-semibold", "justify-center","rounded",);
        addToCartEl.innerHTML = `add to cart`
        addToCartEl.addEventListener("click", function(){
            addToCart(item)
        });

        doc.appendChild(addToCartEl);
        document.querySelector(".main-section-products").
        appendChild(doc);
        
    })
    
    }

getItems()
