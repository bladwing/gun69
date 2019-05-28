let contact = document.querySelector("#contact");
						
	contact.innerHTML = `<form action="post" class="contact-from">
		<h2>საქონტაქტო ფორმა</h2>
		<input type="text" placeholder="სახელი" required>
		<input type="number" placeholder="ტელეფონი" required>
		<textarea type="text" placeholder="თქვენი შეტყობინება" required></textarea>
		<button class="contact-btn">გაგზავნა</button>
		<button class="contact-btn">წაშლა</button>
	</form>
		<img src="images/map.png" alt="">`

