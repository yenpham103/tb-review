// src/contexts/SocketContext.js
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    // Return default values instead of throwing error
    return {
      socket: null,
      isConnected: false,
      joinTopic: () => {},
      leaveTopic: () => {},
      emitNewComment: () => {},
      emitUserTyping: () => {},
      emitUserStoppedTyping: () => {}
    }
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (typeof window !== 'undefined' && session) {
      // Dynamic import for client-side only
      import('socket.io-client').then(({ io }) => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
          transports: ['websocket'],
          upgrade: true
        })

        socketInstance.on('connect', () => {
          console.log('Connected to WebSocket server')
          setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from WebSocket server')
          setIsConnected(false)
        })

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error)
          setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
          socketInstance.close()
        }
      }).catch(error => {
        console.error('Failed to load socket.io-client:', error)
      })
    }
  }, [session])

  const joinTopic = (topicId) => {
    if (socket && isConnected) {
      socket.emit('join-topic', topicId)
    }
  }

  const leaveTopic = (topicId) => {
    if (socket && isConnected) {
      socket.emit('leave-topic', topicId)
    }
  }

  const emitNewComment = (topicId, comment) => {
    if (socket && isConnected) {
      socket.emit('new-comment', { topicId, comment })
    }
  }

  const emitUserTyping = (topicId, userId, userName, isAnonymous) => {
    if (socket && isConnected) {
      socket.emit('user-typing', { topicId, userId, userName, isAnonymous })
    }
  }

  const emitUserStoppedTyping = (topicId, userId) => {
    if (socket && isConnected) {
      socket.emit('user-stopped-typing', { topicId, userId })
    }
  }

  const value = {
    socket,
    isConnected,
    joinTopic,
    leaveTopic,
    emitNewComment,
    emitUserTyping,
    emitUserStoppedTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}