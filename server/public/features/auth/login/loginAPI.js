export async function loginAPI(username, password) {
  try {
    const res = await fetch('/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    return {
      ok: res.ok,
      message: data?.message
    }
  } catch (err) {
    return {
      ok: false,
      message: err?.message || "Error al iniciar sesión"
    }
  }
}