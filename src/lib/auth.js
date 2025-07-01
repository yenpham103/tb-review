// src/lib/auth.js - Cấu hình cho MongoDB Atlas
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"

// Kiểm tra environment variables
if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable')
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('Please define GOOGLE_CLIENT_ID environment variable')
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Please define GOOGLE_CLIENT_SECRET environment variable')
}

// MongoDB Atlas client với SSL/TLS options
const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true, // Bật TLS cho Atlas
    tlsAllowInvalidCertificates: false, // Yêu cầu certificate hợp lệ
    tlsAllowInvalidHostnames: false, // Yêu cầu hostname hợp lệ
    serverSelectionTimeoutMS: 10000, // Tăng timeout lên 10 giây
    connectTimeoutMS: 10000, // Timeout kết nối 10 giây
    maxPoolSize: 10, // Giới hạn connection pool
    retryWrites: true,
    w: 'majority',
})

let clientPromise

// Singleton pattern cho MongoDB connection
if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    clientPromise = client.connect()
}

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id
            }
            return session
        },
    },
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Bật debug mode
}