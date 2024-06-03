import { create, all } from 'mathjs'
const math = create(all)

import { fn, random } from "../utils/index.js";

onmessage = function(e) {
    const [borders, variablesArr, fnInput, L, Tmax, r] = e.data
    const eps = 0.000001

    const step = (borders, fnInput, T, ...variables) => {
        const variables_S = borders.map(border => random(border.left, border.right))

        let delta = fn(fnInput, variablesArr, ...variables_S) - fn(fnInput, variablesArr, ...variables)

        if (delta <= 0 || Math.random() < math.exp(-delta / T)) {
            return variables_S
        } else {
            return variables
        }
    }

    const anneal = () => {
        const start = new Date().getTime()

        let variablesMin = borders.map(border => random(border.left, border.right))

        let T = Tmax
        let T_ = Tmax

        let i = 0
        let sum = 0
        while (T_ > eps) {
            T_ *= r
            sum++
        }

        while (T > eps) {
            for (let i = 0; i < L; i++) {
                variablesMin = step(borders, fnInput, T, ...variablesMin)
            }
            // postMessage(`translateY(${-((i+2) / (sum) * 226)}px)`)
            postMessage((i + 2) / sum * 100)
            i++
            T *= r
        }
        const end = new Date().getTime()
        const time = (end - start) / 1000

        const f = fn(fnInput, variablesArr, ...variablesMin)

        const result = variablesArr.map((variable, i) => `${variable}Min = <strong>${variablesMin[i].toFixed(5)}</strong>`)

        result.push(`F = <strong> ${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)

        postMessage(result)
    }

    anneal()
}
