const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const messageRoute = require('./routes/messagesRoute');

const app = express();

const socket = require('socket.io');

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection successfully');
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server running on port ' + process.env.PORT);
});

const io = socket(server, {
    cors: {
        origin: 'http://127.0.0.1:5173',
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.message)
        }
    })
});

