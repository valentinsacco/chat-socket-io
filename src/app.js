import express from 'express'
const app = express()

import { Server } from 'http'
const server = Server(app)

import socketIo from 'socket.io'
const io = socketIo(server)

import path from 'path'
import cors from 'cors'
import formatMessage from './libs/messages'
import { joinUser, getUser, leaveUser, usersInRoom } from './libs/users'

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

io.on('connection', socket => {
    socket.on('join room', ({ username, room }) => {
        const user = joinUser(socket.id, username, room)

        socket.join(user.room)

        socket.broadcast.to(user.room).emit('message', formatMessage('admin', `${user.username} se ha unido al chat`))

        io.to(user.room).emit('room users', {
            room: user.room,
            users: usersInRoom(user.room)
        })
    })

    socket.on('chat message', msg => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    socket.on('disconnect', () => {
        const user = leaveUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage('admin', `${user.username} ha dejado el chat`))

            io.to(user.room).emit('room users', {
                room: user.room,
                users: usersInRoom(user.room)
            })
        }
    })
})

app.use(express.static(path.join(__dirname, '../public')))

export { server, app } 