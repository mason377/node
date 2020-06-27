/*轮播图的增加修改删除*/
let router = require("koa-router")()
let MongoClient = require("mongodb").MongoClient
let fs = require("fs")
let path = require("path")
//
const ObjectId = require("mongodb").ObjectId

let assert = require("assert")
let url = "mongodb://127.0.0.1:27017"

// Database Name
const dbName = "test666"

// 查询数据
let findData = function(db, find_params, callback) {
  // Get the Data collection
  let collection = db.collection("focus")
  // Find some Data
  if (find_params._id) {
    find_params._id = ObjectId(find_params._id)
  }
  collection.find(find_params).toArray(function(err, result) {
    assert.equal(err, null)
    callback(result)
  })
}

// 添加数据
let insertData = function(db, add_params, callback) {
  // Get the Data collection
  let collection = db.collection("focus")
  // Insert some Data
  collection.insertMany([add_params], function(err, result) {
    assert.equal(err, null)
    // 如果值不相等，则用与消息参数的值相等的消息属性集抛出断言错误。如果消息参数未定义，则分配默认错误消息。如果消息参数是错误的实例，那么它将被抛出而不是断言错误
    // assert.equal(3, result.result.n)
    // assert.equal(3, result.ops.length)

    // 将结果以回调的形式传递给调用的位置
    callback(result)
  })
}

// 修改数据
let updateData = function(db, focus_id, modify_params, callback) {
  // Get the Data collection
  let collection = db.collection("focus")
  // Update Data where a is 2, set b equal to 1

  collection.updateOne(
    { _id: ObjectId(focus_id._id) },
    { $set: modify_params },
    function(err, result) {
      assert.equal(err, null)
      // assert.equal(1, result.result.n)
      callback(result)
    }
  )
}

// 删除数据
let removeData = function(db, focus_id, callback) {
  // Get the Data collection
  let collection = db.collection("focus")
  // Delete Data where a is 3
  collection.deleteOne({ _id: ObjectId(focus_id._id) }, function(err, result) {
    assert.equal(err, null)
    // assert.equal(1, result.result.n);
    callback(result)
  })
}

// GET 查询
router.get("/", async ctx => {
  let find_params = ctx.query
  // console.log(add_params)
  // console.log("get")
  // console.log(ctx.url) // "/admin/focus/?a=6666&b=8888"
  // console.log(ctx.query) // Object  { a: '6666', b: '8888' }
  // console.log(typeof(ctx.querystring)) // string
  // console.log(ctx.querystring) // "a=6666&b=8888"

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
        // 调用方法，插入数据
        findData(db, find_params, function(result) {
          client.close()
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      return data
    })
    .catch(function(errMsg) {})

  ctx.body = {
    status: 201,
    message: "put success",
    data: result,
    total_data: result.length
  }
})

// POST 添加
router.post("/add", async ctx => {
  let add_params = ctx.request.body
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
        // 调用方法，插入数据
        insertData(db, add_params, function(result) {
          client.close()
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      return data
    })
    .catch(function(errMsg) {})

  ctx.body = { status: 201, message: "add success" }
})

// PUT 修改 （动态路由）
router.put("/edit/:_id", async ctx => {
  // 确定要修改哪一条数据
  let focus_id = ctx.params
  // 将对应的数据修改为某个值
  let modify_params = ctx.request.body
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
        // 调用方法，插入数据
        updateData(db, focus_id, modify_params, function(result) {
          client.close()
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      return data
    })
    .catch(function(errMsg) {})

  ctx.body = { status: 201, message: "put success" }
})

// delete 删除 （动态路由）
router.delete("/delete/:_id", async ctx => {
  // 确定要修改哪一条数据
  let focus_id = ctx.params
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
        // 调用方法，插入数据
        removeData(db, focus_id, function(result) {
          client.close()
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      return data
    })
    .catch(function(errMsg) {})

  ctx.body = { status: 201, message: "delete success" }
})

// upload 上传单个文件
router.post("/uploadFile", async ctx => {
  let file = ctx.request.files.file // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  // 获取上传文件扩展名
  let filePath =
    path.join(__dirname, "../../", "static/image") + `/${file.name}`
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  ctx.body = {
    status: 201,
    message: "upload success",
    data: { url: filePath }
  }
})

// upload 上传多个文件
router.post("/uploadFiles", async ctx => {
  // 获取上传文件
  const files = ctx.request.files.file
  let filePaths = []
  for (let file of files) {
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    // 获取上传文件扩展名
    let filePath =
      path.join(__dirname, "../../", "static/image") + `/${file.name}`
    filePaths.push(filePath)
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
  }

  let add_params = {url: filePaths}
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
        // 调用方法，插入数据
        insertData(db, add_params, function(result) {
          client.close()
          resolve(result)
        })
      }
    )
  })

  let result = await res
    .then(function(data) {
      return data
    })
    .catch(function(errMsg) {})

  ctx.body = {
    status: 201,
    message: "upload success",
    data: { url: filePaths }
  }
})

module.exports = router.routes()
