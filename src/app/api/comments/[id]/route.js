import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { authOptions } from '@/lib/auth'

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()

        const comment = await Comment.findById(params.id)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        if (comment.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden - You can only delete your own comments' }, { status: 403 })
        }

        await Comment.findByIdAndDelete(params.id)

        return NextResponse.json({ message: 'Comment deleted successfully' })
    } catch (error) {
        console.error('Error deleting comment:', error)
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }
}

export async function GET(request, { params }) {
    try {
        await dbConnect()
        const comment = await Comment.findById(params.id)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        return NextResponse.json(comment)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comment' }, { status: 500 })
    }
}