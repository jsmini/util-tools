/*!
 * @jsmini/util-tools 0.1.3 (https://github.com/jdeseva/@jsmini/util-tools)
 * API https://github.com/jdeseva/@jsmini/util-tools/blob/master/doc/api.md
 * Copyright 2017-2020 jdeseva. All Rights Reserved
 * Licensed under MIT (https://github.com/jdeseva/@jsmini/util-tools/blob/master/LICENSE)
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
function __Once(method) {
    var done = false;
    return function () {
        return done ? undefined : (done = true, method.apply(this, arguments));
    };
}
/**
 * 防抖函数
 * @param method {Function}  事件触发的操作，传入的函数
 * @param delay {Number} - [delay = 500]  多少毫秒内连续触发事件，不会执行
 * @returns {Function}  返回包装之后的函数
 */
function __Debounce(method, delay) {
    if (delay === void 0) { delay = 500; }
    var timer = null;
    return function () {
        var self = this;
        var args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            method.apply(self, args);
        }, delay);
    };
}
/**
 * 节流函数
 * @param method {Function}  事件触发的操作，传入的函数
 * @param delay {Number} - [delay = 500]  间隔多少毫秒需要触发一次事件
 * @returns {Function}  返回包装之后的函数
 */
function __Throttle(method, delay) {
    if (delay === void 0) { delay = 500; }
    var timer;
    var args = arguments;
    var start;
    return function loop() {
        var self = this;
        var now = Date.now();
        if (!start) {
            start = now;
        }
        if (timer) {
            clearTimeout(timer);
        }
        if (now - start >= delay) {
            method.apply(self, args);
            start = now;
        }
        else {
            timer = setTimeout(function () {
                loop.apply(self, args);
            }, 50);
        }
    };
}
/**
 * 将List结构的对象数组转化为树形结构
 * @param data {Array<object>} 源数据
 * @param parentIdKey {string} 关联节点名称
 * @param idKey {string} 主键
 * @returns {Array<object>} 返回的树形结构数据
 */
function __ToTree(data, parentIdKey, idKey) {
    if (idKey === void 0) { idKey = 'id'; }
    var _idMap = Object.create(null);
    data.forEach(function (row) {
        _idMap[row[idKey]] = row;
    });
    var result = [];
    data.forEach(function (row) {
        var parent = _idMap[row[parentIdKey]];
        if (parent) {
            var v = parent.children || (parent.children = []);
            v.push(row);
        }
        else {
            result.push(row);
        }
    });
    return result;
}
/**
 * 将map字典对象转化为List
 * @param {Object} map Map对象
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Array<Object>} 返回数组
 */
function __MapToArray(map, key, val) {
    if (key === void 0) { key = 'name'; }
    if (val === void 0) { val = 'value'; }
    var res = [];
    for (var k in map) {
        var temp = Object.create(null);
        temp[key] = k;
        temp[val] = map[k];
        res.push(temp);
    }
    return res;
}
/**
 * 将数组转化为字典对象类型
 * @param {Array} array 数据
 * @param {String} [key = name] 键名
 * @param {String} [val = value] 键值
 * @returns {Object} 返回map对象字典
 */
function __ArrayToMap(array, key, val) {
    if (key === void 0) { key = 'name'; }
    if (val === void 0) { val = 'value'; }
    var res = Object.create(null); // 新建一个纯粹对象
    array.forEach(function (row) {
        res[row[key]] = row[val];
    });
    return res;
}
/**
 * 本地持久化储存实体类
 * @param isLocal {boolean | object} - [isLocal = false] 储存模式，当不为布尔值时，丢弃第二个参数，并且与实例化传入值无关
 * @param deep {boolean} - [deep = true] 是否挂载为全局对象，仅在浏览器模式下并且 isLocal 为布尔值时生效。设置 true 时，实例为单例模式。如果确需重新构建，则调用 destroyed 方法后重新实例化
 * @returns Storage实例
 */
var Storage = /** @class */ (function () {
    function Storage(isLocal, deep) {
        if (isLocal === void 0) { isLocal = false; }
        if (deep === void 0) { deep = true; }
        this.isLocal = isLocal;
        this.deep = deep;
        this.methodType = this.method();
        return this.singleInstance();
    }
    /**
     * 单例模式
     * @returns Storage
     */
    Storage.prototype.singleInstance = function () {
        if (window && this.deep && typeof this.isLocal === 'boolean') {
            if (!window['$Storage']) {
                window['$Storage'] = this;
            }
            return window['$Storage'];
        }
        return this;
    };
    /**
     * 获取当前实例应用的方法
     * @returns Storage
     */
    Storage.prototype.method = function () {
        if (typeof this.isLocal === 'boolean') {
            if (!this.isLocal)
                return sessionStorage;
            return localStorage;
        }
        else {
            return sessionStorage; // AsyncStorage
        }
    };
    /**
     * 检测数据类型
     * @param data {any} 数据源
     * @returns 返回数据类型
     */
    Storage.prototype.type = function (data) {
        if ((typeof data === 'number' && isNaN(data)) ||
            typeof data === 'undefined') {
            console.error('value is not avaliable');
        }
        if (typeof data === 'number') {
            if (data === Infinity || data === -Infinity)
                return 'Infinity';
            return 'number';
        }
        else if (typeof data === 'object' || typeof data === 'boolean') {
            /** 因为对象类型和布尔类型经过 JSON.parse 之后会还原，故此统一处理 | 暂时不支持存储 Set 和 Map 类型*/
            return 'mixins';
        }
        else {
            return 'string';
        }
    };
    /**
     * 数据类型转换
     * @param {any} data 数据源
     * @returns {string} 转化为字符串的数据格式
     */
    Storage.prototype.transformToString = function (data) {
        var type = this.type(data);
        var result = {};
        if (type === 'Infinity') {
            result = { type: type, value: String(data) };
        }
        else {
            result = { type: type, value: data };
        }
        return JSON.stringify(result);
    };
    /**
     * 将字符串数据转化为原始数据
     * @param value {string} 字符串数据
     * @returns 返回原始数据
     */
    Storage.prototype.transformStringTo = function (value) {
        var data = JSON.parse(value || '{}');
        if (data.type === 'Infinity') {
            return Number(data.value);
        }
        else {
            return data.value;
        }
    };
    /**
     * 设置储存数据，可以设置多个，以对象形式传入
     * @param kv {string | object} 键值，传入对象时代表数据源，对象键值默认为键值
     * @param value {any} 数据源，当 kv 为对象时将丢弃此参数
     * @returns void
     */
    Storage.prototype.set = function (kv, value) {
        if (typeof kv === 'string') {
            this.methodType.setItem(kv, this.transformToString(value));
        }
        else {
            for (var k in kv) {
                this.set(k, kv[k]);
            }
        }
    };
    /**
     * 获取储存的数据，可以获取多个
     * @param kv {string | Array<string>} 键名，可以传入多个
     * @returns 返回储存的数据
     */
    Storage.prototype.get = function (kv) {
        if (typeof kv === 'string') {
            return this.transformStringTo(this.methodType.getItem(kv));
        }
        else {
            var result = {};
            for (var i = 0; i < kv.length; i++) {
                result[kv[i]] = this.get(kv[i]);
            }
            return result;
        }
    };
    /**
     * 获取全部储存的数据
     * @returns 返回储存数据所组成的对象
     */
    Storage.prototype.getAll = function () {
        var keyList = Object.keys(this.methodType);
        return this.get(keyList);
    };
    /**
     * 删除储存的数据，可以删除多个
     * @param kv {string | Array<string>} 键名，可以传入多个
     * @returns void
     */
    Storage.prototype.remove = function (kv) {
        if (typeof kv === 'string') {
            this.methodType.removeItem(kv);
        }
        else {
            for (var i = 0; i < kv.length; i++) {
                this.remove(kv[i]);
            }
        }
    };
    /**
     * 删除所有数据
     * @returns void
     */
    Storage.prototype.removeAll = function () {
        this.methodType.clear();
    };
    /**
     * 销毁当前全局实例，仅在单例模式下生效
     * @returns void
     */
    Storage.prototype.destroyed = function () {
        if (window && this.deep && typeof this.isLocal === 'boolean') {
            window['$Storage'] = null;
        }
    };
    return Storage;
}());

exports.__Once = __Once;
exports.__Debounce = __Debounce;
exports.__Throttle = __Throttle;
exports.__ToTree = __ToTree;
exports.__MapToArray = __MapToArray;
exports.__ArrayToMap = __ArrayToMap;
exports.Storage = Storage;
