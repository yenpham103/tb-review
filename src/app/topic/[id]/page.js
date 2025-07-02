'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RealtimeCommentForm from '@/components/comments/RealtimeCommentForm'
import RealtimeCommentList from '@/components/comments/RealtimeCommentList'
import LoginButton from '@/components/auth/LoginButton'
import { ArrowLeft, Calendar, User, MessageSquare, Clock, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <motion.div
                    className="flex flex-col items-center space-y-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 absolute top-0"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-600">Đang tải chủ đề...</p>
                </motion.div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    if (!topic) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy chủ đề</h2>
                    <Link href="/dashboard">
                        <Button>Quay lại Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <motion.div
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4">
  
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Var Vấp Thoải Mái : D
                            </h1>
                            <p className="text-gray-600 mt-1">Nấu sói cực căng</p>
                        </div>
                    </div>
                    <LoginButton />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <motion.div
                        className="lg:col-span-3 space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-t-lg">
                                <CardTitle className="text-2xl font-bold text-gray-800">
                                    {topic.title}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(topic.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>Tạo bởi thành viên team</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(topic.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                        {topic.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <RealtimeCommentForm
                            topicId={topic._id}
                            onCommentAdded={handleCommentAdded}
                        />

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Bình luận</h3>
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Real-time</span>
                                </div>
                            </div>
                            <RealtimeCommentList
                                topicId={topic._id}
                                newComment={newComment}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                    Thông tin chủ đề
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Ngày tạo:</span>
                                        <span className="text-sm text-gray-800 font-semibold">
                                            {new Date(topic.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Thời gian:</span>
                                        <span className="text-sm text-gray-800 font-semibold">
                                            {new Date(topic.createdAt).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                                        <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                            Đang hoạt động
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/dashboard" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-white/50 border-white/30 hover:bg-white/80 transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Backto Dashboard
                                    </Button>
                                </Link>
                                <Link href="/dashboard" className="block">
                                    <Button variant="outline" className="w-full bg-white/50 border-white/30 hover:bg-white/80 transition-all duration-200">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Xem tất cả chủ đề
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-200/30 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-800">💡 Mẹo nhỏ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-blue-700 space-y-2">
                                    <li>• Bình luận được cập nhật real-time</li>
                                    <li>• Có thể bình luận ẩn danh</li>
                                    <li>• Chia sẻ ý kiến một cách tôn trọng</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}