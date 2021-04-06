/**
 * @author jdeseva
 * @date 2021.04.02
 * @description 本地存储类 v2
 * @homePage https://github.com/jsmini/util-tools
 */

/** ******************************************************** */

type M =
    | string
    | number
    | boolean
    | object
    | string[]
    | number[]
    | boolean[]
    | object[]

/**
 * 本地持久化储存实体类
 * @param isSingleInstance {boolean} - true 是否单例模式
 * @returns `Storage` 实例
 */
export class Storage {
    private isSingleInstance: boolean
    private store: Record<string, object>

    private constructor(isSingleInstance: boolean = true) {
        this.isSingleInstance = isSingleInstance
        this.store = {
            L: JSON.parse(localStorage.getItem('store') || '{}'), // localStorage
            S: JSON.parse(sessionStorage.getItem('store') || '{}'), // sessionStorage
        }
        // this.addListenerToState()
        console.log(this.store)
        return this.singleInstance()
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
     * 添加状态监听器
     */
    private addListenerToState(): void {
        Object.defineProperty(this.store, 'S', {
            enumerable: true,
            configurable: false,
            set<T>(value: T): void {
                console.log('set', this, value)
                // this.store = value
            },
            get<T>(): T {
                return this.store
            }
        })
    }

    /**
     * 检查储存的数据是否超时
     */
    private checkTimeout(): void { }

    /**
     * 检测数据类型
     * @param data 数据类型
     * @returns 数据类型
     */
    private checkType<T>(data: T): string {
        return Object.prototype.toString.call(data).slice(8, -1)
    }

    /**
     * 将数据进行一次清洗，进行归一化操作
     * @param data
     * @returns
     */
    private transfromDataToInstance<T>(data: T): object {
        return { type: this.checkType(data), data }
    }

    /**
     * 获取 `Storage` 中储存的数据，若不存在 那么会返回 null
     * @param key 需要查找的数据的 key 可以传入一个数组代表查找多个
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     * @returns data
     */
    protected get<T>(key: string | string[], target?: boolean): T | M {
        const Target = target ? this.store.L : this.store.S
        if (typeof key === 'string') {
            return (Target[key] || {}).data // 直接返回结果
        } else {
            return (key as string[]).reduce((pre: T | object, cur: string): T | object => {
                return { ...pre, [cur]: (Target[cur] || {}).data }
            }, {})
        }

    }

    /**
     * 获取 `Storage` 中存储的所有的数据
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     * @returns data
     */
    protected getAll<T>(): T | M {
        return this.get([...Object.keys(this.store.L), ...Object.keys(this.store.S)])
    }

    /**
     * 储存数据
     * @param ref key键名 或者 key-value 所组成的键值对对象，如果是 key-value 对象 那么第二个参数会被丢弃
     * @param value value 数据 当 `ref` 为key-value 对象 那么这个值会被丢弃
     * @param delay 储存数据的有效时间，单位：秒 为0 或者不传代表永久有效（在 `localStorage` 模式下）
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     */
    protected set<T>(
        ref: string | Record<string, T>,
        value?: T,
        delay?: number,
        target?: undefined
    ): void {
        const refType = this.checkType(ref)
        const Target = target ? this.store.L : this.store.S
        if (refType === 'String') {
            let result: T | object = this.transfromDataToInstance(value)
            if (target && delay) {
                result = {
                    ...this.transfromDataToInstance(value),
                    setTime: Date.now(),
                    delay,
                    overTime: Date.now() + delay * 1000,
                }
            }
            Target[ref as string] = result
        } else {
            Object.keys(ref as Record<string, T>).forEach((p: string): void => this.set(p, ref[p]))
        }
        sessionStorage.setItem('store', JSON.stringify(this.store.S))
        localStorage.setItem('store', JSON.stringify(this.store.L))
    }

    /**
     * 删除 `Storage` 中的数据，可以通过传入数组删除多个
     * @param ref 数组的键名，为数组时代表删除多个
     * @param target 目标，默认 `undefined`，代表 `sessionStorage`, 为 `true` 时代表 `localStorage`（类型转换后为`true`也算）
     */
    protected remove(ref: string | string[], target?: boolean): void {
        const refType = this.checkType(ref)
        const Target = target ? this.store.L : this.store.S
        if (refType === 'String') {
            Reflect.deleteProperty(Target, ref as string)
        } else {
            (ref as string[]).forEach((p: string): void => this.remove(p))
        }
    }

    /**
     * 删除 `Storage` 中所有的数据
     */
    protected removeAll(): void {
        this.store = {
            L: {},
            S: {}
        }
    }

    /**
     * 销毁 `Storage` 实例
     */
    protected destroyed(): void {
        window['$Storage'] = null
    }
}
