
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
