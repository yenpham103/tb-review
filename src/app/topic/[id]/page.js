// src/app/topic/[id]/page.js
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CommentForm from '@/components/comments/CommentForm'
import CommentList from '@/components/comments/CommentList'
import LoginButton from '@/components/auth/LoginButton'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export default function TopicDetailPage({ params }) {
    const [topic, setTopic] = useState(null)
    const [newComment, setNewComment] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        } else {
            fetchTopic()
        }
    }, [status, params.id])

    const fetchTopic = async () => {
        try {
            const response = await fetch(`/api/topics/${params.id}`)
            if (response.ok) {
                const data = await response.json()
                setTopic(data)
            } else if (response.status === 404) {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Error fetching topic:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCommentAdded = (comment) => {
        setNewComment(comment)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Không tìm thấy chủ đề</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Chi tiết chủ đề</h1>
                            <p className="text-muted-foreground">Thảo luận và chia sẻ ý kiến</p>
                        </div>
                    </div>
                    <LoginButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Topic Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{topic.title}</CardTitle>
                                <CardDescription className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(topic.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>Tạo bởi thành viên team</span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {topic.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Comment Form */}
                        <CommentForm
                            topicId={topic._id}
                            onCommentAdded={handleCommentAdded}
                        />

                        {/* Comments List */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Bình luận</h3>
                            <CommentList
                                topicId={topic._id}
                                newComment={newComment}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Topic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin chủ đề</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                                    <p className="text-sm">{new Date(topic.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                                    <p className="text-sm">{new Date(topic.updatedAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Hướng dẫn thảo luận</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>• Giữ thái độ tôn trọng và xây dựng</p>
                                    <p>• Chia sẻ ý kiến một cách trung thực</p>
                                    <p>• Sử dụng tính năng ẩn danh nếu cần</p>
                                    <p>• Tránh những bình luận không phù hợp</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Anonymous Info */}
                        <Card className="border-amber-200 bg-amber-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-amber-800">Bình luận ẩn danh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-700">
                                    Khi chọn bình luận ẩn danh, tên của bạn sẽ được thay thế bằng
                                    một tên con giáp ngẫu nhiên để bảo vệ danh tính.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}