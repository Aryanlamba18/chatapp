const exp = require('constants')
const express = require('express')
const path = require('path')
const app = express()
const port=4000
const server = app.listen(port,()=>console.log(`chat app at port ${port}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'public','login.html'));
// })

// app.get('/chat', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });




let connectedsockets = new Set();
io.on('connection',onconnected);

function onconnected(socket){
    console.log(socket.id);
    connectedsockets.add(socket.id);
    io.emit('totalclients',connectedsockets.size)

    socket.on('disconnect',()=>{
        console.log('disconnected ',socket.id);
        connectedsockets.delete(socket.id);
        io.emit('totalclients',connectedsockets.size)
    })

    socket.on('message',(data)=>{
        // console.log(data);
        socket.broadcast.emit('chatmessage',data);
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedbackdata',data);
    })
}