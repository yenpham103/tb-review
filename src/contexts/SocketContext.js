// src/contexts/SocketContext.js - Cập nhật để hỗ trợ xóa comment
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

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

  const emitCommentDeleted = (topicId, commentId) => {
    if (socket && isConnected) {
      socket.emit('comment-deleted', { topicId, commentId })
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
    emitCommentDeleted,
    emitUserTyping,
    emitUserStoppedTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}