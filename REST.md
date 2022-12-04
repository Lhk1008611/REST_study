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

- fetch的使用

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

- 使用AbortController终止请求的发送

  ```js
         btn.onclick = () => {
              //创建一个AbortController，用于终止请求
              const abortController = new AbortController();
              setTimeout(() => {
                  abortController.abort();  //终止请求
              }, 3000);
              fetch("http://localhost:3000/test", {
                  signal: abortController.signal
              })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err))
          }
  ```

  ```js
          const btn = document.querySelector(".btn");
          const btnCancel = document.querySelector(".btn-cancel");
          let abortController;
          btn.onclick = () => {
              //创建一个AbortController，用于终止请求
              abortController = new AbortController();
              fetch("http://localhost:3000/test", {
                  signal: abortController.signal
              })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err))
          }
  
          btnCancel.onclick = () => {
              abortController && abortController.abort();  //abortController不为null时终止请求发送
          }
  ```

- 基于async和await的方式使用fetch

  ```js
          btnData.onclick = async () => {
              //基于async和await的方式使用fetch时一定需要try-catch
              try {
                  const res = await fetch("http://localhost:3000/students", {
                      headers: {
                          "Authorization": `Bearer ${localStorage.getItem("token")}`
                      }
                  });
                  const result = await res.json();
                  console.log(result);
              } catch (error) {
                  console.log(error);
              }
          }
  ```

- 关于fetch的更多选项可以查看MDN官网参考文档

## Axios

- 官方文档：[起步 | Axios 中文文档 | Axios 中文网 (axios-http.cn)](https://www.axios-http.cn/docs/intro)

  - 个人认为axios的官方文档对于小白还是大牛都十分友好

- Axios 是一个基于 *[promise](https://javascript.info/promise-basics)* 网络请求库，**作用于[`node.js`](https://nodejs.org/) 和浏览器中**。 它是 *[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)* 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js `http` 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。

- axios的安装

  - 在node中引入可以使用npm、yarn进行安装
  - 在浏览器（html）中安装可以使用打包工具或者引入cdn

- 相对于fetch，axios对xhr进行了更加智能的封装，使用起来更加便捷

  - axios在发送post请求参数时会自动设置与请求参数格式对应的请求头
  - axios在读取响应数据时也会自动将数据转为对应的格式
  - axios默认只会在状态码为2xx时调用then

- axios的常用请求配置选项

  ```json
  {
              baseURL: "http://localhost:3000",
              method: 'post',
              url: '/students', 
      		headers: {
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
              //data 是作为请求体被发送的数据
              data: {
                  name: "小李",
                  age: "23",
                  gender: "男",
                  address: "湖南"
              }
  }
  ```

  - 更多axios的配置项可参考axios官方文档：[请求配置 | Axios 中文文档 | Axios 中文网 (axios-http.cn)](https://www.axios-http.cn/docs/req_config)

  - `signal: abortController.signal`在axios中也可使用，使用方式与在fetch中的使用方式一致，用于取消请求

    ```js
    const controller = new AbortController();
    
    axios.get('/foo/bar', {
       signal: controller.signal
    }).then(function(response) {
       //...
    });
    // 取消请求
    controller.abort()
    ```

- axios的默认配置

  ```js
  
      axios.defaults.baseURL = 'http://localhost:3000';
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  
  ```

- axios实例

  - 通过创建axios实例可以向多个不同的服务器发送请求

  - axios实例相当于是axios的一个副本，功能与axios一致，可以指定一些配置项进行自定义axios实例的功能

    ```js
    const instance = axios.create({
      baseURL: 'https://some-domain.com/api/',
      timeout: 1000,
      headers: {'X-Custom-Header': 'foobar'}
    });
    ```

- axios拦截器

  - 可以对请求或响应进行拦截，在请求发送前和响应读取前处理数据

  - 可以使用拦截器对请求或响应进行一些通用的配置

  - 拦截器支队当前的axios实例有效

    ```js
        // 添加请求拦截器     config表示axios的配置对象
        axios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            console.log(config);
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });
    
        // 添加响应拦截器
        axios.interceptors.response.use(function (response) {
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response;
        }, function (error) {
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    ```

  - 取消拦截器

    ```js
    const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
    axios.interceptors.request.eject(myInterceptor);
    ```

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
     - 只做了前端登录验证，未做后端登录验证

## jsonwebtoken(jwt)

- 如何做到服务器端验证验证用户登录？

  - REST风格的服务器是无状态的服务器，所以注意不要在服务器中存储用户的数据

    - 无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。

  - 服务器不能存储用户信息，可以将用户信息发送给客户端保存（存储在本地缓存中）

    - 例如：``` {id:"xxx",username:"xxx",email:"xxx"}```
    - 客户端每次访问服务器时，直接将用户信息发回，服务器就可以根据用户信息来识别用户的身份
    - 但是直接将数据以明文形式发送给客户端同样会造成数据安全的问题
    - 因此，服务器在发送数据给客户端时，可以先对数据进行加密，然后再发送给客户端，这样可以避免数据的泄露

  - 在nodeJs中可以使用jsonwebtoken这个包来对数据进行加密

    - jsonwebtoken（jwt）：通过对json加密后，生成一个web中使用的令牌

    - 使用步骤

      > 1. 安装
      >
      >    ```bash
      >    yarn add jsonwebtoken
      >    ```
      >
      > 2. 引入
      >
      >    ```js
      >    const jwt = require('jsonwebtoken');
      >    ```
      >
      > 3. 服务端生成token，并发送给客户端
      >
      >    ```js
      >    app.post("/login",(req, res)=>{
      >        const {username,password} = req.body
      >        if (username === "lhk" && password === "123456"){
      >            //登录成功，生成token  jwt.sign(payload,secretOrPrivateKey,options)
      >            const token = jwt.sign({
      >                username:"admin",
      >                nickname:"超级管理员",
      >            },"lhk1008611",
      >                {
      >                    expiresIn: "1d"     //设置过期时间
      >                }
      >            );
      >            res.send({
      >                status:"ok",
      >                data:{
      >                    token,
      >                    nickname:"超级管理员",
      >                }
      >            })
      >        }else{
      >            res.status(403).send({
      >                status:"error",
      >                data:"登录失败！"
      >            })
      >        }
      >    })
      >    ```
      >
      > 4. 客户端将token存储到本地
      >
      >    ```js
      >    localStorage.setItem("token", res.data.token)
      >    localStorage.setItem("nickname", res.data.nickname)
      >    ```
      >
      > 5. 客户端将token发送给服务端
      >
      >    ```js
      >     fetch("http://localhost:3000/students", {
      >    	headers: {
      >    		/*
      >    			将token放入Authorization这个头中一起发送给服务器
      >    				- 且该头的格式为："Bearer token"
      >    					- Bearer:是一种权限认证的方案
      >    		*/
      >    		"Authorization": `Bearer ${localStorage.getItem("token")}`
      >                }
      >            })
      >    ```
      >
      >    注意：
      >
      >    ```js
      >    //在服务器端需要设置可允许接收的头，否则会出现跨域问题
      >    res.setHeader("Access-Control-Allow-Headers","Content-type,Authorization");
      >    ```
      >
      > 6. 服务器验证用户登录
      >
      >    ```js
      >    app.get("/students",(req, res)=>{
      >        try{
      >            //验证用户是否登录
      >            const token = req.get("Authorization").split(" ")[1];
      >            //对token进行解密
      >            const decodeToken = jwt.verify(token,"lhk1008611");
      >            //解码成功，发送数据给客户端
      >            res.send({
      >                status:"ok",
      >                data:STU_ARR
      >            })
      >        }catch (e){
      >            //解码失败
      >            res.status(403).send({
      >                status:"error",
      >                data:"token失效"
      >            })
      >        }
      >    })
      >    ```
      >
      >    

