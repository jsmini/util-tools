var base = require('../dist/index.js')
console.log(base)
var list = [
    { pid: 0, name: '1234', id: 1578841 },
    { pid: 1578841, name: 87665, id: 56456798 },
    { pid: 56456798, name: '77777', id: 55879879 }
]
var tree = base.__ToTree(list, 'pid')
console.log(tree)
