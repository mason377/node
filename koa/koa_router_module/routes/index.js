
var router = require("koa-router")()

router.get("/entry", async ctx => {
  ctx.body = "项目入口"
})
//注意 前台后后台匹配路由的写法不一样
router.get("/case", ctx => {
  ctx.body = "案例-case"
})

router.get("/about", async ctx => {
  ctx.body = "案例-about"
})

module.exports = router.routes()
