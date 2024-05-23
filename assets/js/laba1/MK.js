onmessage = function(e) {
    importScripts('../../lib/Math.js')

    const borders = e.data[0]
    const strV = e.data[1]
    const fnInput = e.data[2]
    const N = e.data[3]
    const start = e.data[4]
    const monteI = e.data[5]



    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const fn = (f, str,  ...variables) => {
        let scope = {}
        for (let i = 0; i < str.length; i++) {
            scope[str[i]] = variables[i]
        }

        return math.evaluate(f, scope)
    }

    const mkf = (borders, fnInput, strV, n, start) => {
        // let x = []
        // let y = []

        let variables = []
        let variablesMin = []

        // let xMin
        // let yMin

        let f = 0
        for (let i = 0; i < n; i++) {
            // x.push(random(a, b))
            // y.push(random(a, b))

            variables = []
            borders.forEach((border) => {
                variables.push(random(border.left, border.right))
            })

            if(i === 0){
                f = fn(fnInput, strV, ...variables)
                // xMin = x[i]
                // yMin = y[i]

                variablesMin = [...variables]
            }
            else{
                if (fn(fnInput, strV, ...variables) < fn(fnInput, strV, ...variablesMin)){
                    f = fn(fnInput, strV, ...variables)
                    // xMin = x[i]
                    // yMin = y[i]

                    variablesMin = [...variables]
                }
            }
            postMessage(`translateY(${ -(i / n * 226)}px)`)
        }

        const end = new Date().getTime()
        const time = (end - start) / 1000
        let result = []
        for (let i = 0; i < strV.length; i++) {
            result.push(`${strV[i]}Min = <strong> ${variablesMin[i].toFixed(5)}</strong>`)
        }
        result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)
        // result.push(`Переменные: ${strV}`)
        // return result = ["xMin = <strong>" + xMin.toFixed(5) + "</strong>",
        //     "yMin = <strong>" + yMin.toFixed(5) + "</strong>",
        //     "F = <strong>" + f.toFixed(5) + "</strong>",
        //     `Время: <strong>${time}</strong>с`]

        return result
    }

    // mkf(leftBorder, rightBorder, fnInput, N, start)

    // const workerResult = mkf(leftBorder, rightBorder, fnInput, N, start)
    postMessage(mkf(borders, fnInput, strV, N, start));
}