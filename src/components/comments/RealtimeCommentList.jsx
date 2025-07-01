// src/components/comments/RealtimeCommentList.jsx
'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RealtimeCommentList({ topicId, newComment }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [typingUsers, setTypingUsers] = useState([])
    const { socket, isConnected, joinTopic, leaveTopic } = useSocket()

    useEffect(() => {
        if (isConnected && topicId) {
            joinTopic(topicId)
        }

        return () => {
            if (topicId) {
                leaveTopic(topicId)
            }
        }
    }, [topicId, isConnected, joinTopic, leaveTopic])

    useEffect(() => {
        fetchComments()
    }, [topicId])

    useEffect(() => {
        if (newComment) {
            setComments(prev => [newComment, ...prev])
        }
    }, [newComment])

    // Socket event listeners
    useEffect(() => {
        if (!socket) return

        const handleCommentAdded = (comment) => {
            setComments(prev => [comment, ...prev])
        }

        const handleUserTyping = (data) => {
            setTypingUsers(prev => {
                const existing = prev.find(user => user.userId === data.userId)
                if (!existing) {
                    return [...prev, data]
                }
                return prev
            })
        }

        const handleUserStoppedTyping = (data) => {
            setTypingUsers(prev => prev.filter(user => user.userId !== data.userId))
        }

        socket.on('comment-added', handleCommentAdded)
        socket.on('user-typing', handleUserTyping)
        socket.on('user-stopped-typing', handleUserStoppedTyping)

        return () => {
            socket.off('comment-added', handleCommentAdded)
            socket.off('user-typing', handleUserTyping)
            socket.off('user-stopped-typing', handleUserStoppedTyping)
        }
    }, [socket])

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?topicId=${topicId}`)
            if (response.ok) {
                const data = await response.json()
                setComments(data)
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="animate-pulse space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        )
    }

    if (comments.length === 0 && typingUsers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">Chưa có bình luận nào</p>
                            <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên chia sẻ ý kiến!</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Typing Indicators */}
            <AnimatePresence>
                {typingUsers.map((user) => (
                    <motion.div
                        key={user.userId}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 shadow-sm">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                            {user.isAnonymous ? '?' : user.userName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-blue-700">
                                            {user.isAnonymous ? 'Ai đó' : user.userName}
                                        </span>
                                        <span className="text-xs text-blue-600">đang nhập...</span>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Comments */}
            <AnimatePresence>
                {comments.map((comment, index) => (
                    <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        layout
                    >
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10 ring-2 ring-white/50">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                            {comment.isAnonymous
                                                ? comment.anonymousName?.[0]
                                                : comment.authorName?.[0]
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm text-gray-700">
                                                {comment.isAnonymous ? comment.anonymousName : comment.authorName}
                                            </span>
                                            {comment.isAnonymous && (
                                                <span className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200/50">
                                                    <Eye className="h-3 w-3 inline mr-1" />
                                                    Ẩn danh
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className="bg-white/50 rounded-lg p-3 border border-white/30">
                                            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}