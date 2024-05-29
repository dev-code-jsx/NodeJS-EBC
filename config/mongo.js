'use strict'

import mongoose from 'mongoose'

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connect to mongodb')
            mongoose.disconnect()
        })
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting')
        })
        mongoose.connection.on('connect', () => {
            console.log('MongoDB | connected to mongodb')
        })
        mongoose.connection.on('open', () => {
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnect', () => {
            console.log('MongoDB | disconnected to mongodb')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        })

    } catch (e) {
        console.log('Database connection error: ', e)
    }
}