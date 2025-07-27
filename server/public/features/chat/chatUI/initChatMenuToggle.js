export function initChatMenuToggle() {
  const $btn = document.getElementById("btn-chat");
  $btn?.addEventListener("click", () => {
    const $datachat = document.getElementById("data-chat");
    $datachat.classList.toggle("view")
  })
}