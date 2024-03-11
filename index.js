const fs = require('fs');
const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require('ws');
const cors = require("cors");
const app = express();
const port = 3000;
const Message = require('./models/Message.js'); // Import your Message model

// Enable CORS
app.use(cors());

// Connect to MongoDB (add slash for web)
const credentials = "/etc/secrets/credentials.pem";
mongoose.connect("mongodb+srv://goodvibez.sxragvk.mongodb.net/message-db?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=goodvibez", {
    tlsCertificateKeyFile: credentials,
});

// Check connection 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
});

// Import routes
const messagesRouter = require("./routes/api/v1/messages");

app.use(express.json());

// Use routes
app.use("/api/v1/messages", messagesRouter);

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });
//add websocket to global object
global.wss = wss;
wss.on('connection', async (ws) => {
    console.log('connected');

    try {
        // Query the database for all messages
        const messages = await Message.find({ removed: false });

        // Send each message to the client
        messages.forEach(message => {
            ws.send(JSON.stringify(message));
        });
    } catch (err) {
        console.error(err);
    }

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});