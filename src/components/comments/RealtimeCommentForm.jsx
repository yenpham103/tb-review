// src/components/comments/RealtimeCommentForm.jsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/contexts/SocketContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RealtimeCommentForm({ topicId, onCommentAdded }) {
    const [content, setContent] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    const { isConnected, emitNewComment, emitUserTyping, emitUserStoppedTyping } = useSocket()
    const typingTimeoutRef = useRef(null)
    const isTypingRef = useRef(false)

    const handleTyping = useCallback((value) => {
        setContent(value)

        if (!isConnected || !session) return

        // Start typing indicator
        if (!isTypingRef.current && value.trim()) {
            isTypingRef.current = true
            emitUserTyping(topicId, session.user.id, session.user.name, isAnonymous)
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current) {
                isTypingRef.current = false
                emitUserStoppedTyping(topicId, session.user.id)
            }
        }, 2000)
    }, [topicId, session, isAnonymous, isConnected, emitUserTyping, emitUserStoppedTyping])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        // Stop typing indicator
        if (isTypingRef.current) {
            isTypingRef.current = false
            emitUserStoppedTyping(topicId, session.user.id)
        }

        setLoading(true)
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topicId,
                    content,
                    isAnonymous,
                }),
            })

            if (response.ok) {
                const newComment = await response.json()

                // Add comment locally
                onCommentAdded?.(newComment)

                // Emit to other users via WebSocket
                if (isConnected) {
                    emitNewComment(topicId, newComment)
                }

                setContent('')
                setIsAnonymous(false)
            }
        } catch (error) {
            console.error('Error creating comment:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!session) {
        return (
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Vui lòng đăng nhập để bình luận
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Thêm bình luận</CardTitle>
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <motion.div
                                className="flex items-center gap-2 text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <Wifi className="h-4 w-4" />
                                <span className="text-xs font-medium">Đang kết nối</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex items-center gap-2 text-red-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <WifiOff className="h-4 w-4" />
                                <span className="text-xs font-medium">Mất kết nối</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="comment">Nội dung bình luận</Label>
                        <Textarea
                            id="comment"
                            value={content}
                            onChange={(e) => handleTyping(e.target.value)}
                            placeholder="Chia sẻ ý kiến của bạn..."
                            required
                            rows={4}
                            className="bg-white/50 border-white/30 focus:bg-white/80 transition-all duration-200"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="anonymous"
                            checked={isAnonymous}
                            onCheckedChange={setIsAnonymous}
                        />
                        <Label htmlFor="anonymous" className="text-sm">
                            Bình luận ẩn danh
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        <Send className="h-4 w-4" />
                        {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}