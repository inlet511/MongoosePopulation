const http = require('http');
const fs = require('fs');

var server = http.createServer(function(req,res){
    if(req.url == "/"){
        //显示首页
        fs.readFile("./index.html",(err,data)=>{
            res.end(data);
        });
    }
});

var io = require('socket.io')(server);
io.on("connection",(socket)=>{
    console.log('客户端连接了');
    socket.on('question',(msg)=>{
        console.log(`Got Message: ${msg}`);
        //socket.emit('answer','Fine, Thank you');
        io.emit('answer',msg);
    })
});

server.listen(3000);