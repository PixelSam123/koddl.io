import type { Socket } from 'socket.io-client'

import { createContext } from 'react'
import { io } from 'socket.io-client'

const socket = io()
const SocketContext = createContext<null | Socket>(null)

export { socket }
export default SocketContext
