import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Topic from '@/models/Topic'
import Comment from '@/models/Comment'

export async function GET(request, { params }) {
    try {
        await dbConnect()
        const topic = await Topic.findById(params.id)

        if (!topic) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
        }

        return NextResponse.json(topic)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 })
    }
}