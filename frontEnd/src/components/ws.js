import {io} from 'socket.io-client'
export function connectWS(){
    return io(import.meta.env.VITE_SOCKET_URL)
}