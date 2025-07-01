'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/auth/LoginButton'
import TopicCard from '@/components/topics/TopicCard'
import CreateTopic from '@/components/topics/CreateTopic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team Review
            </h1>
            <p className="text-muted-foreground mt-2">
              Nền tảng chia sẻ ý kiến và thảo luận cho team
            </p>
          </div>
          <LoginButton />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Chia sẻ ý kiến,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              xây dựng team
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tạo không gian thảo luận mở, nơi mọi thành viên có thể chia sẻ ý kiến một cách tự do và xây dựng.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-none shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Thảo luận mở</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tạo chủ đề và thảo luận mở, khuyến khích mọi người chia sẻ ý kiến
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Ẩn danh tùy chọn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cho phép bình luận ẩn danh để tạo không gian an toàn cho mọi ý kiến
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Cải thiện liên tục</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Thu thập phản hồi và cải thiện quy trình làm việc của team
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}