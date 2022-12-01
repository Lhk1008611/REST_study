const express = require('express');
const app = express();
const STU_ARR = [
    {
        id:1,
        name: "lhk",
        age:10,
        gender:"男",
        address:"深圳"
    },
    {
        id:2,
        name: "小明",
        age:20,
        gender:"男",
        address:"深圳龙华"
    },
    {
        id:3,
        name: "小杨",
        age:35,
        gender:"男",
        address:"深圳龙华"
    }
]

//配置解析json格式数据的请求体的中间件
app.use(express.json());
//配置解析请求体中间件
app.use(express.urlencoded({extended:true}));

app.use((req, res,next)=>{
    //设置允许访问服务器的网址，解决跨域问题
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-type");
    next();
})

//登录
app.post("/login",(req, res)=>{
    const {username,password} = req.body
    if (username === "lhk" && password === "123456"){
        res.send({
            status:"ok",
            data:{username:"admin",nickname:"超级管理员"}
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"登录失败！"
        })
    }
})

//查询学生
app.get("/students",(req, res)=>{

    res.send({
            status:"ok",
            data:STU_ARR
    })
})

//查询某一个学生
app.get("/students/:id",(req, res)=>{
    const student  = STU_ARR.find(student => student.id === +req.params.id);
    res.send({
        status:"ok",
        data:student
    })
})

//删除一个学生
app.delete("/students/:id",(req,res)=>{
    for (let i = 0; i <STU_ARR.length ; i++) {
        if (STU_ARR[i].id === +req.params.id){
            const student = STU_ARR[i];
            STU_ARR.splice(i,1);
            res.send({
                status:"ok",
                data:student
            })
            return;
        }
    }
    //不存在学生
    res.status(403).send({
        status:"error",
        data:"学生id不存在"
    })
})

//添加学生
app.post("/students",(req, res)=>{
    const {name,age,gender,address} = req.body
    const student = {
        id:+STU_ARR.at(-1).id+1,
        name,
        age:+age,
        gender,
        address
    }
    STU_ARR.push(student)
    res.send({
        status:"success",
        data:{
            student_id:student.id
        }
    })
})

//修改学生
app.put("/students",(req, res)=>{
    const {id,name,age,gender,address} = req.body
    const updateStudent = STU_ARR.find(student => student.id === +id);
    if (updateStudent){
        updateStudent.name = name;
        updateStudent.age =age;
        updateStudent.gender =gender;
        updateStudent.address =address;

        res.send({
            status:"success",
            data:"修改成功"
        })
    }else {
        res.status(403).send({
            status:"error",
            data:"学生不存在，修改失败"
        })
    }
})


app.listen(3000,()=>{
    console.log("服务器已启动")
})