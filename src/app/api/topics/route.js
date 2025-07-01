import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongodb'
import Topic from '@/models/Topic'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        await dbConnect()
        const topics = await Topic.find({}).sort({ createdAt: -1 })
        return NextResponse.json(topics)
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
            createdBy: session.user.id
        })

        const savedTopic = await topic.save()
        return NextResponse.json(savedTopic, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
    }
}