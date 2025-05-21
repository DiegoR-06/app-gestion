const logoutButton = document.querySelector("#end-sesion");
logoutButton.addEventListener("click", async () => {
  if (!logoutButton) {
    console.log('Botón "Cerrar Sesión" no encontrado');
    return;
  }
  try {
    const response = await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});
