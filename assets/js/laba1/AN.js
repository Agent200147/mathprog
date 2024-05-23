onmessage = function(e) {
    importScripts('../../lib/Math.js')
    const borders = e.data[0]
    const strV = e.data[1]
    const fnInput = e.data[2]
    const L = e.data[3]
    const Tmax = e.data[4]
    const r = e.data[5]
    const eps = 0.000001
    let T = Tmax
    let T_ = Tmax
    const start = e.data[6]

    // const L = 10000

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

    const step = (t, ...variables) => {
        let variables_S = []
        borders.forEach((border) => {
            variables_S.push(random(border.left, border.right))
        })
        let delta = fn(fnInput, strV, ...variables_S) - fn(fnInput, strV, ...variables)

        if(delta <= 0){
            return variables_S
        }
        else{
            let p = math.exp(-delta / t)

            if (Math.random() < p){
                return variables_S
            }
            else{
                return variables
            }
        }
    }

    const anneal = () => {
        // let xMin = select(range)
        // let yMin = select(range)

        // let xMin = random(a, b)
        // let yMin = random(a, b)

        let variablesMin = []
        borders.forEach((border) => {
            variablesMin.push(random(border.left, border.right))
        })

        let i = 0
        let sum = 0
        while(T_ > eps){
            T_ *= r
            sum++
        }

        while(T > eps){
            for (let i = 0; i < L; i++) {
                variablesMin = step(T, ...variablesMin)
            }
            postMessage(`translateY(${- ((i+2) / (sum) * 226)}px)`)
            i++
            T *= r
        }
        const end = new Date().getTime()
        const time = (end - start) / 1000

        const f = fn(fnInput, strV, ...variablesMin)

        let result = []
        for (let i = 0; i < strV.length; i++) {
            result.push(`${strV[i]}Min = <strong> ${variablesMin[i].toFixed(5)}</strong>`)
        }
        result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)

        // return ["xMin = <strong>" + xMin.toFixed(5) + "</strong>", "yMin = <strong>" + yMin.toFixed(5) + "</strong>", "F = <strong>" + fn(xMin, yMin, fnInput).toFixed(5) + "</strong>", `Время: <strong>${time}</strong>с`]
        return result
    }

    postMessage(anneal());
}
