const Koa = require("koa"),
  router = require("koa-router")(),
  path = require("path"),
  bodyParser = require("koa-bodyparser"),
  koaBody = require("koa-body"),
  static = require("koa-static"),
  staticPath = "./static" // 静态资源目录对于相对入口文件index.js的路径

//引入子模块

var admin = require("./routes/admin.js")
var api = require("./routes/api.js")
var index = require("./routes/index.js")

var app = new Koa()
app.use(bodyParser()) // 处理post请求
app.use(static(path.join(__dirname, staticPath))) // 静态资源对应文件夹
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 2 * 100 * 1024 // 设置上传文件大小最大限制，默认2M
    }
    // 上传失败的回调
    // onError: err => {
    //   // console.log(888)
    //   // console.log(err.response)
    // }
  })
)

//配置路由 (首页的路由，同时也是项目默认访问的路由，默认访问链接对应：http://localhost:8008/)
router.use(index)
/*
  /admin   配置子路由  层级路由

 /admin/user
 */
router.use("/admin", admin)
/*
 /api/newslist   新闻列表的api
 */
router.use("/api", api) /*在模块里面暴露路由并且启动路由*/

//启动路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(8008)
