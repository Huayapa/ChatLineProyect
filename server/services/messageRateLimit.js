export class MessageRateLimit {
  constructor(time = 1000) {
    this.timeLimit = time;
    this.messageTimestamps = new Map();
  }

  isAllowed(socket) {
    const now = Date.now();
    const last = this.messageTimestamps.get(socket.id) || 0;
    if(now - last < this.timeLimit) {
      socket.emit("error", "Estás enviando mensajes muy rápido");
      return false;
    }
    this.messageTimestamps.set(socket.id, now);
    return true;
  }
}