import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from 'dotenv';    
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

import {connectToDatabase} from "./lib/appDatabase.js"

const app = express();
const server = http.createServer(app);
config();
connectToDatabase();

//init socket server
export const io = new Server(server, {
    cors: {
        origin: '*'
       
    }
});

//Store online users
export const userSocketMap = {}; // {userId: socketId}


// Socket.io connnection handler
io.on("connection", (socket) =>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);


    if(userId) userSocketMap[userId] = socket.id;


    //emit online users to all connectd clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
}  )

// Load environment variables from .env file


app.use(express.json({limit: '10mb'}));
app.use(cors());

app.use("/api/status", (req, res) => {
    res.send("Server is working");
});

// Middleware to handle CORS preflight requests
app.use('/api/auth',userRouter);
app.use('/api/messages', messageRouter);



// In-memory commit storage
let commits = [];

// Endpoint to add a commit
app.post('/api/commits', (req, res) => {
    const { message, author } = req.body;
    if (!message || !author) {
        return res.status(400).json({ error: 'Message and author are required.' });
    }
    const commit = {
        id: commits.length + 1,
        message,
        author,
        timestamp: new Date().toISOString()
    };
    commits.push(commit);
    res.status(201).json(commit);
});

// Endpoint to get all commits
app.get('/api/commits', (req, res) => {
    res.json(commits);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


