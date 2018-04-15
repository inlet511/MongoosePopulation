/**
 * 分两次运行，第一次创建数据，第二次执行查询
 * 通过禁用fillData()来实现
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;


var StudentSchema = new Schema({
    name:String,
    clazzID :[{
        type:Schema.Types.ObjectId,
        ref:"Clazz"
    }]
});

var Student = mongoose.model('Student',StudentSchema);

//定义Schema
var ClazzSchema = new Schema({
    clazzName:String
});

var Clazz = mongoose.model('Clazz',ClazzSchema);


mongoose.connect('mongodb://localhost/test',function(err){
    if(err) throw err;

    // fillData();
});


function fillData() {

    var clazzIDs = [new mongoose.Types.ObjectId,new mongoose.Types.ObjectId];
    var studentIDs = [];
    for(let i = 0; i<5 ; i++)
    {
        studentIDs.push(new mongoose.Types.ObjectId);
    }

    var clazzes = [];
    var students = [];

    clazzes.push({
        _id:clazzIDs[0],
        clazzName:"软件1班"
    });

    clazzes.push({
        _id:clazzIDs[1],
        clazzName:"软件2班"
    });

    students.push({
        _id:studentIDs[0],
        name: '张三',
        clazzID:[clazzIDs[0]]
    });

    students.push({
        _id:studentIDs[1],
        name: '李四',
        clazzID:[clazzIDs[0]]
    });

    students.push({
        _id:studentIDs[2],
        name: '王五',
        clazzID:[clazzIDs[0]]
    });

    students.push({
        _id:studentIDs[3],
        name: '赵六',
        clazzID:[clazzIDs[1]]
    });

    students.push({
        _id:studentIDs[4],
        name: '孙七',
        clazzID:[clazzIDs[1]]
    });

    Clazz.create(clazzes,function(err,result){});
    Student.create(students,function(err,result){});   

}




Student.find()
    .populate('clazzID', 'clazzName')
    .exec(function (err, result) {
        console.log(JSON.stringify(result,undefined,2));
    });