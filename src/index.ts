/**
 * @author jsy七七
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
    return function(): Function {
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
    return function(): void {
        let self = this
        let args = arguments
        timer && clearTimeout(timer)
        timer = setTimeout(function(): void {
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
            timer = setTimeout(function(): void {
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

type mixins =
    | string
    | number
    | boolean
    | object
    | number[]
    | boolean[]
    | string[]
    | object[]

interface F {
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    clear: Function
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    getItem: Function
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    setItem: Function
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    removeItem: Function
}
/**
 * 本地持久化储存实体类
 * @param isLocal {boolean | object} - [isLocal = false] 储存模式，当不为布尔值时，丢弃第二个参数，并且与实例化传入值无关
 * @param deep {boolean} - [deep = true] 是否挂载为全局对象，仅在浏览器模式下并且 isLocal 为布尔值时生效。设置 true 时，实例为单例模式。如果确需重新构建，则调用 destroyed 方法后重新实例化
 * @returns Storage实例
 */

export class Storage {
    private isLocal: boolean | object
    private deep: boolean
    private methodType: F

    private constructor(
        isLocal: boolean | object = false,
        deep: boolean = true
    ) {
        this.isLocal = isLocal
        this.deep = deep
        this.methodType = this.method()
        return this.singleInstance()
    }

    /**
     * 单例模式
     * @returns Storage
     */
    private singleInstance(): Storage {
        if (window && this.deep && typeof this.isLocal === 'boolean') {
            if (!window['$Storage']) {
                window['$Storage'] = this
            }
            return window['$Storage']
        }
        return this
    }

    /**
     * 获取当前实例应用的方法
     * @returns Storage
     */
    private method(): F {
        if (typeof this.isLocal === 'boolean') {
            if (!this.isLocal) return sessionStorage
            return localStorage
        }
        return sessionStorage // AsyncStorage
    }

    /**
     * 检测数据类型
     * @param data {any} 数据源
     * @returns 返回数据类型
     */
    private type(data: mixins): string {
        if (
            (typeof data === 'number' && isNaN(data)) ||
            typeof data === 'undefined'
        ) {
            throw new Error('value is not avaliable')
        }
        if (typeof data === 'number') {
            if (data === Infinity || data === -Infinity) return 'Infinity'
            return 'number'
        } else if (typeof data === 'object' || typeof data === 'boolean') {
            /** 因为对象类型和布尔类型经过 JSON.parse 之后会还原，故此统一处理 | 暂时不支持存储 Set 和 Map 类型*/
            return 'mixins'
        } else {
            return 'string'
        }
    }

    /**
     * 数据类型转换
     * @param {any} data 数据源
     * @returns {string} 转化为字符串的数据格式
     */
    private transformToString(data: mixins): string {
        let type = this.type(data)
        let result: object = {}
        if (type === 'Infinity') {
            result = { type: type, value: String(data) }
        } else {
            result = { type: type, value: data }
        }
        return JSON.stringify(result)
    }

    /**
     * 将字符串数据转化为原始数据
     * @param value {string} 字符串数据
     * @returns 返回原始数据
     */
    private transformStringTo(value: string): mixins {
        let data: { type: string; value: mixins } = JSON.parse(value)
        if (data.type === 'Infinity') {
            return Number(data.value)
        } else {
            return data.value
        }
    }

    /**
     * 设置储存数据，可以设置多个，以对象形式传入
     * @param kv {string | object} 键值，传入对象时代表数据源，对象键值默认为键值
     * @param value {any} 数据源，当 kv 为对象时将丢弃此参数
     * @returns void
     */
    protected set(kv: string | object, value: mixins): void {
        if (typeof kv === 'string') {
            this.methodType.setItem(kv, this.transformToString(value))
        } else {
            for (let k in kv) {
                this.set(k, kv[k])
            }
        }
    }

    /**
     * 获取储存的数据，可以获取多个
     * @param kv {string | Array<string>} 键名，可以传入多个
     * @returns 返回储存的数据
     */
    protected get(kv: string | string[]): mixins {
        let keyList = Object.keys(this.methodType)
        if (typeof kv === 'string') {
            if (keyList.indexOf(kv) === -1) {
                throw new Error('The value is not avaliable')
            }
            return this.transformStringTo(this.methodType.getItem(kv))
        } else {
            let result = {}
            for (let i = 0; i < kv.length; i++) {
                result[kv[i]] = this.get(kv[i])
            }
            return result
        }
    }

    /**
     * 获取全部储存的数据
     * @returns 返回储存数据所组成的对象
     */
    protected getAll(): mixins {
        let keyList = Object.keys(this.methodType)
        return this.get(keyList)
    }

    /**
     * 删除储存的数据，可以删除多个
     * @param kv {string | Array<string>} 键名，可以传入多个
     * @returns void
     */
    protected remove(kv: string | string[]): void {
        let keyList = Object.keys(this.methodType)
        if (typeof kv === 'string') {
            if (keyList.indexOf(kv) === -1) {
                throw new Error('The value is not avaliable')
            }
            this.methodType.removeItem(kv)
        } else {
            for (let i = 0; i < kv.length; i++) {
                this.remove(kv[i])
            }
        }
    }

    /**
     * 删除所有数据
     * @returns void
     */
    protected removeAll(): void {
        this.methodType.clear()
    }

    /**
     * 销毁当前全局实例，仅在单例模式下生效
     * @returns void
     */
    protected destroyed(): void {
        if (window && this.deep && typeof this.isLocal === 'boolean') {
            window['$Storage'] = null
        }
    }
}
