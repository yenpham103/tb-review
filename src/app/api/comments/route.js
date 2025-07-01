import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { authOptions } from '@/lib/auth'
import { getRandomZodiac } from '@/lib/zodiac'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const topicId = searchParams.get('topicId')

        if (!topicId) {
            return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 })
        }

        await dbConnect()
        const comments = await Comment.find({ topicId }).sort({ createdAt: -1 })
        return NextResponse.json(comments)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { topicId, content, isAnonymous } = await request.json()

        if (!topicId || !content) {
            return NextResponse.json({ error: 'Topic ID and content are required' }, { status: 400 })
        }

        await dbConnect()

        const comment = new Comment({
            topicId,
            content,
            authorId: session.user.id,
            authorName: session.user.name,
            isAnonymous,
            anonymousName: isAnonymous ? getRandomZodiac() : null
        })

        const savedComment = await comment.save()
        return NextResponse.json(savedComment, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }
}