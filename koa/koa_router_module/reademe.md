---

- 1. utils 文件夹下边的文件暂时是没有作用的
- 2. 不能直接再 callback 中返回 ctx.body ,每一次都需要返回一个 promise
- 3. moudle.exports 可以在一个文件里边一次导出多个模块

```
module.exports.showForm = showForm;
module.exports.subForm = subForm;
// 可简写
module.exports = {
  showForm: showForm,
  subForm: subForm
}
// 键值同名可以只写一个
module.exports = {
  showForm,
  subForm
}
```
