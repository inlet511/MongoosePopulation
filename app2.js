var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;


var UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
});
var User = mongoose.model('User', UserSchema);

var PostSchema = new Schema({
    title: String
});
var Post = mongoose.model('Post', PostSchema);



// 连接数据库
mongoose.connect('mongodb://localhost/population-test', function (err) {
    if (err) throw err;
    // createData();
});

function createData() {

    var userIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
    var postIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];

    var users = [];
    var posts = [];


    users.push({
        _id: userIds[0],
        name: 'aikin',
        posts: [postIds[0]]
    });
    users.push({
        _id: userIds[1],
        name: 'luna',
        posts: [postIds[1]]
    });
    users.push({
        _id: userIds[2],
        name: 'luajin',
        posts: [postIds[2]]
    });

    posts.push({
        _id: postIds[0],
        title: 'post-by-aikin'
    });
    posts.push({
        _id: postIds[1],
        title: 'post-by-luna'
    });
    posts.push({
        _id: postIds[2],
        title: 'post-by-luajin'
    });


    User.create(users, function (err, docs) {
        Post.create(posts, function (err, docs) {});
    });
}


User.find()
    .populate('posts', 'title', null)
    .exec(function (err, docs) {
        console.log(JSON.stringify(docs, undefined, 2)); // post-by-aikin
    });