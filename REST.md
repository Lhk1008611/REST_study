# REST（Representational State Transfer）

- 表示层状态的传输

- rest实际上就是一种服务器的设计风格

  - 主要特点：服务器只返回数据

- 服务器和客户端传输数据通常会使用JSON作为数据格式

- 请求方法

  1. GET				 加载数据
  2. POST               新建或添加数据
  3. PUT                 添加或修改数据
  4. PATCH             修改数据
  5. DELETE            删除数据
  6. OPTION           由服务器自动发送，检查请求的一些权限

- API（接口）Endpoint（端点）

  ​	GET	/user

  ​	POST	/user

  ​	DELETE	/user
  
- 注意：使用rest时，要统一api

  - 请求方法统一
  - 资源名统一
  - 返回结果统一

# postman

- 一个可以向服务器发送各种请求的软件

  - 可以用于测试API

  > node.js配置解析请求体的中间件
  >
  > ```js
  > //配置解析json格式数据的请求体的中间件
  > app.use(express.json());
  > //配置解析请求体中间件
  > app.use(express.urlencoded({extended:true}));
  > ```

# http响应状态码

参考文档[100 Continue - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/100)

# AJAX

- A——异步	J——JavaScript	A——and	X——xml	（异步的js和xml）
- 作用
  - 通过js向服务器发送请求
- 早期ajax发送请求，数据的格式是 `xml`
  - xml缺点：过多与数据本身无关的标签，导致传输是数据体积比较大，传输速度慢，且不利于解析
- 目前发送请求的数据格式一般是 `json `

- ajax可选方案
  - 浏览器原生支持的ajax
    - XMLHTTPRequest（xhr）
    - Fetch
  - 第三方ajax
    - Axios
      - 在xhr基础上进行了封装，使用更方便

## XMLHTTPRequest

```js
    <script>
        const listBtn = document.querySelector(".list-btn");
        const list = document.querySelector(".student-list");
        listBtn.onclick = () => {
            //创建XMLHttpRequest对象
            const xhr = new XMLHttpRequest();

            //设置响应体类型，设置好后自动对数据进行转换
            xhr.responseType = "json";

            //读取异步获取的数据，通过绑定load事件读取
            xhr.onload = function () {
                //xhr.status表示响应状态码
                if (xhr.status === 200) {
                    //xhr.response表示响应的数据
                    // const studentlLst = JSON.parse(xhr.response);  //解析为json
                    const result = xhr.response;
                    if (result.status === "ok") {
                        const ul = document.createElement("ul");
                        list.appendChild(ul);
                        for (let student of result.data) {
                            ul.insertAdjacentHTML(
                                "beforeend",
                                `<li>${student.id} - ${student.name} - ${student.age} - ${student.gender} - ${student.address}</li>`
                            )
                        }
                    }
                }
            }

            //设置请求信息
            xhr.open("GET", "http://localhost:3000/students");

            //发送请求
            xhr.send();

        };
    </script>
```

## Fetch

- fetch是xhr的升级版，使用的是promise的API
- 作用和xhr是一样的，使用期来更加方便
- 是原生js就支持的一种ajax发送请求的方式
- fetch

```js 
	<script>
        const listBtn = document.querySelector(".list-btn");
        const list = document.querySelector(".student-list");
        listBtn.onclick = () => {
          fetch("http://localhost:3000/students")
          .then((response) =>{
            if(response.status === 200){
                //response.json() 可以读取json格式的数据，返回一个promise
                return response.json();
            }else{
                throw new Error("加载失败");
            }
          })
          .then((response)=>{
            //获取到数据，进行页面渲染
            console.log(response);
          })
          .catch((error)=>{
            console.log("出错了",error);
          })
        };
    </script>
```

```js
    <script>
        const listBtn = document.querySelector(".list-btn");
        const list = document.querySelector(".student-list");
        listBtn.onclick = () => {
          fetch("http://localhost:3000/students",{
            //发送请求的方法
            method:"post",
            //设置请求头
            headers:{
              //发送数据的类型
              "Content-Type":"application/json"
            },
            //请求体
            body:JSON.stringify({
              name:"小李",
              age:"23",
              gender:"男",
              address:"湖南"
            })
          })
        };
    </script>
```

- 关于fetch的更多选项可以查看MDN官网参考文档

## CORS(跨域资源共享)

- 两个网址的**协议**、**域名**、**端口**号中有一个不相同，则这两个网址互相发送的请求都为跨域请求

- 当通过ajax发送跨域请求时，

  - 浏览器为了服务器的安全，会阻止js读取到服务器的数据

- 解决跨域方案

  - 在服务器中设置允许跨域的响应头，允许哪些客户端你可以访问服务器

    > Access-Control-Allow-Origin

    ```js
        //设置允许访问服务器，解决跨域问题
        res.setHeader("Access-Control-Allow-Origin","*");//设置任何请求都能够访问
        //Access-Control-Allow-Origin设置指定值时，只允许设置一个
        res.setHeader("Access-Control-Allow-Origin","http://127.0.0.1:5500");
    ```

- 其他响应头

  > Access-Control-Allow-Methods	允许的请求方式
  >
  > Access-Control-Allow-Headers	允许传递的请求头

  ```js
      res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
      res.setHeader("Access-Control-Allow-Headers","Content-type");
  ```

## 本地存储

- 本地存储 = 浏览器自身的存储空间

  - 使用本地存储可以将数据存储到浏览器内部

- `sessionStorage`: 页面一关闭数据就会丢失

- `localStorage`: 存储数据的时间比较长

  ```js
  //往本地存储中存入数据
  sessionStorage.setItem("key","value");
  
  //读取本地存储中的数据
  const value = sessionStorage.getItem("key");
  
  //上次本地存储中的数据
  sessionStorage.removeItem("key");
  
  //清空本地存储中的数据
  sessionStorage.clear();
  ```

  - `localStorage`与`sessionStorage`的用法一致，如上

- 使用本地存储的缺点
  1. 数据安全问题，可能会导致数据泄露问题
  2. 做登录功能时，用户数据存储到本地可以直接进入用户页面，进入用户页面里面发送请求时可以直接从服务器端获取数据，此时服务器端无法验证用户是否登录

## token

