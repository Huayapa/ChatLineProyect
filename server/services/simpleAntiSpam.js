class SimpleAntiSpam {
  constructor() {
    this.userSpamData = new Map()
  }

  initSocket(socket) {
    this.userSpamData.set(socket.id, {
      lastMessage: "",
      repeatCount: 0,
      lastTimestamp: Date.now()
    });
  }

  removeSocket(socket) {
    this.userData.delete(socket.id);
  }

  validateAntiSpam(socket, msg, limite = 3, ventanaTiempo = 5000) {
    const now = Date.now();
    const spamData = this.userSpamData.get(socket.id);
    const mensaje = msg?.trim();
    //Reinicia si el mensaje ya paso el tiempo
    if (now - spamData.lastTimestamp > ventanaTiempo) {
      spamData.repeatCount = 0;
    }
    //Verificar mensajes repetido
    if (mensaje === spamData.lastMessage) {
      spamData.repeatCount++;
    } else {
      spamData.repeatCount = 0;
    } 
    spamData.lastMessage = mensaje;
    spamData.lastTimestamp = now;
    // Maximo N veces el spam
    if (spamData.repeatCount >= limite) { 
      socket.emit("error", "No repitas el mismo mensaje varias veces.");
      return false;
    }
    return true;
  }
}

export const userSpamData = new SimpleAntiSpam();