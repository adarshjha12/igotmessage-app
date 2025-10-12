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

  public initListners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("socket connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`new message recieved: ${message}`);
      });
    });
  }
}

export default InitSocket;
