# 文档
这是一个自用工具类函数库，目前只有下列功能，会不定期更新，欢迎issue

## api模版

**方法列表**

- `__Once` : 单次执行，页面加载后只能执行一次
- `__Debounce` : 防抖函数
- `__Throttle` : 节流函数
- `__ToTree` : 构建树
- `__MapToArray` : 映射数组
- `__ArrayToMap` : 映射map字典
- `Storage` : 本地储存类

**函数参数和返回值(根据代码提示即可)**

#### __Once

 * 单次执行函数，页面加载后只能执行一次
 * @param method {Function} 传入的函数
 * @returns {Function} 返回函数

**代码用例**

```js
import { __Once } from '@jsmini/util-tools'

var a = 0

var Fn = __Once(() => {
    a = a + 1
})

Fn()

console.log(a) // 1

Fn()

console.log(a) // 1
```

#### __Debounce

 * 防抖函数
 * @param {Function} method 事件触发的操作，传入的函数
 * @param {Number} [delay = 500] - 多少毫秒内连续触发事件，不会执行
 * @returns {Function} - 返回包装之后的函数
 
**代码用例**

```js
import { __Debounce } from '@jsmini/util-tools'

var a = 0

var Fn = __Debounce(() => {
    a = a + 1
})

Fn()

console.log(a) // 0

setTimeout(() => {
    console.log(a) // 1
}, 1000)
```

#### __Throttle

 * 节流函数
 * @param {Function} method 事件触发的操作，传入的函数
 * @param {Number} [delay = 500] - 间隔多少毫秒需要触发一次事件
 * @returns {Function} - 返回包装之后的函数

**代码用例**

```js
import { __Throttle } from '@jsmini/util-tools'

var a = 0

var Fn = __Throttle(() => {
    a = a + 1
})

let timer = setInterval(() => {
    Fn()
}, 100)

setTimeout(() => {
    clearInterval(timer)
    console.log(a) // 3
}, 2000)
```

#### __ToTree

 * 将List结构的对象数组转化为树形结构
 * @param data {Array<object>} 源数据
 * @param parentIdKey {string} 关联节点名称
 * @param idKey {string} 主键
 * @returns {Array<object>} 返回的树形结构数据

**代码用例**

```js
import { __ToTree } from '@jsmini/util-tools'

var list = [
    { id: 0, name: '第一层', pid: -1 },
    { id: 1, name: '第二层', pid: 0 },
    { id: 2, name: '第三层', pid: 1 }
]

var tree = __ToTree(list, 'pid')

console.log(tree)
/**
 * [{
 * "id":0,"name":"第一层","pid":-1,"children":[{
 *    "id":1,"name":"第二层","pid":0,"children":[{
 *          "id":2,"name":"第三层","pid":1
 *         }]
 *     }]
 * }]
 * 
 * /
```

#### __MapToArray

 * 将map字典对象转化为List
 * @param {Object} map Map对象
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Array<Object>} 返回数组

**代码用例**

```js
import { __MapToArray } from '@jsmini/util-tools'

var map = {
    Vue: 'version --alpha-next',
    React: 'hook 16.8',
    Angular: 'I do'
}

var list = __MapToArray(map)

console.log(list) // [{"name":"Vue","value":"version --alpha-next"},{"name":"React","value":"hook 16.8"},{"name":"Angular","value":"I do"}]
```

#### __ArrayToMap

 * 将数组转化为字典对象类型
 * @param {Array} array 数据
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Object} 返回map对象字典

**代码用例**

```js
import { __MapToArray } from '@jsmini/util-tools'

var list = [{"name":"Vue","value":"version --alpha-next"},{"name":"React","value":"hook 16.8"},{"name":"Angular","value":"I do"}]

var map = __MapToArray(map)

console.log(map) 
/*
{
    Vue: 'version --alpha-next',
    React: 'hook 16.8',
    Angular: 'I do'
}
*/
```

#### Storage

* 本地持久化储存实体类
 * @param isLocal {boolean | object} 储存模式，当不为布尔值时，丢弃第二个参数，并且与实例化传入值无关
 * @param deep {boolean} 是否挂载为全局对象，仅在浏览器模式下并且 isLocal 为布尔值时生效。设置 true 时，实例为单例模式。如果确需重新构建，则调用 destroyed 方法后重新实例化
 * @returns Storage实例

**代码用例**

```js
import { Storage } from '@jsmini/util-tools'

let St = new Storage()

console.log(St === new Storage()) // true

var a = true

var c = {name: 123, value: 'test'}

St.set('a', a) // 单值模式

St.set(c) // 多值模式

St.get('a') // true | 单值模式

St.get(['a', 'name']) // {a: true, name: 123} | 多值模式

St.getAll() // {a: true, name: 123, value: 'test'} | 获取全部

St.remove('a') // 单值模式

St.remove(['a', 'name']) // 多值模式

St.removeAll() // 删除全部

St.destroyed() // 销毁当前实例
```

**特殊说明**

`Storage` 本地储存类不支持`Node`环境。后续会新增`React-Native`支持。
