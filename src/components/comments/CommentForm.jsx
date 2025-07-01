// cmt// src/components/comments/CommentForm.jsx
'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function CommentForm({ topicId, onCommentAdded }) {
    const [content, setContent] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

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
                onCommentAdded?.(newComment)
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
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Vui lòng đăng nhập để bình luận
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Thêm bình luận</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="comment">Nội dung bình luận</Label>
                        <Textarea
                            id="comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Chia sẻ ý kiến của bạn..."
                            required
                            rows={4}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="anonymous"
                            checked={isAnonymous}
                            onCheckedChange={setIsAnonymous}
                        />
                        <Label htmlFor="anonymous">Bình luận ẩn danh</Label>
                    </div>
                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}