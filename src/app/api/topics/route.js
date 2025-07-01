// src/app/api/topics/route.js - Cập nhật để include comment count
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Topic from '@/models/Topic'
import Comment from '@/models/Comment'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        await dbConnect()

        // Lấy tất cả topics
        const topics = await Topic.find().sort({ createdAt: -1 })

        // Lấy comment count cho mỗi topic
        const topicsWithCommentCount = await Promise.all(
            topics.map(async (topic) => {
                const commentCount = await Comment.countDocuments({ topicId: topic._id })
                return {
                    ...topic.toObject(),
                    commentCount
                }
            })
        )

        return NextResponse.json(topicsWithCommentCount)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { title, description } = await request.json()

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
        }

        await dbConnect()

        const topic = new Topic({
            title,
            description,
            authorId: session.user.id,
            authorName: session.user.name
        })

        const savedTopic = await topic.save()

        // Thêm commentCount = 0 cho topic mới
        const topicWithCommentCount = {
            ...savedTopic.toObject(),
            commentCount: 0
        }

        return NextResponse.json(topicWithCommentCount, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
    }
}