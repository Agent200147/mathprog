import { fn } from "../utils/index.js";

onmessage = function(e) {
    const [borders, variablesArr, fnInput, N] = e.data
    const random = (min, max) => Math.random() * (max - min) + min

    const mkf = () => {
        const start = new Date().getTime()

        let variablesMin = new Array(variablesArr.length).fill(0)
        let f = 0

        for (let i = 0; i < N; i++) {
            const variables = borders.map(border => random(border.left, border.right))

            const currentValue = fn(fnInput, variablesArr, ...variables)
            if (i === 0 || currentValue < f) {
                f = currentValue
                variablesMin = [...variables]
            }
            // postMessage(`translateY(${-i / N * 226}px)`)
            postMessage(i/N*100)
        }

        const end = new Date().getTime()
        const time = (end - start) / 1000
        const result = variablesArr.map((v, i) => `${v}Min = <strong>${variablesMin[i].toFixed(5)}</strong>`)
        result.push(`F = <strong>${f.toFixed(5)}</strong>`)
        result.push(`Время: <strong>${time}</strong>с`)
        postMessage(result)
    }

    mkf()
}
