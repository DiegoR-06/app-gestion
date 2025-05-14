// Carga datos del formulario para que los use el backend
const form = document.querySelector("form")
form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const data = new FormData(form);
	const response = await fetch('http://localhost:3000/login', {
		method: 'POST',
		body: JSON.stringify({
			username: data.get('username'),
			password: data.get('password'),
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if(response.ok){
		window.location.href = '/index.html'
	} else {
		alert('Credenciales Inválidas')
	}
})