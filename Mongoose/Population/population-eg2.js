/**
 * 分两次运行，第一次创建数据，第二次执行查询
 * 通过禁用createData()来实现
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

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
    poster   : { type: Schema.Types.ObjectId, ref: 'User' },
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    title    : String,
    content  : String
});

var Post = mongoose.model('Post', PostSchema);

var CommentSchema = new Schema({
    post      : { type: Schema.Types.ObjectId, ref: "Post" },
    commenter : { type: Schema.Types.ObjectId, ref: 'User' },
    content   : String
});

var Comment = mongoose.model('Comment', CommentSchema);

// 连接数据库
mongoose.connect('mongodb://localhost/population-test', function (err) {
    if (err) throw err;
    // createData();
});

function createData() {
   
    var userIds    = [new ObjectId, new ObjectId, new ObjectId];
    var postIds    = [new ObjectId, new ObjectId, new ObjectId];
    var commentIds = [new ObjectId, new ObjectId, new ObjectId];

    var users    = [];
    var posts    = [];
    var comments = [];

    users.push({
        _id   : userIds[0],
        name  : 'aikin',
        posts : [postIds[0]]
    });
    users.push({
        _id   : userIds[1],
        name  : 'luna',
        posts : [postIds[1]]
    });
    users.push({
        _id   : userIds[2],
        name  : 'luajin',
        posts : [postIds[2]]
    });

    posts.push({
        _id      : postIds[0],
        title    : 'post-by-aikin',
        poster   : userIds[0],
        comments : [commentIds[0]]
    });
    posts.push({
        _id      : postIds[1],
        title    : 'post-by-luna',
        poster   : userIds[1],
        comments : [commentIds[1]]
    });
    posts.push({
        _id      : postIds[2],
        title    : 'post-by-luajin',
        poster   : userIds[2],
        comments : [commentIds[2]]
    });

    comments.push({
        _id       : commentIds[0],
        content   : 'comment-by-luna',
        commenter : userIds[1],
        post      : postIds[0]
    });
    comments.push({
        _id       : commentIds[1],
        content   : 'comment-by-luajin',
        commenter : userIds[2],
        post      : postIds[1]
    });
    comments.push({
        _id       : commentIds[2],
        content   : 'comment-by-aikin',
        commenter : userIds[1],
        post      : postIds[2]
    });

    User.create(users, function(err, docs) {
        Post.create(posts, function(err, docs) {
            Comment.create(comments, function(err, docs) {
            });
        });
    });
}

/*
//填充所有 users 的 posts
User.find()
    .populate('posts', 'title', null)
    .exec(function (err, docs) {
        console.log(JSON.stringify(docs, undefined, 2)); // post-by-aikin
    });

//填充 user 'luajin'的 posts
User.findOne({
        name: 'luajin'
    })
    .populate({
        path: 'posts',
        select: {
            title: 1
        },
        options: {
            sort: {
                title: -1
            }
        }
    })
    .exec(function (err, doc) {
        console.log(doc.posts[0].title); // post-by-luajin
    });



Post.findOne({title: 'post-by-aikin'})
    .populate('poster comments', '-_id')
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

Post.findOne({title: 'post-by-aikin'})
    .populate({path: 'poster comments', select: '-_id'})
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

//上两种填充的方式实现的功能是一样的。就是给 populate 方法的参数不同。
//这里要注意，当两个关联的字段同时在一个 path 里面时， select 必须是 document(s)
//具有的相同字段。
Post.find({title: 'post-by-aikin'})
    .populate('poster comments')
    .exec(function(err, docs) {

        var opts = [{
            path   : 'comments.commenter',
            select : 'name',
            model  : 'User'
        }];

        Post.populate(docs, opts, function(err, populatedDocs) {
            console.log(populatedDocs[0].poster.name);                  // aikin
            console.log(populatedDocs[0].comments[0].commenter.name);  // luna
        });
    });
*/

    User.findOne({name: 'aikin'})
    .exec(function(err, doc) {

        var opts = [{
            path   : 'posts',
            select : 'title'
        }];

        doc.populate(opts, function(err, populatedDoc) {
            console.log(populatedDoc.posts[0].title);  // post-by-aikin
        });
    });
