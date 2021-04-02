/**
 * @author jdeseva
 * @date 2021.04.02
 * @description 本地存储类 v2
 * @homePage https://github.com/jsmini/util-tools
 */

/** ******************************************************** */

/**
 * 本地持久化储存实体类
 * @param isLocal {boolean} - false 储存模式
 * @param isSingleInstance {boolean} - true 是否单例模式
 * @returns `Storage` 实例
 */
export class Storage {
    private isLocal: boolean
    private isSingleInstance: boolean

    private constructor(
        isLocal: boolean = false,
        isSingleInstance: boolean = true
    ) {
        this.isLocal = isLocal
        this.isSingleInstance = isSingleInstance
        this.isSingleInstance && this.singleInstance()
    }

    /**
     * 单例模式
     * @returns `Storage` 实例
     */
    private singleInstance(): Storage {
        if (window && this.isSingleInstance) {
            if (!window['$Storage']) {
                window['$Storage'] = this
            }
            return window['$Storage']
        }
        return this
    }

    /**
     * 检测数据类型
     * @param data 数据类型
     * @returns 数据类型
     */
    private checkType<T>(data: T): string {
        return Object.prototype.toString.call(data).slice(8, -1)
    }

    /**
     * 将数据进行一次清洗，归一化后转化为字符串形式存入 `Storage` 中
     * @param data
     * @returns
     */
    private transfromDataToInstance<T>(data: T): string {
        const result = { type: this.checkType(data), data }
        return JSON.stringify(result)
    }


    /**
     * 获取 `Storage` 中储存的数据，若不存在 那么会返回 null
     * @param key 需要查找的数据的 key 可以传入一个数组代表查找多个
     * @returns data
     */
    protected get<K, T>(key: K): T | null {
        return null
    }

    /**
     * 获取 `Storage` 中存储的所有的数据
     * @returns dataObject
     */
    protected getAll(): object {
        return {}
    }


    /**
     * 储存数据
     * @param ref key键名 或者 key-value 所组成的键值对对象，如果是 key-value 对象 那么第二个参数会被丢弃
     * @param value value 数据 当 `ref` 为key-value 对象 那么这个值会被丢弃
     * @param delay 储存数据的有效时间，单位：秒 为0 或者不传代表永久有效（在 `localStorage` 模式下）
     * @param method 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`
     */
    protected set<T>(ref: string | object, value?: T, delay?: number = 0, method?: undefined | boolean = undefined): void {
        this.transfromDataToInstance(value)
    }

    /**
     * 删除 `Storage` 中的数据，可以通过传入数组删除多个
     * @param key 数组的键名，为数组时代表删除多个
     */
    protected remove<K>(key: K): void {}


    /**
     * 删除 `Storage` 中所有的数据
     */
    protected  removeAll(): void {}
}
