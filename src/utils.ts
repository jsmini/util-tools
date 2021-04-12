/**
 * @author jdeseva
 * @date 2019.10.24
 * @description 自用工具类函数，包含常用的自定义工具类函数，不定期整理更新。欢迎提出issue
 * @homePage https://github.com/jsmini/util-tools
 */

/** ******************************************************** */

/**
 * 单次执行函数，页面加载后只能执行一次
 * @param method {Function} 传入的函数
 * @returns {Function} 返回函数
 */
export function __Once(method: Function): Function {
    let done = false
    return function (): Function {
        return done ? undefined : ((done = true), method.apply(this, arguments))
    }
}

/**
 * 防抖函数
 * @param method {Function}  事件触发的操作，传入的函数
 * @param delay {Number} - [delay = 500]  多少毫秒内连续触发事件，不会执行
 * @returns {Function}  返回包装之后的函数
 */
export function __Debounce(method: Function, delay: number = 500): Function {
    let timer: number | null = null
    return function (): void {
        let self = this
        let args = arguments
        timer && clearTimeout(timer)
        timer = setTimeout(function (): void {
            method.apply(self, args)
        }, delay)
    }
}

/**
 * 节流函数
 * @param method {Function}  事件触发的操作，传入的函数
 * @param delay {Number} - [delay = 500]  间隔多少毫秒需要触发一次事件
 * @returns {Function}  返回包装之后的函数
 */
export function __Throttle(method: Function, delay: number = 500): Function {
    let timer: number
    let args = arguments
    let start: number
    return function loop(): void {
        let self = this
        let now = Date.now()
        if (!start) {
            start = now
        }
        if (timer) {
            clearTimeout(timer)
        }
        if (now - start >= delay) {
            method.apply(self, args)
            start = now
        } else {
            timer = setTimeout(function (): void {
                loop.apply(self, args)
            }, 50)
        }
    }
}

/**
 * 将List结构的对象数组转化为树形结构
 * @param data {Array<object>} 源数据
 * @param parentIdKey {string} 关联节点名称
 * @param idKey {string} 主键
 * @returns {Array<object>} 返回的树形结构数据
 */
export function __ToTree(
    data: object[],
    parentIdKey: string,
    idKey: string = 'id'
): object[] {
    let _idMap = Object.create(null)
    data.forEach((row: object): void => {
        _idMap[row[idKey]] = row
    })
    const result: object[] = []
    data.forEach((row: object): void => {
        let parent = _idMap[row[parentIdKey]]
        if (parent) {
            let v = parent.children || (parent.children = [])
            v.push(row)
        } else {
            result.push(row)
        }
    })
    return result
}

/**
 * 将map字典对象转化为List
 * @param {Object} map Map对象
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Array<Object>} 返回数组
 */
export function __MapToArray(
    map: object,
    key: string = 'name',
    val: string = 'value'
): object[] {
    let res = []
    for (let k in map) {
        var temp = Object.create(null)
        temp[key] = k
        temp[val] = map[k]
        res.push(temp)
    }
    return res
}

/**
 * 将数组转化为字典对象类型
 * @param {Array} array 数据
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Object} 返回map对象字典
 */
export function __ArrayToMap(
    array: object[],
    key: string = 'name',
    val: string = 'value'
): object {
    var res = Object.create(null) // 新建一个纯粹对象
    array.forEach((row: object): void => {
        res[row[key]] = row[val]
    })
    return res
}
