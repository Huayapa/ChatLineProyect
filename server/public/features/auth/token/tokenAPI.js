export async function renovarTokenAPI() {
  try {
    const res = await fetch("/user/refresh", {
      method: "POST",
      credentials: "include" //Enviar las cookies
    })
    return {ok: res.ok};
  } catch (err) {
    return {ok: false};
  }
}