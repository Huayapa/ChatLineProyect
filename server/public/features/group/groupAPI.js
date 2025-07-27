export async function createGroupAPI(name, description) {
  try {
    const res = await fetch('/group/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, description})
    })
    const data = await res.json();
    return {
      ok: res.ok,
      message: data?.message
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error al crear el grupo"
    }
  }
}

export async function getGroups() {
  const res = await fetch('/group/mostrar');
  if (!res.ok) return [];
  return await res.json();
}

export async function joinGroupAPI(groupid) {
  try {
    const res = await fetch('/group/joinuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupid})
    })
    const data = await res.json()
    return {
      ok: res.ok,
      message: data?.error
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error de red o token expirado."
    }
  }
}