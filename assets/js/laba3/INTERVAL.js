import { create, evaluateDependencies } from 'mathjs/number'
import {min, max} from 'mathjs'

import {isNumeric} from "mathjs";

const add = (a, b) => {
    if( typeof a === 'number' && typeof b === 'object'){
        return {
            left: b.left + a,
            right: b.right + a
        }
    }
    if( typeof a === 'object' && typeof b === 'number'){
        return {
            left: a.left + b,
            right: a.right + b
        }
    }
    if(typeof a === 'object' && typeof b === 'object'){
        return {
            left: a.left + b.left,
            right: a.right + b.right
        }
    }
    else {
        return a + b
    }
}
const subtract = (a, b) => {
    if(typeof a === 'object' && typeof b === 'object'){
        return {
            left: a.left - b.right,
            right: a.right - b.left
        }
    }
    if(typeof a === 'object' && typeof b === 'number'){
        return {
            left: a.left - b,
            right: a.right - b
        }
    }

    if(typeof a === 'number' && typeof b === 'object'){
        return {
            left: a - b.right,
            right: a - b.left
        }
    }
    else{
        return a - b
    }

}
const multiply = (a, b) => {
    if(typeof a === 'object' && typeof b === 'object'){
        let scalar = [a.left*b.left, a.left*b.right, a.right*b.right, a.right*b.left]
        return Interval(min(scalar), max(scalar))
    }
    if(typeof a === 'object' && typeof b === 'number'){
        return Interval(a.left * b, a.right * b)
    }

    if(typeof a === 'number' && typeof b === 'object'){
        return Interval(a * b.left, a * b.right)
    }
    else{
        return a * b
    }
}
const divide = (a, b) => {
    let bb = {left: 1/b.right, right: 1/b.left}
    if(typeof a === 'object' && typeof b === 'object'){
        // let scalar = [a.left*b.left, a.left*b.right, a.right*b.right, a.right*b.left]
        return multiply(a, bb)
    }
    if(typeof a === 'object' && typeof b === 'number'){
        return {
            left: a.left / b,
            right: a.right / b
        }
    }

    if(typeof a === 'number' && typeof b === 'object'){
        return multiply(a, bb)
    }
    else{
        return a * b
    }
}
const pow = (a, b) => {
    if(typeof a === 'object' && typeof b === 'number'){
        let leftP = Math.pow(a.left, b)
        let rightP = Math.pow(a.right, b)
        if(b % 2 === 0){
            if(a.left < 0 && a.right >= 0){
                return Interval(0, max(leftP, rightP))
            }
            else{
                return Interval(leftP, rightP)
            }
        }
        else{
            return Interval(leftP, rightP)
        }

    }
    else{
        return Math.pow(a, b)
    }
}
const unaryMinus = (a) => {
    if(typeof a === 'object'){
        return {
            left: -a.right,
            right: -a.left
        }
    }
    else{
        return -a
    }
}

const sin = (a) => {
    let aa = min(Math.sin(a.left), Math.sin(a.right))
    let bb = max(Math.sin(a.left), Math.sin(a.right))

    // if(-Math.PI/2 < a.right && Math.PI/2 > a.left){
    //     aa = -1
    // }
    // if(Math.PI/2 < a.right && Math.PI/2 > a.left){
    //     bb = 1
    // }
    // if(typeof a === 'object'){
    //     return {
    //         left: -a.right,
    //         right: -a.left
    //     }
    // }
    // else{
    //     return -a
    // }
    return Interval(aa, bb)
}

const cos = (a) => {
    let aa = min(Math.cos(a.left), Math.cos(a.right))
    let bb = max(Math.cos(a.left), Math.cos(a.right))
    // if(typeof a === 'object'){
    //     return {
    //         left: -a.right,
    //         right: -a.left
    //     }
    // }
    // else{
    //     return -a
    // }
    return Interval(aa, bb)
}

const width = (a) => {
    return a.right - a.left
}
const middle = a => a.left + width(a)/2

const Interval = (a, b) => {
    if(typeof a === 'object'){
        if(a.left > a.right){
            return {left: a.right, right: a.left}
        }
        else{
            return {left: a.left, right: a.right}
        }
    }
    else{
        if(a > b){
            return {left: b, right: a}
        }
        else{
            return {left: a, right: b}
        }
    }

}

const copy = o => JSON.parse(JSON.stringify(o))
const mathh = create(evaluateDependencies)
mathh.import({ add, subtract, multiply, divide, pow, unaryMinus, sin, cos }, { override: true })
// console.log(mathh.evaluate('2 + 3 * 4')) // 14

onmessage = function(e) {
    // importScripts('../../../node_modules/mathjs/lib/cjs/number.js')
    // const { create, evaluateDependencies } = require('../../../node_modules/mathjs/lib/cjs/number.js')


    const borders = e.data[0]
    const x = {left: 1, right: 4}
    const y = {left: 1, right: 2}
    const strV = e.data[1]

    let fnInput = e.data[2]
    // fnInput = '(1.5 - x + xy)^2 + (2.25 - x + x*y^2)^2 + (2.625 - x + x*y^3)^2'
    // const k = e.data[3]
    // const k2 = e.data[4]
    // let n = e.data[5]
    // const p = e.data[6]
    // const flagIter = e.data[7]
    // const flagEps = e.data[8]
    // const flagEps2 = e.data[9]
    let eps = e.data[3]


    const start = e.data[4]

    // if(!flagIter){
    //     n = 1000000
    // }
    //
    // if(flagEps2){
    //     eps = 2*(10**(-324))
    // }

    let fprev
    let Pprev

    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const fn = (f, str,  ...variables) => {
        let scope = {}
        for (let i = 0; i < str.length; i++) {
            scope[str[i]] = variables[i]
        }

        return mathh.evaluate(f, scope)
    }

    const generateNullArr = (size) => {
        const arr = []
        for (let i = 0; i < size; i++) {
            arr[i] = 0
        }
        return arr
    }

    const functionInterval = () => {
        // const xxx = {left: -3, right: 1}
        // const yyy = {left: 5, right: 10}
        // return Interval(fn('x^4 + 4x^3 + 4x^2 + y^2', 'xy', xxx, yyy))
        // return Interval(fn('(2x + y -5)^2', 'xy', xxx, yyy))
        // return Interval(fn('(x + 2y - 7)^2 + (2x + y -5)^2', 'xy', xxx, yyy))
        // return Interval(fn('x + (y^2)', 'xy', xxx, yyy))
        // return Interval(fn('x^2 + 1', 'xy', xxx, yyy))
        // return middle(xxx)
        let intervals = []
        const intervalsWidth = []
        const fs = []
        const history = []

        let arr = []


        borders.forEach((border) => {
            let interval = Interval(border.left, border.right)
            intervals.push(Interval(border.left, border.right))
            // arr.push(interval)
            intervalsWidth.push(width(Interval(border.left, border.right)))
        })

        // let x = Interval(borders[0].left, borders[0].right)
        // let y = Interval(borders[1].left, borders[1].right)

        // let x1, x2, y1, y2, f1, f2
        let x
        // arr.push([...intervals])

        while([...intervalsWidth].filter((item) => item > eps).length !== 0){
            let maximum = intervalsWidth.findIndex((item) => item === max(intervalsWidth))
            let x = copy(intervals[maximum])
            let t = [...intervals]
            t.splice(maximum, 1)

            let otherIntervals = [...t]

            let x1 = Interval(x.left, middle(x))
            let x2 = Interval(middle(x), x.right)

            let f1 = Interval(fn(fnInput, strV, x1, ...otherIntervals))
            let f2 = Interval(fn(fnInput, strV, x2, ...otherIntervals))

            if(middle(f1) < middle(f2)){
                arr.push([f1, f2])
                intervals[maximum] = copy(x1)
                intervalsWidth[maximum] = width(copy(intervals[maximum]))
            }
            else{
                arr.push([f1, f2])
                intervals[maximum] = copy(x2)
                intervalsWidth[maximum] = width(copy(intervals[maximum]))
            }

                // x1 = Interval(x.left, middle(x))
                // x2 = Interval(middle(x), x.right)
                //
                // f1 = Interval(fn(fnInput, strV, x1, y))
                // f2 = Interval(fn(fnInput, strV, x2, y))
                //
                // if(width(f1) < width(f2)){
                //     x = x1
                // }
                // else{
                //     x = x2
                // }
                // history.push({x: x1, y: y, f1: f1, f2: f2})

            // }
            // else{
            //     y1 = Interval(y.left, middle(y))
            //     y2 = Interval(middle(y), y.right)
            //
            //     f1 = Interval(fn(fnInput, strV, x, y1))
            //     f2 = Interval(fn(fnInput, strV, x, y2))
            //
            //     if(width(f1) < width(f2)){
            //         y = y1
            //     }
            //     else{
            //         y = y2
            //     }
            // }

        }

        // const xMin = Interval(x)
        // const yMin = Interval(y)

        const intervalsMin = [...intervals]
        // const f = Interval(fn(fnInput, strV, xMin, yMin))
        const f = Interval(fn(fnInput, strV, ...intervalsMin))
        let result = []
        for (let i = 0; i < strV.length; i++) {
            result.push(`${strV[i]}Min = <strong> (${intervalsMin[i].left.toFixed(5)}, ${intervalsMin[i].right.toFixed(5)})</strong>`)
        }

        const end = new Date().getTime()
        const time = (end - start) / 1000

        result.push(`F = <strong> (${f.left.toFixed(5)}, ${f.right.toFixed(5)})</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)
        // result.push(arr)

        // let result = [`xMin = (${xMin.left.toFixed(5)}, ${xMin.right.toFixed(5)}), yMin = (${yMin.left.toFixed(5)}, ${yMin.right.toFixed(5)}), f = (${f.left.toFixed(5)}, ${f.right.toFixed(5)})`]
        // let result = history
        //
        //     // #отбор следующего поколения (количество-размер начальной популяции)
        //     // #сортируем по минимизации функции и берем первые _ меньшие
        //     popChild.sort((a, b) => a[borders.length] - b[borders.length])
        //     for (let j = 0; j < k; j++) {
        //         pop[j] = popChild[j]
        //         Fpop[j] = popChild[j][borders.length]
        //     }
        //
        //
        //     if(i !== 0 && flagEps){
        //         if(Math.abs(pop[0][borders.length] - fprev) <= eps){
        //             break
        //         }
        //     }
        //
        //     postMessage(`translateY(${ -(i / n * 226)}px)`)
        //
        //     // #пересчет значений функции начальной популяции в следующем поколении
        // }



        // let result = []
        // for (let i = 0; i < strV.length; i++) {
        //     result.push(`${strV[i]}Min = <strong> ${variablesMin[i].toFixed(5)}</strong>`)
        // }
        // result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        // result.push(`Время: <strong>${time}</strong>с`)

        // return [pop, Pprev, f , fprev]
        // return result = ["xMin = <strong>" + xMin.toFixed(5) + "</strong>",
        //     "yMin = <strong>" + yMin.toFixed(5) + "</strong>",
        //     "F = <strong>" + f.toFixed(5) + "</strong>",
        //     `Время: <strong>${time}</strong>с`]

        return result
    }

    // mkf(leftBorder, rightBorder, fnInput, N, start)

    // const workerResult = mkf(leftBorder, rightBorder, fnInput, N, start)
    postMessage(functionInterval())
}
