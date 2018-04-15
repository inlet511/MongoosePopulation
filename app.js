var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;


var StudentSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    clazzs: [{
        type: Schema.Types.ObjectId,
        ref: "Clazz"
    }]
});

var Student = mongoose.model('student', StudentSchema);

//定义Schema
var ClazzSchema = new Schema({
    clazzName: String
});

var Clazz = mongoose.model('clazz', ClazzSchema);


mongoose.connect('mongodb://localhost/test', function (err) {
    if (err) throw err;

    fillData();
});


function fillData() {

    var clazzIDs = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
    var studentIDs = [];
    for (let i = 0; i < 5; i++) {
        studentIDs.push(new mongoose.Types.ObjectId);
    }

    var clazzes = [];
    var students = [];

    students.push({
        _id: studentIDs[0],
        name: '张三',
        clazzs: [clazzIDs[0]]
    });

    students.push({
        _id: studentIDs[1],
        name: '李四',
        clazzs: [clazzIDs[0]]
    });

    students.push({
        _id: studentIDs[2],
        name: '王五',
        clazzs: [clazzIDs[0]]
    });

    students.push({
        _id: studentIDs[3],
        name: '赵六',
        clazzs: [clazzIDs[1]]
    });

    students.push({
        _id: studentIDs[4],
        name: '孙七',
        clazzs: [clazzIDs[1]]
    });

    clazzes.push({
        _id: clazzIDs[0],
        clazzName: "软件1班"
    });

    clazzes.push({
        _id: clazzIDs[1],
        clazzName: "软件2班"
    });


    Student.create(students, function (err, result) {
        Clazz.create(clazzes, function (err, result) {});
    });



}




Student.find()
    .populate('clazzs', 'clazzName', null)
    .exec(function (err, result) {
        console.log(JSON.stringify(result, undefined, 2));
    });