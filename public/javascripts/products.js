let products = JSON.parse(localStorage.getItem('products'))
    let productsContainer = document.querySelector(".products")

    if (products) {
        for (let i = 0; i < products.length; i++) {
            productsContainer.innerHTML += productHtml(products[i])
        }

        let links = document.querySelectorAll('.product--detail');
        links.forEach( link => {
            link.addEventListener("click", (event) => {
                localStorage.setItem('detail_id', event.target.dataset.product);
                location.replace('detail')
            })
        })
        
    }
    function productHtml(product) {
        return `<div class="product1">

                  <a href="#" class="product-title">დასახელება:${product.title} </a>
                        
                    <div class="product-img" style="background-image:url(${product.picture})"></div>

                   <div class="product-description">პროდუქტის შესახებ:<br /><br />${product.desc} <br /> 
                        <a href="javascript:void(0)" data-product="${product.id}" class="product--detail">ვრცლად...</a>
                   </div>
                   <div class="price">ფასი:${product.price}₾</div>
                   
                   <button class="buy">ყიდვა</button>
                </div>`;
    }
