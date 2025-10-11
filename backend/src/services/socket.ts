import { Server } from "socket.io";

class InitSocket {
  private _io: Server;
  constructor() {
    console.log("socket initialized");

    this._io = new Server();
  }

  get io() {
    return this._io;
  }
}

export default InitSocket;
