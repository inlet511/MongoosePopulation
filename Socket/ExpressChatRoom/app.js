var express = require('express');
var app = express();

//socket.io
var http=require('http').Server(app);
var io = require('socket.io')(http);

//session
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized:true
}));

//为了方便我们使用内存记录用户名
var alluser = [];

//设置模板引擎
app.set("view engine","ejs");
app.set("views","views");

app.use(express.static("./public"));

//路由
app.get('/',(req,res,next)=>{
    res.render("index");
});

//确认登录，检查此人是否有用户名，并且昵称不重复
app.get('/check',(req,res,next)=>{
    var username = req.query.username;
    if(!username)
    {
        res.send("必须填写用户名");
    }
    if(alluser.indexOf(username)!=-1){
        res.send("用户名已经被占用");
        return;
    }
    alluser.push(username);
    //写入session
    req.session.username = username;
    res.redirect("/chat");
});

//聊天室
app.get('/chat',(req,res,next)=>{
    if(!req.session.username){
        res.redirect('/');
    }
    res.render("chat",{
        username:req.session.username
    });
});

io.on("connection",(socket)=>{
    socket.on("chat",(msg)=>{
        io.emit("broadcast",msg);
    });
});

http.listen(3000);