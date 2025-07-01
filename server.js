// server.js - Cập nhật để hỗ trợ xóa comment realtime
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })

    // Initialize Socket.IO
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST", "DELETE"]
        }
    })

    // Socket.IO connection handling
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        // Join topic room
        socket.on('join-topic', (topicId) => {
            socket.join(`topic-${topicId}`)
            console.log(`User ${socket.id} joined topic-${topicId}`)
        })

        // Leave topic room
        socket.on('leave-topic', (topicId) => {
            socket.leave(`topic-${topicId}`)
            console.log(`User ${socket.id} left topic-${topicId}`)
        })

        // Handle new comment
        socket.on('new-comment', (data) => {
            // Broadcast to all users in the topic room except sender
            socket.to(`topic-${data.topicId}`).emit('comment-added', data.comment)
            console.log('Comment broadcasted to topic:', data.topicId)
        })

        // Handle comment deletion
        socket.on('comment-deleted', (data) => {
            // Broadcast to all users in the topic room except sender
            socket.to(`topic-${data.topicId}`).emit('comment-deleted', data.commentId)
            console.log('Comment deletion broadcasted to topic:', data.topicId, 'commentId:', data.commentId)
        })

        // Handle user typing
        socket.on('user-typing', (data) => {
            socket.to(`topic-${data.topicId}`).emit('user-typing', {
                userId: data.userId,
                userName: data.userName,
                isAnonymous: data.isAnonymous
            })
        })

        // Handle user stopped typing
        socket.on('user-stopped-typing', (data) => {
            socket.to(`topic-${data.topicId}`).emit('user-stopped-typing', {
                userId: data.userId
            })
        })

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })

    httpServer
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`)
        })
})