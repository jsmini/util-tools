var expect = require('expect.js')
var sinon = require('sinon')

// ts 测试编译后文件

var base = require('../src/index.ts')

describe('单元测试 | __Debounce 和 __Throttle 测试需要使用命令行测试才能完全通过', function () {
    this.timeout(1000)

    let count = -1

    const list = [
        { id: 0, name: '第一层', pid: -1 },
        { id: 1, name: '第二层', pid: 0 },
        { id: 2, name: '第三层', pid: 1 },
    ]

    const map = {
        Vue: 'version --alpha-next',
        React: 'hook 16.8',
        Angular: 'I do',
    }

    let List = []

    let demo1 = true
    let demo2 = { name: 'util-tools', value: '0.1.0' }
    let Nan = NaN
    let number = 100
    let str = 'abc'
    let undef = undefined
    let inf = Infinity

    describe('__Once', () => {
        var { __Once } = base
        var fn = __Once(() => {
            count = count + 1
        })
        fn()
        it('第一次执行后应该相等', () => {
            expect(count).to.equal(0)
        })
        this.timeout(500)
        fn()
        it('第二次调用实际不执行，所以仍然相等', () => {
            expect(count).to.equal(0)
        })
    })

    describe('__Debounce', () => {
        var { __Debounce } = base
        it('初始化值为 0 ', function () {
            expect(count).to.equal(0)
        })
        var fn = __Debounce(() => {
            count = count + 1
        }, 50)
        it('短时间重复执行3遍，结果应该为 0', async (done) => {
            fn()
            fn()
            fn()
            expect(count).to.equal(0)
            done()
        })
        it('超过设定延迟执行1遍，结果应该为 1', () => {
            const clock = sinon.useFakeTimers()
            const logSpy = sinon.spy(console, 'log')
            fn()
            clock.tick(200)
            logSpy.restore()
            clock.restore()
            expect(count).to.equal(1)
        })
    })

    describe('__Throttle', () => {
        var { __Throttle } = base
        it('初始化值为 0 ', function () {
            count = 0
            expect(count).to.equal(0)
        })
        var fn = __Throttle(() => {
            count = count + 1
        }, 100)
        it('一定时间重复执行n遍，结果应该等于 1 * (( 时间 / 间隔 ) - 1 )', () => {
            const clock = sinon.useFakeTimers()
            const logSpy = sinon.spy(console, 'log')

            var timer = setInterval(() => {
                fn()
            }, 10)
            clock.tick(200)
            clearInterval(timer)
            logSpy.restore()
            clock.restore()
            expect(count).to.equal(1)
        })
    })

    describe('__ToTree', () => {
        var { __ToTree } = base
        var tree = __ToTree(list, 'pid')
        it('生成树-第一层', () => {
            expect(tree[0]).to.have.property('name', '第一层')
        })
        it('生成树-第二层', () => {
            expect(tree[0].children[0]).to.have.property('name', '第二层')
        })
        it('生成树-第三层', () => {
            expect(tree[0].children[0].children[0]).to.have.property(
                'name',
                '第三层'
            )
        })
    })

    describe('__MapToArray', () => {
        var { __MapToArray } = base
        List = __MapToArray(map)
        it('将Map对象映射为数组', () => {
            expect(List).to.length(3)
        })
        it('name & value', () => {
            expect(List[0]).to.have.property('name', 'Vue')
        })
    })

    describe('__ArrayToMap', () => {
        var { __ArrayToMap } = base
        var res = __ArrayToMap(List, 'name', 'value')
        var keyList = Object.keys(res)
        it('初始化', () => {
            expect(res).to.have.property('Vue', 'version --alpha-next')
        })
        it('检测长度', () => {
            expect(keyList).to.length(3)
        })
        it('检测键名', () => {
            expect(keyList).to.contain('Vue')
        })
    })

    describe('Storage', () => {
        var { Storage } = base
        let St = null
        if (typeof window === 'undefined') {
            it('环境不为浏览器环境，断言结束', () => {
                expect(1).to.equal(1)
            })
        } else {
            St = new Storage()
            it('实例化', () => {
                var v = new Storage() === St
                expect(v).to.be(true)
            })
            it('报错NaN', () => {
                try {
                    St.set('NaN', Nan)
                } catch (e) {
                    expect(1).to.equal(1)
                    // throw e
                }
            })
            it('报错undefined', () => {
                try {
                    St.set('undefined', undef)
                } catch (e) {
                    expect(1).to.equal(1)
                    //  throw e
                }
            })
            it('复合属性', () => {
                St.set({ str: str, inf: inf, number: number })
                var res = St.get(['str', 'inf', 'number'])
                var kv = Object.values(res)
                let flag = false
                flag =
                    kv.indexOf(str) > -1 &&
                    kv.indexOf(inf) > -1 &&
                    kv.indexOf(number) > -1
                expect(flag).to.be(true)
            })
            it('set - 单值模式', () => {
                St.set('demo1', demo1)
                var getValue = St.get('demo1')
                expect(getValue).to.equal(demo1)
            })
            it('set - 多值模式', () => {
                St.set({ ...demo2, pop: 'React' })
                var getValue = St.get('name')
                expect(getValue).to.equal(demo2.name)
            })
            it('get - 单值模式', () => {
                var getValue = St.get('demo1')
                expect(getValue).to.equal(demo1)
            })
            it('get - 多值模式', () => {
                var getValue = St.get(['demo1', 'name'])
                var v1 = getValue.demo1 === demo1
                var v2 = getValue.name === demo2.name
                expect(v1 && v2).to.be(true)
            })
            it('getAll', () => {
                var getValue = St.getAll()
                var getkeyList = Object.keys(getValue)
                var kL = Object.keys(St.methodType)
                var isExit = true
                for (let i = 0; i < getkeyList.length; i++) {
                    if (kL.indexOf(getkeyList[i]) > -1) {
                        isExit = false
                        break
                    }
                }
                expect(isExit).to.be(false)
            })
            it('remove - 单值模式', () => {
                St.remove('demo1')
                var isValue = St.methodType.getItem('demo1')
                expect(isValue).to.be(null)
            })
            it('remove - 多值模式', () => {
                St.remove(['value', 'name'])
                var isValue =
                    St.methodType.getItem('value') &&
                    St.methodType.getItem('name')
                expect(isValue).to.be(null)
            })
            it('removeAll', () => {
                St.removeAll()
                var k = Object.keys(St.methodType)
                expect(k).to.length(0)
            })
            it('destroyed', () => {
                St.destroyed()
                var k = window['$Storage']
                expect(k).to.be(null)
            })
        }
    })
})
