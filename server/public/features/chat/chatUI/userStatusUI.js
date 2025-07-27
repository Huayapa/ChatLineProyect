export function updateUserStatusUI(statusvalue) {
  const $status = document.getElementById("status");
  if (!$status) return;
  const statusClass = statusvalue;
  $status.className = ''; // Limpia clases anteriores
  $status.classList.add(statusClass);
}

export function updateOtherUserStatusUI(userOtherId, statusvalue) {
  const $listusers = document.querySelectorAll(".chatuser")
  if($listusers.length === 0) return;
  $listusers.forEach(users => {
    const {userid} = users.dataset;
    if(userOtherId !== userid) return;
    const $userStatus = users.querySelector(".statusmessage");
    $userStatus.classList.remove("status-disconect", "status-online", "status-ausent");
    $userStatus.classList.add(statusvalue)
  })
}