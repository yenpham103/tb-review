// src/app/dashboard/page.js
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/auth/LoginButton'
import TopicCard from '@/components/topics/TopicCard'
import CreateTopic from '@/components/topics/CreateTopic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, TrendingUp, Clock, Users, Sparkles, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        } else if (status === 'authenticated') {
            fetchTopics()
        }
    }, [status, router])

    const fetchTopics = async () => {
        try {
            const response = await fetch('/api/topics')
            if (response.ok) {
                const data = await response.json()
                setTopics(data)
            }
        } catch (error) {
            console.error('Error fetching topics:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleTopicCreated = (newTopic) => {
        setTopics(prev => [newTopic, ...prev])
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
                    <p className="text-lg font-medium text-gray-600">Đang tải dashboard...</p>
                </motion.div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    const recentTopics = topics.filter(t =>
        new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <motion.div
                    className="flex justify-between items-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Team Review
                        </h1>
                        <p className="text-xl text-gray-600 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Chào mừng {session.user?.name} đến với không gian thảo luận
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-600">Online</span>
                        </div>
                        <LoginButton />
                    </div>
                </motion.div>

                {/* Enhanced Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Tổng chủ đề</CardTitle>
                            <MessageSquare className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{topics.length}</div>
                            <p className="text-xs opacity-80 mt-1">
                                +{recentTopics} tuần này
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Hoạt động</CardTitle>
                            <Activity className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{recentTopics}</div>
                            <p className="text-xs opacity-80 mt-1">7 ngày qua</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Thành viên</CardTitle>
                            <Users className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">1</div>
                            <p className="text-xs opacity-80 mt-1">Đang online</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Mới nhất</CardTitle>
                            <Clock className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {topics.length > 0 ?
                                    new Date(topics[0]?.createdAt).toLocaleDateString('vi-VN') :
                                    'Chưa có'
                                }
                            </div>
                            <p className="text-xs opacity-80 mt-1">Chủ đề gần đây</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Enhanced Action Bar */}
                <motion.div
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Chủ đề thảo luận</h2>
                        <p className="text-gray-600">Khám phá và tham gia các cuộc thảo luận sôi nổi</p>
                    </div>
                    <CreateTopic onTopicCreated={handleTopicCreated} />
                </motion.div>

                {/* Enhanced Topics Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                                    <CardContent className="pt-6">
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                                                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : topics.length === 0 ? (
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                            <CardContent className="pt-6">
                                <div className="text-center py-16">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-6"
                                    >
                                        <MessageSquare className="h-24 w-24 text-gray-400 mx-auto" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-700 mb-4">Chưa có chủ đề nào</h3>
                                    <p className="text-gray-500 mb-8 text-lg">
                                        Hãy tạo chủ đề đầu tiên để bắt đầu cuộc thảo luận thú vị
                                    </p>
                                    <CreateTopic onTopicCreated={handleTopicCreated} />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic, index) => (
                                <motion.div
                                    key={topic._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <TopicCard topic={topic} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}