let registration = document.querySelector('.registration');
let autuBtn = document.querySelector('#myBtn');
const sendData = document.querySelector("#sendData");
const signin = document.querySelector(".login-button");
const active = JSON.parse(localStorage.getItem('active'));
const guestButtons = document.querySelector('.auth-button-main')
const userName = document.querySelector('.auth-button-main-logout')

//SIGN IN FORM show/hide
	let authorization = document.querySelector('.authorization');

	guestButtons.addEventListener('click', (event) => {
		authorization.classList.add('active');
	});
	sendData.addEventListener('click', (event) => {
		const name = document.querySelector('#name')
		const username = document.querySelector('#username')
		const password = document.querySelector('#password')
		const email = document.querySelector('#email')
		const phone = document.querySelector('#telephone')
		const id = Date.now();
		const errors = []
		if (name.value == '' || name.value.trim() == '') {
			errors.push('შეიყვანეთ სახელი და გვარი!')
		}
		if (username.value == '' || username.value.trim() == '') {
			errors.push('შეიყვანეთ მომხმარებლის სახელი!')
		}
		if (password.value == '' || password.value.trim() == '') {
			errors.push('შეიყვანეთ პაროლი!')
		}
		if (email.value == '' || email.value.trim() == '') {
			errors.push('შეიყვანეთ ელ. ფოსტა!')
		}
		if(phone.value == '' || phone.value.trim() == '') {
			errors.push('შეიყვანეთ ტელეფონის ნომერი!')
		}
		if (errors.length) {
			let alert = document.querySelector('.alert.alert-warning')
			let errorsOl = alert.querySelector('.errors')
			alert.classList.remove('hidden')
			errorsOl.innerHTML = ''
			for (let i = 0; i < errors.length; i++) {
				errorsOl.innerHTML += `<li class="error--item" >${errors[i]}</li>`
			}
		}
		else {
			let newUser = User(name.value, username.value, password.value, email.value, telephone.value, id)
			let users = JSON.parse(localStorage.getItem('users'))
			if (!users) {
				users = []
			}
			users.push(newUser)
			localStorage.setItem('users', JSON.stringify(users))
			localStorage.setItem('active.User',newUser.email)
			registration.classList.remove('active');
			checkUser();
		}
	})
signin.addEventListener('click', (event) => {
		let email = document.querySelector('#email')
		let password = document.querySelector('#password')
		let users = JSON.parse(localStorage.getItem('users'))
		let user = users.find((u) => {
			return (u.password == password.value && u.email == email.value)
		})
		if (!user) {
			alert('სცადეთ თავიდან')
		}
		else {
			localStorage.setItem('active.User', user.idnumber)
			checkUser();
		}
		password.value = ''
		email.value = ''
	})
	function checkUser() {
		let idNumber = localStorage.getItem('active.User')

		if (idNumber || idNumber != '') {

			let user = findUserById(idNumber);
			if (user) {
				
				const userCart = new Cart();
				userCart.init('.add-in-cart');

				guestButtons.classList.add('hidden')
				userButtons.classList.remove('hidden')
				userName.textContent = `${user.fname} ${user.lname}`
				authorization.classList.remove('active')
				let logout = document.querySelector('#logout')
				logout.addEventListener('click', function logoutFunc(event) {
					logout.removeEventListener('click', logoutFunc)
					localStorage.setItem('active.User', '')
					location.reload()
				})
			}
		}
	}
	checkUser();
	function findUserById(idNumber) {
		let users = JSON.parse(localStorage.getItem('users'))
		if (users) {
			let user = users.find((u) => {
				return (u.idnumber === idNumber)
			})
			return user;
		}
		return null;
	}
	function User(fname, lname, balance, idnumber, password, email) {
		return {
			fname,
			lname,
			password,
			email,
		}
	}




		







