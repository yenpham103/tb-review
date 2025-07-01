// src/components/auth/LoginButton.jsx
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut } from 'lucide-react'

export default function LoginButton() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <Button disabled>Đang tải...</Button>
    }

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{session.user?.name}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={() => signIn('google')}
            className="flex items-center gap-2"
        >
            <LogIn className="h-4 w-4" />
            Đăng nhập với Google
        </Button>
    )
}

// src/components/topics/CreateTopic.jsx
'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export default function CreateTopic({ onTopicCreated }) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) return

        setLoading(true)
        try {
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            })

            if (response.ok) {
                const newTopic = await response.json()
                onTopicCreated?.(newTopic)
                setTitle('')
                setDescription('')
                setOpen(false)
            }
        } catch (error) {
            console.error('Error creating topic:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!session) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo chủ đề mới
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo chủ đề mới</DialogTitle>
                    <DialogDescription>
                        Tạo một chủ đề mới để mọi người có thể thảo luận
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề chủ đề..."
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả chi tiết về chủ đề..."
                            required
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo chủ đề'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

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