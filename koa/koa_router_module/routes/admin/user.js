/*用户的增加修改删除*/
var router = require("koa-router")()

var MongoClient = require("mongodb").MongoClient
var assert = require("assert")
var url = "mongodb://127.0.0.1:27017"

// Database Name
const dbName = "test666"

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection("web")
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {
    assert.equal(err, null)
    callback(result)
  })
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection("web")
  // Find some documents
  collection.find({}).toArray(function(err, data) {
    assert.equal(err, null) // 如果是err,则返回错误
    callback(data)
  })
}

router.get("/", async ctx => {
  let res = new Promise(function(resolve, reject) {
    MongoClient.connect(
      url,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      function(err, client) {
        assert.equal(null, err)
        const db = client.db(dbName)

        const collection = db.collection("web")
        // Find some documents
        collection.find({}).toArray(function(err, data) {
          resolve(data)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      //处理业务
      return data
    })
    .catch(function(errMsg) {
      //失败业务
    })

  ctx.body = result
})

router.post("/add", async ctx => {
  // Use connect method to connect to the server
  let res = new Promise(function(resolve, reject) {
    MongoClient.connect(
      url,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      function(err, client) {
        assert.equal(null, err)
        const db = client.db(dbName)

        const collection = db.collection("web")
        // Insert some documents
        collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(
          err,
          result
        ) {
          assert.equal(err, null)
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      //处理业务
      return data
    })
    .catch(function(errMsg) {
      //失败业务
    })

  ctx.body = `添加数据成功，共添加${result.result.n}条数据`
})

router.get("/edit", async ctx => {
  // await ctx.render('admin/user/edit');
  ctx.body = "后台-用户-编辑"
})
router.get("/delete", async ctx => {
  ctx.body = "后台-用户-删除"
})

module.exports = router.routes()
