// src/lib/mongodb.js - Cấu hình cho MongoDB Atlas
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Cấu hình cho MongoDB Atlas
            ssl: true, // Bật SSL cho Atlas
            tls: true,
            tlsAllowInvalidCertificates: false,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority',
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Connected to MongoDB Atlas successfully')
            return mongoose
        }).catch((error) => {
            console.error('MongoDB Atlas connection error:', error)
            throw error
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        console.error('Failed to connect to MongoDB Atlas:', e)
        throw e
    }

    return cached.conn
}

export default dbConnect