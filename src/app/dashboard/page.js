'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/auth/LoginButton'
import TopicCard from '@/components/topics/TopicCard'
import CreateTopic from '@/components/topics/CreateTopic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, TrendingUp, Clock } from 'lucide-react'

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Chào mừng {session.user?.name} đến với Team Review
                        </p>
                    </div>
                    <LoginButton />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng chủ đề</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{topics.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {topics.filter(t =>
                                    new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                ).length}
                            </div>
                            <p className="text-xs text-muted-foreground">7 ngày qua</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mới nhất</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {topics.length > 0 ?
                                    new Date(topics[0]?.createdAt).toLocaleDateString('vi-VN') :
                                    'N/A'
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Chủ đề thảo luận</h2>
                    <CreateTopic onTopicCreated={handleTopicCreated} />
                </div>

                {/* Topics Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-muted rounded"></div>
                                            <div className="h-3 bg-muted rounded w-5/6"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : topics.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có chủ đề nào</h3>
                                <p className="text-muted-foreground mb-4">
                                    Hãy tạo chủ đề đầu tiên để bắt đầu thảo luận
                                </p>
                                <CreateTopic onTopicCreated={handleTopicCreated} />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <TopicCard key={topic._id} topic={topic} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}