export async function registerAPI(username, displayname, password) {
  try {
    const res = await fetch('/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username,displayname, password})
    });
    const data = await res.json();
    return {
      ok: res.ok,
      message: data?.message
    }
  } catch (err) {
    return {
      ok: false,
      message: err?.message || "Error al crear cuenta"
    }
  }
}