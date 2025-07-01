// src/components/comments/CommentList.jsx
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle } from 'lucide-react'

export default function CommentList({ topicId, newComment }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchComments()
    }, [topicId])

    useEffect(() => {
        if (newComment) {
            setComments(prev => [newComment, ...prev])
        }
    }, [newComment])

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
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="animate-pulse space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                                    <div className="h-4 bg-muted rounded w-24"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Chưa có bình luận nào</p>
                        <p className="text-sm text-muted-foreground">Hãy là người đầu tiên chia sẻ ý kiến!</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <Card key={comment._id}>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                    {comment.isAnonymous
                                        ? comment.anonymousName?.[0]
                                        : comment.authorName?.[0]
                                    }
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                        {comment.isAnonymous ? comment.anonymousName : comment.authorName}
                                    </span>
                                    {comment.isAnonymous && (
                                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                            Ẩn danh
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}