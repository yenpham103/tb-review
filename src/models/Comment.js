import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    anonymousName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema)