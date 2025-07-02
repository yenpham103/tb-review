const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

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

    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST", "DELETE"]
        }
    })

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        socket.on('join-topic', (topicId) => {
            socket.join(`topic-${topicId}`)
            console.log(`User ${socket.id} joined topic-${topicId}`)
        })

        socket.on('leave-topic', (topicId) => {
            socket.leave(`topic-${topicId}`)
            console.log(`User ${socket.id} left topic-${topicId}`)
        })

        socket.on('new-comment', (data) => {
            socket.to(`topic-${data.topicId}`).emit('comment-added', data.comment)
            console.log('Comment broadcasted to topic:', data.topicId)
        })

        socket.on('comment-deleted', (data) => {
            socket.to(`topic-${data.topicId}`).emit('comment-deleted', data.commentId)
            console.log('Comment deletion broadcasted to topic:', data.topicId, 'commentId:', data.commentId)
        })

        socket.on('user-typing', (data) => {
            socket.to(`topic-${data.topicId}`).emit('user-typing', {
                userId: data.userId,
                userName: data.userName,
                isAnonymous: data.isAnonymous
            })
        })

        socket.on('user-stopped-typing', (data) => {
            socket.to(`topic-${data.topicId}`).emit('user-stopped-typing', {
                userId: data.userId
            })
        })

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