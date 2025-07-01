
// src/components/topics/TopicCard.jsx
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Calendar } from 'lucide-react'

export default function TopicCard({ topic, commentCount = 0 }) {
    return (
        <Link href={`/topic/${topic._id}`}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                        {topic.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {topic.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>{commentCount} bình luận</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(topic.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}