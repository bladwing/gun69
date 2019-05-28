let search = document.querySelector('#search');
	search.innerHTML = `<input type="text" class="input" value="" placeholder="შეიყვანეთ იარაღის სახელი">
			 <button type="submit" class="button"><i class="fas fa-search">ძებნა</i></button>`


let logo = document.querySelector('#logo');
	logo.innerHTML = `<a class="logo-link" href="/">
				<img src="/images/logo.png" alt="logo">
			</a>`

	
let copyright = document.querySelector('#copyright');
	copyright.innerHTML = `&copy; Copyright  Ponarenko All Rights Reserved `
	document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()))


/*=======================auth==========================*/
const loginBtn = document.querySelector('#loginBtn');
loginBtn.addEventListener('click', (event) => {
		let username = document.querySelector('#username')
		let password = document.querySelector('#userpassword')
		let users = JSON.parse(localStorage.getItem('users'))
		const admin = "admin";
		const apd = "12345";
		if (!users) {
			users = []
		}
		
		let user = users.find((u) => {
			return (u.password == password.value && u.username == username.value)
		})
		let fail = false;
		const error = document.querySelector('#error');
		
		if (!user) {
			fail = error.innerHTML = `მომხმარებლის სახელი ან პაროლი არასწორია!`
		}

		else {
			window.location="user.html"
			localStorage.setItem('active.User', user.email)

			/*checkUser();*/
		}
			if (username.value != admin || password.value != apd) {}
		else {
			window.location="admin-page"
		}
		username.value = ''
		password.value = ''
		
	});


const dBtns = document.querySelectorAll(".delete");
        dBtns.forEach(btn => {
          btn.addEventListener("click", ({ target }) => {
            fetch("/", {
              method: "delete",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ id: target.parentNode.dataset.id })
            })
              .then(res => res.json())
              .then(result => {
                if (result.status) {
                  location.reload();
                } else {
                  alert("Invalid Operation!...");
                }
              })
              .catch(error => {
                console.log(error);
              });
          });
        });
 //===============================ADD TO CARD FUNCTION========================       
    $(function(){
  'use strict'; 
  $.jqCart({
      buttons: '.addToCard',
      cartLabel: '.label-place',
      visibleLabel: false,
      openByAdding: true,
      currency: '₾'
  }); 
  $('#open').click(function(){
    $.jqCart('openCart');
  });
});