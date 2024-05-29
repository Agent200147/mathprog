'use strict';

const generateResultBlock = (title, name, i, additionalClass) => {
    return `
        <div class="result result-${name} main-block"><h2>Результат ${i} ${title}</h2><div class="main-block main-block-white main-block-${name}-${i}">
        <div class="main-block-white-progress ${additionalClass || ''}" id="progress-${name}-${i}"></div>
        <div class="loader" id="${name}-loader-${i}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <defs>
                            <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>
                            <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path>
                        </defs>
                        <g transform="rotate(0 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <use xlink:href="#path" stroke="#000000" stroke-width="3"></use>
                        </g>
                        <g transform="rotate(0 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#e15b64">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="0s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#f8b26a">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.08s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <circle cx="50" cy="15" r="9" fill="#abbd81">
                                <animateMotion dur="0.5s" repeatCount="indefinite" begin="-0.1666s">
                                    <mpath xlink:href="#patha"></mpath>
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
        </div></div>
    `
}

window.addEventListener('load', () => {
    Object.prototype.show = function() { this.style.display = 'flex' }
    Object.prototype.hide = function() { this.style.display = 'none' }

    const methodsWrapper = document.querySelector('.methods')
    const methodsBoolean = []

    const methodsFlags = document.querySelectorAll('.methodFlag')
    methodsFlags.forEach((item, index) => {
        item.addEventListener('input', (e) => {
            if (e.target.checked) {
                methodsWrapper.classList.add(item.id)
            } else {
                methodsWrapper.classList.remove(item.id)
            }
            methodsBoolean[index] = e.target.checked
            console.log(methodsBoolean)
        })
    })

    methodsFlags.forEach((item, index) => {
        if (item.checked) {
            methodsWrapper.classList.add(item.id)
        } else {
            methodsWrapper.classList.remove(item.id)
        }
        methodsBoolean[index] = item.checked

    })
    console.log(methodsBoolean)


    // 1 лабораторная
    const myWorkerMonte = new Worker("assets/js/laba1/MK.js", { type: "module" })
    const monteName = 'monte'

    // const myWorkerMonte = new Worker(new URL("./laba1/MK.js", import.meta.url), { type: "module" });

    const myWorkerAnnealing = new Worker("assets/js/laba1/AN.js", { type: "module" })
    const annealingName = 'annealing'

    // const myWorkerAnnealing = new Worker(new URL("./laba1/AN.js", import.meta.url), { type: "module" });

    const myWorkerGA = new Worker("assets/js/laba2/GA.js", { type: "module" })
    const gaName = 'ga'

    // const myWorkerGA = new Worker(new URL("./laba2/GA.js", import.meta.url), { type: "module" });

    const myWorkerIN = new Worker("assets/js/laba3/INTERVAL.js", { type: "module" })
    const intervalName = 'interval'

    // const myWorkerIN = new Worker(new URL("./laba3/INTERVAL.js", import.meta.url), { type: "module" });


    const form = document.getElementById('form1')
    const resultWrapper = document.getElementById('resultMonte')

    const btnSubmit = document.getElementById('btnSubmit1')
    const btnReset = document.getElementById('btnReset1')
    // const btnStop = document.getElementById('btnStop')
    const btnClear = document.getElementById('btnClear1')

    let monteI = 1
    let annealingI = 1
    let GaI = 1
    let InI = 1

    btnReset.addEventListener('click', () => {
        form.reset()

        methodsFlags.forEach((item) => {
            methodsWrapper.classList.remove(item.id)
        })
    })

    btnClear.addEventListener('click', () => {
        monteI = 1
        annealingI = 1
        GaI = 1
        InI = 1
        resultWrapper.innerHTML = ''
    })

    // ГА
    const flagEps = document.getElementById('flagEps')
    const eps = document.getElementById('eps')

    if (flagEps.checked) {
        eps.show()
    } else {
        eps.hide()
    }

    flagEps.addEventListener('input', (e) => {
        if (e.target.checked) {
            eps.show()
        } else {
            eps.hide()
        }
    })

    let inputsFn = document.querySelectorAll('input')

    inputsFn.forEach((item) => {
        item.addEventListener('dblclick', (e) => {
            if (!e.target.value && e.target.dataset.autocomplete) {
                e.target.value = e.target.dataset.autocomplete
            }
        })
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const leftBorders = document.querySelectorAll('.leftBorder')
        const rightBorders = document.querySelectorAll('.rightBorder')

        let borders = []
        for (let i = 0; i < leftBorders.length; i++) {
            borders.push({left: Number(leftBorders[i].value), right: Number(rightBorders[i].value)})
        }

        console.log(borders)

        const functionInputValue = form.fnInput.value
        let functionVariables = functionInputValue.match(/[a-z\s]+/ig).join('')

        exception.forEach((item) => {
            functionVariables = functionVariables.replaceAll(item, '')
            functionVariables = functionVariables.replaceAll(' ', '')
        })

        let obj = functionVariables.split('').reduce((o, v) => { o[v] = v; return o }, {})
        const variablesArr = Object.keys(obj);

        const start = new Date().getTime()

        // Монте-Карло
        if (methodsBoolean[0]) {
            const iterations = form.monteIteration.value
            resultWrapper.innerHTML += generateResultBlock('Монте-Карло', monteName, monteI)
            // console.log(progressBar)

            myWorkerMonte.postMessage([borders, variablesArr, functionInputValue, iterations])
            btnSubmit.setAttribute('disabled', 'disabled')
            btnClear.setAttribute('disabled', 'disabled')

            console.log('Message posted to worker MK.js')

            myWorkerMonte.onmessage = function(e) {
                const progressBar = document.getElementById(`progress-${monteName}-${monteI}`)

                if (e.data.length !== (variablesArr.length + 2)) {
                    btnSubmit.setAttribute('disabled', 'disabled')
                    btnClear.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }

                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-${monteName}-${monteI}`)
                const monteLoader = document.getElementById(`${monteName}-loader-${monteI}`)
                monteLoader.style.display = 'none'
                progressBar.style.display = 'none'

                monteI++

                monteLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                btnSubmit.removeAttribute('disabled')
                btnClear.removeAttribute('disabled')
            }
        }

        // Имитация отжига
        if (methodsBoolean[1]) {
            const Tmax = form.annealingT.value
            const r = form.annealingR.value
            const L = form.annealingL.value

            resultWrapper.innerHTML += generateResultBlock('Имитация отжига', annealingName, annealingI, `${annealingName}-progress`)

            myWorkerAnnealing.postMessage([borders, variablesArr, functionInputValue, L, Tmax, r, start])
            btnSubmit.setAttribute('disabled', 'disabled')
            btnClear.setAttribute('disabled', 'disabled')

            console.log('Message posted to worker AN.js')

            myWorkerAnnealing.onmessage = function(e) {
                const progressBar = document.getElementById(`progress-${annealingName}-${annealingI}`)

                if (e.data.length !== variablesArr.length + 2) {
                    btnSubmit.setAttribute('disabled', 'disabled')
                    btnClear.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-${annealingName}-${annealingI}`)
                const annealingLoader = document.getElementById(`${annealingName}-loader-${annealingI}`)
                annealingLoader.style.display = 'none'
                progressBar.style.display = 'none'

                annealingI++

                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })
                btnSubmit.removeAttribute('disabled')
                btnClear.removeAttribute('disabled')
            }
        }

        // Генетический алг.
        if (methodsBoolean[2]) {
            const k = form.k.value
            const k2 = form.k2.value
            const n = form.n.value
            const p = form.p.value

            const flagIter = form.flagIter.checked
            const flagEps = form.flagEps.checked
            const flagMachineEps = form.flagMachineEps.checked
            const epsInput = form.eps.value

            if (!flagIter && !flagEps) {
                alert('Выберите какой-либо критерий останова!')
                return false
            }

            if (!epsInput && !flagMachineEps && flagEps) {
                alert('Выберите точность!')
                return false
            }

            resultWrapper.innerHTML += generateResultBlock('Генетический алг.', gaName, GaI)

            myWorkerGA.postMessage([borders, variablesArr, functionInputValue, k, k2, n, p, flagIter, flagEps, flagMachineEps, epsInput, start])
            btnSubmit.setAttribute('disabled', 'disabled')
            btnClear.setAttribute('disabled', 'disabled')

            myWorkerGA.onmessage = function(e) {
                const progressBar = document.getElementById(`progress-${gaName}-${GaI}`)

                if (e.data.length !== variablesArr.length + 2) {
                    btnSubmit.setAttribute('disabled', 'disabled')
                    btnClear.setAttribute('disabled', 'disabled')
                    progressBar.style.transform = e.data
                    return false
                }
                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-${gaName}-${GaI}`)
                const GaLoader = document.getElementById(`${gaName}-loader-${GaI}`)
                GaLoader.style.display = 'none'
                progressBar.style.display = 'none'

                GaI++

                GaLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                console.log(e.data)
                btnSubmit.removeAttribute('disabled')
                btnClear.removeAttribute('disabled')

                // resultMonte.append(output)
            }
        }

        // Интервальный алг.
        if (methodsBoolean[3]) {
            const eps = form.InEps.value

            resultWrapper.innerHTML += generateResultBlock('Интервальный алг.', intervalName, InI)

            myWorkerIN.postMessage([borders, variablesArr, functionInputValue, eps, start])
            btnSubmit.setAttribute('disabled', 'disabled')
            btnClear.setAttribute('disabled', 'disabled')

            myWorkerIN.onmessage = function(e) {
                const progressBar = document.getElementById(`progress-${intervalName}-${InI}`)

                progressBar.style.transform = 'translateY(226px)'
                const output = document.querySelector(`.main-block-${intervalName}-${InI}`)
                const InLoader = document.getElementById(`${intervalName}-loader-${InI}`)
                InLoader.style.display = 'none'
                progressBar.style.display = 'none'

                InI++

                InLoader.style.display = 'none'
                e.data.forEach((item) => {
                    output.innerHTML += `<div>${item}</div>`
                })

                btnSubmit.removeAttribute('disabled')
                btnClear.removeAttribute('disabled')
            }
        }
    })

    const functions = [
        {
            function: '(x + 2y - 7)^2 + (2x + y -5)^2',
            borderX: '-10',
            borderY: '10'
        },
        {
            function: '4x^2 - 2.1x^4 + x^6/3 + x*y - 4y^2 + 4y^4',
            borderX: '-5',
            borderY: '5'
        },
        {
            function: '2x^2 - 1.05x^4 + x^6/3 + x*y + y^2',
            borderX: '-5',
            borderY: '5'
        },
        {
            function: '0.26(x^2 + y^2) - 0.48x*y',
            borderX: '-10',
            borderY: '10'
        },
        {
            function: 'x^2 + y^2 - cos(12x) - cos(18y)',
            borderX: '-1',
            borderY: '1'
        },
        {
            function: '(x^2 + y^2)/200 - cos(x)*cos(y/sqrt(2)) + 1',
            borderX: '-100',
            borderY: '100'
        },
        {
            function: 'x^4 + 4x^3 + 4x^2 + y^2',
            borderX: '-5',
            borderY: '5'
        },

        {
            function: 'sin(x+y) + (x+y)^2 - 1.5x + 2.5y + 1',
            borderX: '-1.5',
            borderY: '4',
            borderX2: '-3',
            borderY2: '3',
        },

        {
            function: '(2x^3 * y - y^3)^2 + (6x - y^2 + y)^2',
            borderX: '-10',
            borderY: '10',
        },

        {
            function: '100(y - y^2)^2 + (1 - x)^2 + 90(z - k^2)^2 + (1 - k)^2 + 10.1((y-1)^2 + (z - 1)^2 + 19.8(y - 1)(z - 1))',
            borderX: '-10',
            borderY: '10',
        },
    ]

    const bordersWrapper = document.getElementById('borders')

    const functionInput = document.getElementById('function-input')
    const flagMachineEps = document.getElementById('flagMachineEps')

    const exception = ['cos', 'sin', 'tan', 'tg', 'ctg']

    functionInput.addEventListener('input', (e) => {
        if (!e.target.value) {
            bordersWrapper.innerHTML = ''
            return
        }

        let value = e.target.value.match(/[a-z\s]+/ig).join('')
        exception.forEach((item) => {
            value = value.replaceAll(item, '')
            value = value.replaceAll(' ', '')
        })

        const obj = value.split('').reduce((o, v, i) => { o[v] = v; return o; }, {});
        const arrUnique = Object.keys(obj);
        const output = arrUnique.join('')

        bordersWrapper.innerHTML = ''

        for (let i = 0; i < output.length; i++) {
            bordersWrapper.innerHTML += `<div class="border">
                            Границы<strong>&nbsp${output[i]}</strong>: <span class="scobka">(</span>
                            <input required type="text" data-autocomplete="-10" placeholder="-10" name="leftBorder${output[i]}" id="leftBorder${output[i]}" class="leftBorder"/>
                            <span class="tz">;</span>
                            <input required type="text" data-autocomplete="10" placeholder="10" name="rightBorder${output[i]}" id="rightBorder${output[i]}" class="rightBorder"/>
                            <span class="scobka">)</span>
                        </div>`
        }

        functions.forEach((item) => {
            if (e.target.value === item.function) {
                document.getElementById(`leftBorder${output[0]}`).value = item.borderX
                document.getElementById(`rightBorder${output[0]}`).value = item.borderY
                document.getElementById(`leftBorder${output[1]}`).value = item.borderX2 || item.borderX
                document.getElementById(`rightBorder${output[1]}`).value = item.borderY2 || item.borderY
            }
        })

        const formInputs = document.querySelectorAll('input')

        formInputs.forEach((item) => {
            item.addEventListener('dblclick', (e) => {
                if (!e.target.value && e.target.dataset.autocomplete) {
                    e.target.value = e.target.dataset.autocomplete
                }
            })
        })
    })

    flagMachineEps.addEventListener('input', (e) => {
        if (e.target.checked) {
            form.eps.value = ''
            form.eps.setAttribute('disabled', 'disabled')
        } else {
            form.eps.removeAttribute('disabled')
        }
    })
})