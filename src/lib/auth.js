import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable')
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('Please define GOOGLE_CLIENT_ID environment variable')
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Please define GOOGLE_CLIENT_SECRET environment variable')
}

const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true, 
    tlsAllowInvalidCertificates: false, 
    tlsAllowInvalidHostnames: false, 
    serverSelectionTimeoutMS: 10000, 
    connectTimeoutMS: 10000, 
    maxPoolSize: 10, 
    retryWrites: true,
    w: 'majority',
})

let clientPromise

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
    debug: process.env.NODE_ENV === 'development',
}