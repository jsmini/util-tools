/*!
 * @jsmini/util-tools 0.1.4 (https://github.com/jdeseva/@jsmini/util-tools)
 * API https://github.com/jdeseva/@jsmini/util-tools/blob/master/doc/api.md
 * Copyright 2017-2021 jdeseva. All Rights Reserved
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

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * @author jdeseva
 * @date 2021.04.13
 * @description 本地存储类 v2
 * @homePage https://github.com/jsmini/util-tools
 */
/**
 * 本地持久化储存实体类
 * @param isSingleInstance {boolean} - true 是否单例模式
 * @returns `Storage` 实例
 */
var Storage = /** @class */ (function () {
    function Storage(isSingleInstance) {
        if (isSingleInstance === void 0) { isSingleInstance = true; }
        this.isSingleInstance = isSingleInstance;
        this.store = this.addListenerToState(JSON.parse(sessionStorage.getItem('store') || '{}'), JSON.parse(localStorage.getItem('store') || '{}'));
        return this.singleInstance();
    }
    /**
     * 单例模式
     * @returns `Storage` 实例
     */
    Storage.prototype.singleInstance = function () {
        if (window && this.isSingleInstance) {
            if (!window['$Storage']) {
                window['$Storage'] = this;
            }
            return window['$Storage'];
        }
        return this;
    };
    /**
     * 添加状态监听器
     */
    Storage.prototype.addListenerToState = function (session, local) {
        var _this = this;
        var L = new Proxy(local, {
            get: function (target, key) {
                _this.checkTimeout(local);
                return target[key];
            },
            set: function (target, key, value) {
                target[key] = value;
                localStorage.setItem('store', JSON.stringify(target));
                return true;
            }
        });
        var S = new Proxy(session, {
            get: function (target, key) {
                _this.checkTimeout(session);
                return target[key];
            },
            set: function (target, key, value) {
                target[key] = value;
                sessionStorage.setItem('store', JSON.stringify(target));
                return true;
            }
        });
        return { L: L, S: S };
    };
    /**
     * 检查储存的数据是否超时
     */
    Storage.prototype.checkTimeout = function (ref) {
        Object.keys(ref).map(function (p) {
            if (ref[p].hasOwnProperty('delay')) {
                if (Date.now() >= ref[p].overTime) {
                    Reflect.deleteProperty(ref, p);
                }
            }
        });
        return ref;
    };
    /**
     * 检测数据类型
     * @param data 数据类型
     * @returns 数据类型
     */
    Storage.prototype.checkType = function (data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    };
    /**
     * 将数据进行一次清洗，进行归一化操作
     * @param data
     * @returns
     */
    Storage.prototype.transfromDataToInstance = function (data) {
        return { type: this.checkType(data), data: data };
    };
    /**
     * 获取 `Storage` 中储存的数据，若不存在 那么会返回 null
     * @param key 需要查找的数据的 key 可以传入一个数组代表查找多个
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     * @returns data
     */
    Storage.prototype.get = function (key, target) {
        var Target = target ? this.store.L : this.store.S;
        if (typeof key === 'string') {
            return (Target[key] || {}).data; // 直接返回结果
        }
        else {
            return key.reduce(function (pre, cur) {
                var _a;
                return __assign({}, pre, (_a = {}, _a[cur] = (Target[cur] || {}).data, _a));
            }, {});
        }
    };
    /**
     * 获取 `Storage` 中存储的所有的数据
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     * @returns data
     */
    Storage.prototype.getAll = function () {
        return this.get(Object.keys(this.store.L).concat(Object.keys(this.store.S)));
    };
    /**
     * 储存数据
     * @param ref key键名 或者 key-value 所组成的键值对对象，如果是 key-value 对象 那么第二个参数会被丢弃
     * @param value value 数据 当 `ref` 为key-value 对象 那么这个值会被丢弃
     * @param delay 储存数据的有效时间，单位：秒 为0 或者不传代表永久有效（在 `localStorage` 模式下）
     * @param target 储存方法 默认 `sessionStorage` 当该值为 `true` 代表 `localStorage`（类型转换后为`true`也算）
     */
    Storage.prototype.set = function (ref, value, delay, target) {
        var _this_1 = this;
        var refType = this.checkType(ref);
        var Target = target ? this.store.L : this.store.S;
        if (refType === 'String') {
            var result = this.transfromDataToInstance(value);
            if (target && delay) {
                result = __assign({}, this.transfromDataToInstance(value), { setTime: Date.now(), delay: delay, overTime: Date.now() + delay * 1000 });
            }
            Target[ref] = result;
        }
        else {
            Object.keys(ref).forEach(function (p) {
                return _this_1.set(p, ref[p]);
            });
        }
        sessionStorage.setItem('store', JSON.stringify(this.store.S));
        localStorage.setItem('store', JSON.stringify(this.store.L));
    };
    /**
     * 删除 `Storage` 中的数据，可以通过传入数组删除多个
     * @param ref 数组的键名，为数组时代表删除多个
     * @param target 目标，默认 `undefined`，代表 `sessionStorage`, 为 `true` 时代表 `localStorage`（类型转换后为`true`也算）
     */
    Storage.prototype.remove = function (ref, target) {
        var _this_1 = this;
        var refType = this.checkType(ref);
        var Target = target ? this.store.L : this.store.S;
        if (refType === 'String') {
            Reflect.deleteProperty(Target, ref);
        }
        else {
            ref.forEach(function (p) { return _this_1.remove(p); });
        }
    };
    /**
     * 删除 `Storage` 中所有的数据
     */
    Storage.prototype.removeAll = function () {
        sessionStorage.removeItem('store');
        localStorage.removeItem('store');
        this.store = {
            L: {},
            S: {},
        };
    };
    /**
     * 销毁 `Storage` 实例
     */
    Storage.prototype.destroyed = function () {
        window['$Storage'] = null;
    };
    return Storage;
}());

exports.__ArrayToMap = __ArrayToMap;
exports.__Debounce = __Debounce;
exports.__MapToArray = __MapToArray;
exports.__Once = __Once;
exports.__Throttle = __Throttle;
exports.__ToTree = __ToTree;
exports.Storage = Storage;
