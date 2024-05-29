import { create, evaluateDependencies } from 'mathjs/number'
import { min, max } from 'mathjs'

const add = (a, b) => {
    if (typeof a === 'number' && typeof b === 'object') {
        return {
            left: b.left + a,
            right: b.right + a
        }
    }

    if (typeof a === 'object' && typeof b === 'number') {
        return {
            left: a.left + b,
            right: a.right + b
        }
    }

    if (typeof a === 'object' && typeof b === 'object') {
        return {
            left: a.left + b.left,
            right: a.right + b.right
        }
    }

    return a + b
}
const subtract = (a, b) => {
    if (typeof a === 'object' && typeof b === 'object') {
        return {
            left: a.left - b.right,
            right: a.right - b.left
        }
    }

    if (typeof a === 'object' && typeof b === 'number') {
        return {
            left: a.left - b,
            right: a.right - b
        }
    }

    if (typeof a === 'number' && typeof b === 'object') {
        return {
            left: a - b.right,
            right: a - b.left
        }
    }

    return a - b
}

const multiply = (a, b) => {
    if (typeof a === 'object' && typeof b === 'object') {
        let scalar = [a.left*b.left, a.left*b.right, a.right*b.right, a.right*b.left]
        return Interval(min(scalar), max(scalar))
    }

    if (typeof a === 'object' && typeof b === 'number') {
        return Interval(a.left * b, a.right * b)
    }

    if (typeof a === 'number' && typeof b === 'object') {
        return Interval(a * b.left, a * b.right)
    }

    return a * b
}

const divide = (a, b) => {
    let bb = { left: 1/b.right, right: 1/b.left }
    if (typeof a === 'object' && typeof b === 'object') {
        // let scalar = [a.left*b.left, a.left*b.right, a.right*b.right, a.right*b.left]
        return multiply(a, bb)
    }
    if (typeof a === 'object' && typeof b === 'number') {
        return {
            left: a.left / b,
            right: a.right / b
        }
    }

    if (typeof a === 'number' && typeof b === 'object') {
        return multiply(a, bb)
    }

    return a * b
}

const pow = (a, b) => {
    if (typeof a === 'object' && typeof b === 'number') {
        let leftP = Math.pow(a.left, b)
        let rightP = Math.pow(a.right, b)

        if (b % 2 === 0 && a.left < 0 && a.right >= 0) {
            return Interval(0, max(leftP, rightP))
        }

        return Interval(leftP, rightP)
    }

    return Math.pow(a, b)
}

const unaryMinus = (a) => {
    if (typeof a === 'object') {
        return {
            left: -a.right,
            right: -a.left
        }
    }

    return -a
}

const sin = (a) => {
    let aa = min(Math.sin(a.left), Math.sin(a.right))
    let bb = max(Math.sin(a.left), Math.sin(a.right))

    return Interval(aa, bb)
}

const cos = (a) => {
    let aa = min(Math.cos(a.left), Math.cos(a.right))
    let bb = max(Math.cos(a.left), Math.cos(a.right))

    return Interval(aa, bb)
}

const width = (a) => {
    return a.right - a.left
}

const middle = a => a.left + width(a)/2

const Interval = (a, b) => {
    if (typeof a === 'object') {
        if (a.left > a.right) {
            return { left: a.right, right: a.left }
        }

        return { left: a.left, right: a.right }
    }

    if (a > b) {
        return { left: b, right: a }
    }

    return { left: a, right: b }
}

const copy = o => JSON.parse(JSON.stringify(o))
const mathh = create(evaluateDependencies)
mathh.import({ add, subtract, multiply, divide, pow, unaryMinus, sin, cos }, { override: true })

const fn = (f, str,  ...variables) => {
    let scope = {}
    str.forEach((v, i) => scope[v] = variables[i])
    return mathh.evaluate(f, scope)
}

onmessage = function(e) {
    const [borders, variablesArr, fnInput, eps] = e.data

    const functionInterval = () => {
        const start = new Date().getTime()


        // const fs = []
        // const history = []

        let arr = []

        const intervals = borders.map(border => Interval(border.left, border.right))
        const intervalsWidth = intervals.map(interval => width(interval))

        while (intervalsWidth.some((item) => item > eps)) {
            const maximum = intervalsWidth.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)
            let x = copy(intervals[maximum])
            const otherIntervals = intervals.filter((_, i) => i !== maximum)

            let x1 = Interval(x.left, middle(x))
            let x2 = Interval(middle(x), x.right)

            let f1 = Interval(fn(fnInput, variablesArr, x1, ...otherIntervals))
            let f2 = Interval(fn(fnInput, variablesArr, x2, ...otherIntervals))

            if(middle(f1) < middle(f2)){
                arr.push([f1, f2])
                intervals[maximum] = copy(x1)
            }
            else{
                arr.push([f1, f2])
                intervals[maximum] = copy(x2)
            }
            intervalsWidth[maximum] = width(copy(intervals[maximum]))
        }

        const intervalsMin = [...intervals]
        const f = Interval(fn(fnInput, variablesArr, ...intervalsMin))

        const result = variablesArr.map((variable, i) => `${variablesArr[i]}Min = <strong> (${intervalsMin[i].left.toFixed(5)}, ${intervalsMin[i].right.toFixed(5)})</strong>`)

        const end = new Date().getTime()
        const time = (end - start) / 1000

        result.push(`F = <strong> (${f.left.toFixed(5)}, ${f.right.toFixed(5)})</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)

        postMessage(result)
    }

    functionInterval()
}
