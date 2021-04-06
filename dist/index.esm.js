/*!
 * @jsmini/util-tools 0.1.4 (https://github.com/jdeseva/@jsmini/util-tools)
 * API https://github.com/jdeseva/@jsmini/util-tools/blob/master/doc/api.md
 * Copyright 2017-2021 jdeseva. All Rights Reserved
 * Licensed under MIT (https://github.com/jdeseva/@jsmini/util-tools/blob/master/LICENSE)
 */

function __Once(method) {
    var done = false;
    return function () {
        return done ? undefined : (done = true, method.apply(this, arguments));
    };
}
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
function __ArrayToMap(array, key, val) {
    if (key === void 0) { key = 'name'; }
    if (val === void 0) { val = 'value'; }
    var res = Object.create(null);
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

var Storage$1 = (function () {
    function Storage(isSingleInstance) {
        if (isSingleInstance === void 0) { isSingleInstance = true; }
        this.isSingleInstance = isSingleInstance;
        this.store = {
            L: JSON.parse(localStorage.getItem('store') || '{}'),
            S: JSON.parse(sessionStorage.getItem('store') || '{}'),
        };
        console.log(this.store);
        return this.singleInstance();
    }
    Storage.prototype.singleInstance = function () {
        if (window && this.isSingleInstance) {
            if (!window['$Storage']) {
                window['$Storage'] = this;
            }
            return window['$Storage'];
        }
        return this;
    };
    Storage.prototype.addListenerToState = function () {
        Object.defineProperty(this.store, 'S', {
            enumerable: true,
            configurable: false,
            set: function (value) {
                console.log('set', this, value);
            },
            get: function () {
                return this.store;
            }
        });
    };
    Storage.prototype.checkTimeout = function () { };
    Storage.prototype.checkType = function (data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    };
    Storage.prototype.transfromDataToInstance = function (data) {
        return { type: this.checkType(data), data: data };
    };
    Storage.prototype.get = function (key, target) {
        var Target = target ? this.store.L : this.store.S;
        if (typeof key === 'string') {
            return (Target[key] || {}).data;
        }
        else {
            return key.reduce(function (pre, cur) {
                var _a;
                return __assign({}, pre, (_a = {}, _a[cur] = (Target[cur] || {}).data, _a));
            }, {});
        }
    };
    Storage.prototype.getAll = function () {
        return this.get(Object.keys(this.store.L).concat(Object.keys(this.store.S)));
    };
    Storage.prototype.set = function (ref, value, delay, target) {
        var _this = this;
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
            Object.keys(ref).forEach(function (p) { return _this.set(p, ref[p]); });
        }
        sessionStorage.setItem('store', JSON.stringify(this.store.S));
        localStorage.setItem('store', JSON.stringify(this.store.L));
    };
    Storage.prototype.remove = function (ref, target) {
        var _this = this;
        var refType = this.checkType(ref);
        var Target = target ? this.store.L : this.store.S;
        if (refType === 'String') {
            Reflect.deleteProperty(Target, ref);
        }
        else {
            ref.forEach(function (p) { return _this.remove(p); });
        }
    };
    Storage.prototype.removeAll = function () {
        this.store = {
            L: {},
            S: {}
        };
    };
    Storage.prototype.destroyed = function () {
        window['$Storage'] = null;
    };
    return Storage;
}());

export { __ArrayToMap, __Debounce, __MapToArray, __Once, __Throttle, __ToTree, Storage$1 as Storage };
