export async function logoutAPI() {
  try {
    const res = await fetch('/user/logout', {method: "POST"});
    return {
      ok: res.ok,
      message: "Cerrando Sesión..."
    }
  } catch (err) {
    return {
      ok: false,
      message: "Error al Cerrar sesión"
    }
  }
}