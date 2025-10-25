import { io, Socket } from "socket.io-client"

const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

    let socket: Socket

export const getSocket = function (){
    if(!socket){
        socket = io(url)
    }
    return socket
}