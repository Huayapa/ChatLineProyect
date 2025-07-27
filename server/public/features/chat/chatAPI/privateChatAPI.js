export async function createChatPrivateAPI(userid) {
  try {
    const res = await fetch("/conversation/create", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userid})
    })
    if (!res.ok) {
      const errorText = await res.text();
      return {
        ok: false,
        message: errorText || "Error desconocido al crear chat privado."
      };
    }
    const data = await res.json();
    
    return {
      ok: res.ok,
      message: data?.message
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error al crear un chat privado."
    }
  }
}