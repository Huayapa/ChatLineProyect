/**
 * UserConnections - Gestiona la relacion del id "bd" con el socket
 */
class UserConnections {
  constructor() {
    this.userConnections = new Map();
  }
  getSocketUserId(userId) {
    return this.userConnections.get(userId)
  }
  addUser(userId, socket) {
    this.userConnections.set(userId, socket)
  }
  deleteUser(userId) {
    this.userConnections.delete(userId)
  }
  hasUserConnected(userId) {
    return this.userConnections.has(userId);
  }
}

export const usersConnections = new UserConnections();